import api from "@/utils/api"
import { defineStore } from "pinia"
import { computed, reactive, watch } from "vue"
import { toast } from "vue-sonner"
import { useUser } from "./user"

export type TeamMember = {
	full_name: string
	user_image: string | null
	email: string
	can_edit_team: boolean
	is_owner: boolean
}

export const useTeam = defineStore("team", () => {
	const user = useUser()
	const currentTeam = computed(() => user.currentTeam)

	const teamMembersResource = reactive({
		data: [] as TeamMember[],
		loading: false,
		async fetch() {
			if (!currentTeam.value?._id) return
			this.loading = true
			try {
				const resp = await api.get(`/teams/${currentTeam.value._id}/members`)
				this.data = resp.data
			} catch (err) {
				this.data = []
			} finally {
				this.loading = false
			}
		},
	})

	const teamMembers = computed<TeamMember[]>(() => teamMembersResource.data)

	function initialize() {
		teamMembersResource.fetch()
	}

	async function toggleEditPermissionForMember(member_email: string) {
		try {
			await api.post(
				`/teams/${currentTeam.value?._id}/members/toggle-permission`,
				{ member_email },
			)
			await teamMembersResource.fetch()
			toast.info("Edit Permission Updated")
		} catch (err) {
			toast.error("Failed to update edit permission")
		}
	}

	async function removeMemberFromTeam(member_email: string) {
		try {
			await api.post(`/teams/${currentTeam.value?._id}/members/remove`, {
				member_email,
			})
			await teamMembersResource.fetch()
			toast.success("Member removed from team")
		} catch (err) {
			toast.error("Failed to remove member from team")
		}
	}

	async function save(fields: { team_name?: string; logo?: string }) {
		try {
			await api.patch(`/teams/${currentTeam.value?._id}`, fields)
			toast.success("Team Details Updated")
			await teamMembersResource.fetch()
			user.fetchUserTeams()
		} catch (err: any) {
			toast.error("Failed to update team " + err.message)
		}
	}

	watch(
		currentTeam,
		() => {
			teamMembersResource.fetch()
		},
		{ immediate: true },
	)

	return {
		currentTeam,
		teamMembers,
		teamMembersResource,
		initialize,
		toggleEditPermissionForMember,
		removeMemberFromTeam,
		save,
	}
})
