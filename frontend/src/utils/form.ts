import api from "./api"

/**
 * Check if login is required for a form submission page.
 *
 * @param route - The route of the form to check.
 *
 * @returns bool - True if login is required, False otherwise.
 */
export async function isLoginRequired(route: string) {
	try {
		const response = await api.get("/forms/login-required", {
			params: { route },
		})
		return response.data.loginRequired
	} catch (error) {
		return false
	}
}
