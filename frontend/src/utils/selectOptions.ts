import api from "@/utils/api"
import type { ComputedRef, Ref } from "vue"
import { ref, watch } from "vue"

export type SelectOption = {
	label: string
	value: string
}

export type FieldForOptions = {
	fieldtype?: string
	options?: string
	[key: string]: unknown
}

/**
 * Resolves options for Select and Link form fields.
 * Returns string[] for Select (newline-separated options), API result for Link, or raw options otherwise.
 */
export async function getFieldOptions(
	field: FieldForOptions,
): Promise<string[] | SelectOption[] | string | ""> {
	if (!field?.options) {
		return ""
	}

	if (field.fieldtype === "Select") {
		return field.options.split("\n")
	}

	if (field.fieldtype === "Link") {
		const response = await api.get("/forms/link-options", {
			params: {
				doctype: field.options,
			},
		})
		return response.data as string[] | SelectOption[]
	}

	return field.options
}

/**
 * Composable to load and reactively track options for a Select/Link field.
 * Call load() or rely on automatic load on mount and when field type/options change.
 */
export function useFieldOptions(
	field: Ref<FieldForOptions> | ComputedRef<FieldForOptions>,
) {
	const options = ref<string[] | SelectOption[] | null>(null)

	const load = async () => {
		const result = await getFieldOptions(field.value)
		options.value =
			result === "" || result === undefined
				? null
				: (result as string[] | SelectOption[])
	}

	watch(
		() => [field.value.fieldtype, field.value.options],
		() => load(),
		{ immediate: true },
	)

	return { options, load }
}
