import axios from "axios"

const api = axios.create({
	baseURL: "/api",
})

const AUTH_REDIRECT_IN_PROGRESS_KEY = "auth_redirect_in_progress"

function redirectToLoginOnce() {
	const { pathname, search } = window.location

	// Never force reload when already on login page.
	if (pathname === "/login") {
		sessionStorage.removeItem(AUTH_REDIRECT_IN_PROGRESS_KEY)
		return
	}

	if (sessionStorage.getItem(AUTH_REDIRECT_IN_PROGRESS_KEY) === "1") {
		return
	}

	sessionStorage.setItem(AUTH_REDIRECT_IN_PROGRESS_KEY, "1")
	const redirectTo = `${pathname}${search}`
	window.location.replace(
		`/login?redirect-to=${encodeURIComponent(redirectTo)}`,
	)
}

// Attach JWT token to every request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token")
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
		sessionStorage.removeItem(AUTH_REDIRECT_IN_PROGRESS_KEY)
	}
	return config
})

// Handle 401 responses (token expired / invalid)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.clear()
			redirectToLoginOnce()
		}
		return Promise.reject(error)
	},
)

export const getForms = (teamId?: string) =>
	api
		.get("/forms", { params: { team_id: teamId } })
		.then((res: any) => res.data)

export const getForm = (idOrRoute: string) =>
	api.get(`/forms/${idOrRoute}`).then((res: any) => res.data)

export const createForm = (data: any) =>
	api.post("/forms", data).then((res: any) => res.data)

export const updateForm = (id: string, data: any) =>
	api.put(`/forms/${id}`, data).then((res: any) => res.data)

export const submitForm = (id: string, submissionData: any) =>
	api
		.post(`/forms/${id}/submissions`, { values: submissionData })
		.then((res: any) => res.data)

export const validateRoute = (route: string, excludeId?: string) =>
	api
		.get(`/forms/validate-route/${route}`, {
			params: { exclude_id: excludeId },
		})
		.then((res: any) => res.data)

export default api
