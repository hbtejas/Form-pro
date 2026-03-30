<script setup lang="ts">
import { Button } from "@/components/ui"
import api from "@/utils/api"
import { mapDoctypeFieldForForm } from "@/utils/form_fields"
import { X } from "lucide-vue-next"
import { computed, onMounted, ref } from "vue"
import FieldRenderer from "../builder/FieldRenderer.vue"

type Row = {
	[key: string]: any
}

const rows = defineModel<Row[]>({ default: [] })

type Props = {
	inEditMode: boolean
	doctype: string
}

const props = defineProps<Props>()

const columnsData = ref<any[]>([])

async function fetchColumns() {
	if (!props.doctype) return
	try {
		const resp = await api.get("/doctypes/fields", {
			params: { doctype: props.doctype },
		})
		columnsData.value = resp.data
	} catch (err) {
		columnsData.value = []
	}
}

onMounted(fetchColumns)

const columns = computed(() => {
	return columnsData.value.map((column: any) => ({
		label: column.label,
		key: column.fieldname,
		...column,
		fieldtype: mapDoctypeFieldForForm(column.fieldtype) ?? "Data",
	}))
})

function addRow() {
	const newRow = columns.value.reduce((acc, column) => {
		acc[column.key] = null
		return acc
	}, {} as Row)
	rows.value = [...(rows.value ?? []), newRow]
}

function removeRow(index: number) {
	rows.value = rows.value?.filter((_, i) => i !== index) ?? []
}

function updateCell(rowIndex: number, key: string, value: unknown) {
	const list = rows.value ?? []
	if (rowIndex < 0 || rowIndex >= list.length) return
	rows.value = list.map((row, i) =>
		i === rowIndex ? { ...row, [key]: value } : row,
	)
}
</script>
<template>
    <div class="flex flex-col gap-5 p-4 bg-gray-50 border rounded">
        <div v-if="!rows.length" class="flex flex-col gap-2 items-center justify-center">
            <h5 class="text-base font-medium text-gray-600">No rows added</h5>
            <p class="text-sm text-gray-500">Add an item to get started</p>
        </div>
        <div
            v-for="(_, index) in rows"
            :key="index"
            class="pb-4 border p-4 rounded bg-white relative mb-4 shadow-sm"
        >
            <Button
                variant="outline"
                class="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center rounded-full bg-white"
                @click="removeRow(index)"
            >
                <template #icon-left>
                    <X class="w-4 h-4" />
                </template>
            </Button>
            <FieldRenderer
                v-for="column in columns"
                :key="column.key"
                :model-value="rows[index][column.key]"
                @update:model-value="updateCell(index, column.key, $event)"
                :field="column"
                :in-edit-mode="false"
            />
        </div>
    </div>
    <Button v-if="!inEditMode" variant="solid" class="mt-4" @click="addRow">Add Row</Button>
</template>

