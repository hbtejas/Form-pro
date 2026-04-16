import api from "./api"

export const createNewFormWithDoctype = async (
	linked_doctype: string,
	team_id: string,
) => {
	const response = await api.post("/forms/from-doctype", {
		doctype: linked_doctype,
		team_id: team_id,
	})
	return response.data
}

export const createNewForm = async (team_id: string) => {
	const response = await api.post("/forms", {
		team_id: team_id,
		title: "Untitled Form",
		is_published: false,
	})
	return response.data
}

export const validateFormRoute = async (
	curr_form_id: string,
	route: string,
) => {
	const response = await api.get(`/forms/validate-route/${route}`, {
		params: { exclude_id: curr_form_id },
	})
	return response.data.exists
}
