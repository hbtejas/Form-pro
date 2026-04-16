import { defineComponent, h, ref } from "vue"

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = defineComponent({
	name: "Input",
	props: ["modelValue", "placeholder", "type", "disabled", "readonly"],
	emits: ["update:modelValue"],
	setup(props, { emit, slots }) {
		return () =>
			h("div", { class: "relative flex items-center w-full" }, [
				slots.prefix
					? h("div", { class: "absolute left-3 text-gray-400" }, slots.prefix())
					: null,
				h("input", {
					class: `border border-gray-300 rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${slots.prefix ? "pl-10" : ""} ${slots.suffix ? "pr-10" : ""} ${props.disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : "bg-white"}`,
					value: props.modelValue,
					placeholder: props.placeholder,
					type: props.type || "text",
					disabled: props.disabled,
					readonly: props.readonly,
					onInput: (e: any) => emit("update:modelValue", e.target.value),
				}),
				slots.suffix
					? h(
							"div",
							{ class: "absolute right-3 text-gray-400" },
							slots.suffix(),
						)
					: null,
			])
	},
})

export const TextInput = Input
export const FormControl = Input
export const DatePicker = Input
export const DateTimePicker = Input
export const DateRangePicker = Input
export const Rating = Input
export const TimePicker = Input

// ─── Password ─────────────────────────────────────────────────────────────────
export const Password = defineComponent({
	name: "Password",
	props: ["modelValue", "placeholder", "disabled"],
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const showPw = ref(false)
		return () =>
			h(Input, {
				type: showPw.value ? "text" : "password",
				modelValue: props.modelValue,
				placeholder: props.placeholder,
				disabled: props.disabled,
				"onUpdate:modelValue": (val: any) => emit("update:modelValue", val),
			})
	},
})

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = defineComponent({
	name: "Textarea",
	props: ["modelValue", "placeholder", "disabled", "rows"],
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		return () =>
			h("textarea", {
				class: `border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 min-h-24 outline-none transition-colors ${props.disabled ? "bg-gray-50 cursor-not-allowed" : ""}`,
				value: props.modelValue,
				placeholder: props.placeholder,
				disabled: props.disabled,
				rows: props.rows || 4,
				onInput: (e: any) => emit("update:modelValue", e.target.value),
			})
	},
})

export const TextEditor = Textarea

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export const Checkbox = defineComponent({
	name: "Checkbox",
	props: ["modelValue", "label", "disabled"],
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		return () =>
			h(
				"label",
				{ class: "flex items-center gap-2 cursor-pointer select-none" },
				[
					h("input", {
						type: "checkbox",
						class: "w-4 h-4 accent-blue-600",
						checked: props.modelValue,
						disabled: props.disabled,
						onChange: (e: any) => emit("update:modelValue", e.target.checked),
					}),
					props.label
						? h("span", { class: "text-sm text-gray-700" }, props.label)
						: null,
				],
			)
	},
})

