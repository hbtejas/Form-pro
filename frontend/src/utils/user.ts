import api from "./api"

export type GetUserBasicResponse = {
	full_name: string
	user_image: string | null
}

export async function getUser(userId: string) {
	const response = await api.get(`/user/${userId}`)
	return response.data
}
