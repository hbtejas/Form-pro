import { userResource } from "@/data/user"
import { isLoginRequired } from "@/utils/form"
import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import { session } from "./data/session"

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/pages/home/Home.vue"),
		children: [
			{
				path: "",
				name: "Dashboard",
				component: () => import("@/pages/home/Dashboard.vue"),
			},
			{
				path: "team",
				name: "Manage Team",
				component: () => import("@/pages/team/ManageTeam.vue"),
			},
		],
	},
	{
		path: "/manage/:id",
		name: "Manage Form",
		component: () => import("@/pages/manage/ManageForm.vue"),
		redirect: { name: "Manage Form Overview" },
		children: [
			{
				path: "overview",
				name: "Manage Form Overview",
				component: () => import("@/pages/manage/overview/Overview.vue"),
			},
		],
	},
	{
		path: "/edit-form/:id",
		name: "Edit Form",
		component: () => import("@/pages/EditForm.vue"),
	},
	{
		path: "/p/:route(.*)",
		name: "Form Submission Page",
		component: () => import("@/pages/SubmissionPage.vue"),
		meta: { allowGuest: true },
		beforeEnter: async (to, _from) => {
			const loginRequired = await isLoginRequired(to.params.route as string)

			if (loginRequired && !session.isLoggedIn) {
				window.location.href = `/login?redirect-to=${encodeURIComponent(to.fullPath)}`
				return false
			}
			return true
		},
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/pages/Login.vue"),
		meta: { allowGuest: true },
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/",
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, _from, next) => {
	const isLoggedIn = !!session.user

	if (to.name === "Login" && isLoggedIn) {
		return next({ name: "Dashboard" })
	}

	if (to.meta.allowGuest !== true && !isLoggedIn) {
		return next({ name: "Login" })
	}

	next()
})

export default router