export const Switch = Checkbox

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = defineComponent({
	name: "Button",
	props: [
		"variant",
		"label",
		"disabled",
		"loading",
		"theme",
		"iconLeft",
		"size",
	],
	emits: ["click"],
	setup(props, { slots, emit }) {
		return () => {
			const isGhost = props.variant === "ghost"
			const isRed = props.theme === "red"
			const base =
				"inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2"
			const variants: Record<string, string> = {
				solid: isRed
					? `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-300`
					: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300`,
				ghost: isRed
					? `${base} text-red-600 hover:bg-red-50 focus:ring-red-100 border-0`
					: `${base} text-gray-700 hover:bg-gray-100 focus:ring-gray-100 border-0`,
				outline: `${base} border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-100`,
			}
			const cls = `${variants[props.variant || "outline"]} ${props.disabled || props.loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`

			return h(
				"button",
				{
					class: cls,
					disabled: props.disabled || props.loading,
					onClick: (e: any) => emit("click", e),
				},
				[
					props.loading
						? h("span", {
								class:
									"animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full",
							})
						: null,
					props.iconLeft ? h(props.iconLeft, { class: "w-4 h-4" }) : null,
					slots.default ? slots.default() : props.label || null,
				],
			)
		}
	},
})

// ─── Select / Combobox ────────────────────────────────────────────────────────
export const Select = defineComponent({
	name: "Select",
	props: ["modelValue", "options", "placeholder", "disabled"],
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		return () =>
			h(
				"select",
				{
					class: `border border-gray-300 rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white ${props.disabled ? "bg-gray-50 cursor-not-allowed" : ""}`,
					value: props.modelValue,
					disabled: props.disabled,
					onChange: (e: any) =>
						emit("update:modelValue", (e.target as HTMLSelectElement).value),
				},
				[
					props.placeholder
						? h("option", { value: "", disabled: true }, props.placeholder)
						: null,
					...(props.options?.map((opt: any) => {
						const val = typeof opt === "string" ? opt : opt.value
						const label = typeof opt === "string" ? opt : opt.label
						return h("option", { value: val }, label)
					}) || []),
				],
			)
	},
})

export const Combobox = Select

// ─── Dropdown ─────────────────────────────────────────────────────────────────
export const Dropdown = defineComponent({
	name: "Dropdown",
	props: ["button", "options", "placement"],
	setup(props) {
		const isOpen = ref(false)

		const close = () => {
			isOpen.value = false
		}
		const toggle = () => {
			isOpen.value = !isOpen.value
		}

		return () =>
			h("div", { class: "relative inline-block text-left" }, [
				// Trigger button
				h(
					"button",
					{
						class: `inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
							props.button?.variant === "solid"
								? "bg-blue-600 text-white hover:bg-blue-700"
								: props.button?.variant === "ghost"
									? "text-gray-700 hover:bg-gray-100"
									: "border border-gray-300 text-gray-700 hover:bg-gray-50"
						}`,
						onClick: toggle,
					},
					props.button?.label || "Options",
				),

				// Overlay to close on outside click
				isOpen.value
					? h("div", {
							class: "fixed inset-0 z-40",
							onClick: close,
						})
					: null,

				// Dropdown menu
				isOpen.value
					? h(
							"div",
							{
								class:
									"absolute left-0 mt-1 min-w-[160px] rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150",
							},
							props.options?.map((opt: any) =>
								h(
									"button",
									{
										class:
											"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",
										onClick: () => {
											opt.onClick?.()
											close()
										},
									},
									opt.label,
								),
							),
						)
					: null,
			])
	},
})

// ─── Popover ──────────────────────────────────────────────────────────────────
export const Popover = defineComponent({
	name: "Popover",
	props: ["placement"],
	setup(props, { slots }) {
		const isOpen = ref(false)
		const togglePopover = () => {
			isOpen.value = !isOpen.value
		}
		return () =>
			h("div", { class: "relative inline-block" }, [
				slots.target?.({ togglePopover, isOpen: isOpen.value }),
				isOpen.value
					? h("div", {
							class: "fixed inset-0 z-40",
							onClick: () => {
								isOpen.value = false
							},
						})
					: null,
				isOpen.value
					? h(
							"div",
							{ class: "absolute z-50 mt-1 animate-in fade-in duration-150" },
							slots.body?.(),
						)
					: null,
			])
	},
})

// ─── Dialog / Modal ───────────────────────────────────────────────────────────
export const Dialog = defineComponent({
	name: "Dialog",
	props: ["modelValue", "options"],
	emits: ["update:modelValue"],
	setup(props, { slots, emit }) {
		const close = () => emit("update:modelValue", false)
		return () =>
			props.modelValue
				? h(
						"div",
						{
							class:
								"fixed inset-0 z-[100] flex items-center justify-center p-4",
						},
						[
							h("div", {
								class: "absolute inset-0 bg-black/50 backdrop-blur-sm",
								onClick: close,
							}),
							h(
								"div",
								{
									class:
										"relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10",
								},
								[
									h(
										"div",
										{
											class:
												"px-6 py-4 border-b flex justify-between items-center",
										},
										[
											h(
												"h3",
												{ class: "text-lg font-semibold text-gray-900" },
												props.options?.title || "Dialog",
											),
											h(
												"button",
												{
													class:
														"text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors",
													onClick: close,
												},
												"×",
											),
										],
									),
									h(
										"div",
										{ class: "px-6 py-6" },
										slots["body-content"]?.() || slots.default?.(),
									),
									slots.actions
										? h(
												"div",
												{
													class:
														"px-6 py-4 border-t bg-gray-50 flex justify-end gap-3",
												},
												slots.actions({ close }),
											)
										: null,
								],
							),
						],
					)
				: null
	},
})

// ─── Misc ──────────────────────────────────────────────────────────────────────
export const Alert = defineComponent({
	name: "Alert",
	props: ["type"],
	setup(props, { slots }) {
		return () =>
			h(
				"div",
				{
					class:
						"p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm",
				},
				slots.default?.(),
			)
	},
})

export const Badge = defineComponent({
	name: "Badge",
	props: ["theme"],
	setup(props, { slots }) {
		return () =>
			h(
				"span",
				{
					class:
						"px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium",
				},
				slots.default?.(),
			)
	},
})

export const ErrorMessage = defineComponent({
	name: "ErrorMessage",
	setup(_, { slots }) {
		return () =>
			h("p", { class: "text-red-500 text-sm mt-1" }, slots.default?.())
	},
})

export const LoadingIndicator = defineComponent({
	name: "LoadingIndicator",
	setup() {
		return () =>
			h("div", {
				class:
					"animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent",
			})
	},
})

export const LoadingText = defineComponent({
	name: "LoadingText",
	props: ["label"],
	setup(props) {
		return () =>
			h("div", { class: "flex items-center gap-2 text-gray-500 text-sm" }, [
				h(LoadingIndicator),
				h("span", props.label || "Loading..."),
			])
	},
})

export const Breadcrumbs = defineComponent({
	name: "Breadcrumbs",
	props: ["items"],
	setup(props) {
		return () =>
			h(
				"nav",
				{ class: "flex items-center gap-1 text-sm text-gray-500" },
				props.items
					?.flatMap((item: any, i: number) => [
						h(
							"span",
							{
								class:
									i === props.items.length - 1
										? "text-gray-900 font-medium"
										: "",
							},
							item.label,
						),
						i < props.items.length - 1
							? h("span", { class: "text-gray-400" }, "/")
							: null,
					])
					.filter(Boolean),
			)
	},
})

export const Sidebar = defineComponent({
	name: "Sidebar",
	props: ["sections"],
	setup(props, { slots }) {
		return () =>
			h("div", { class: "flex h-full" }, [
				h(
					"aside",
					{
						class:
							"w-64 flex flex-col bg-gray-50 border-r border-gray-200 h-full",
					},
					[
						h(
							"div",
							{ class: "p-4 border-b border-gray-200" },
							slots.header?.(),
						),
						h(
							"nav",
							{ class: "flex-1 p-3 space-y-4 overflow-y-auto" },
							props.sections?.map((section: any) =>
								h("div", [
									section.label
										? h(
												"p",
												{
													class:
														"px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1",
												},
												section.label,
											)
										: null,
									h(
										"div",
										{ class: "space-y-0.5" },
										section.items?.map((item: any) =>
											h(
												"a",
												{
													href: item.to,
													class:
														"flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors",
												},
												[
													item.icon
														? h(item.icon, { class: "w-4 h-4 text-gray-500" })
														: null,
													h("span", item.label),
												],
											),
										),
									),
								]),
							),
						),
						h(
							"div",
							{ class: "p-3 border-t border-gray-200" },
							slots["footer-items"]?.({ isCollapsed: false }),
						),
					],
				),
			])
	},
})

export const Tooltip = defineComponent({
	name: "Tooltip",
	props: ["text"],
	setup(props, { slots }) {
		return () =>
			h("div", { class: "relative group" }, [
				slots.default?.(),
				props.text
					? h(
							"div",
							{
								class:
									"absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none",
							},
							props.text,
						)
					: null,
			])
	},
})

export const TabButtons = defineComponent({
	name: "TabButtons",
	props: ["options", "modelValue"],
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		return () =>
			h(
				"div",
				{ class: "flex bg-gray-100 p-1 rounded-lg gap-1" },
				props.options?.map((opt: any) =>
					h(
						"button",
						{
							class: `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
								props.modelValue === opt.value
									? "bg-white text-blue-600 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`,
							onClick: () => emit("update:modelValue", opt.value),
						},
						[
							opt.icon
								? h(opt.icon, { class: "w-4 h-4 inline-block mr-1.5" })
								: null,
							opt.label,
						],
					),
				),
			)
	},
})

export const FeathersIcon = defineComponent({
	name: "FeathersIcon",
	props: ["name"],
	setup(props) {
		return () =>
			h("span", { class: "text-gray-400 text-xs" }, `[${props.name}]`)
	},
})
