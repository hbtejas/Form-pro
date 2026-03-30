import { defineComponent, h, ref } from 'vue';


export const Input = defineComponent({
  props: ['modelValue', 'placeholder', 'type', 'disabled', 'readonly'],
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'relative flex items-center' }, [
      slots.prefix ? slots.prefix() : null,
      h('input', {
        class: `border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none ${slots.prefix ? 'pl-10' : ''} ${slots.suffix ? 'pr-10' : ''}`,
        value: props.modelValue,
        placeholder: props.placeholder,
        type: props.type || 'text',
        disabled: props.disabled,
        readonly: props.readonly,
        onInput: (e: any) => emit('update:modelValue', e.target.value)
      }),
      slots.suffix ? slots.suffix() : null,
    ]);
  }
});


export const Checkbox = defineComponent({
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'flex items-center gap-2' }, [
      h('input', {
        type: 'checkbox',
        checked: props.modelValue,
        onChange: (e: any) => emit('update:modelValue', e.target.checked)
      }),
      props.label ? h('span', props.label) : null
    ]);
  }
});

export const FormControl = Input;
export const Button = defineComponent({
  props: ['variant', 'label'],
  setup(props, { slots }) {
    return () => h('button', {
      class: `px-4 py-2 rounded font-medium transition-colors ${
        props.variant === 'solid' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border hover:bg-gray-50'
      }`
    }, slots.default ? slots.default() : props.label);
  }
});

export const Select = defineComponent({
  props: ['modelValue', 'options'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('select', {
      class: 'border rounded px-3 py-2 w-full',
      value: props.modelValue,
      onChange: (e: any) => emit('update:modelValue', e.target.value)
    }, props.options?.map((opt: any) => h('option', { value: typeof opt === 'string' ? opt : opt.value }, typeof opt === 'string' ? opt : opt.label)));
  }
});

export const DatePicker = Input;
export const DateTimePicker = Input;
export const DateRangePicker = Input;
export const Rating = Input;
export const Switch = Checkbox;
export const Textarea = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('textarea', {
      class: 'border rounded px-3 py-2 w-full min-h-24',
      value: props.modelValue,
      onInput: (e: any) => emit('update:modelValue', e.target.value)
    });
  }
});
export const TextEditor = Textarea;
export const TimePicker = Input;
export const Password = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h(Input, {
      type: 'password',
      modelValue: props.modelValue,
      'onUpdate:modelValue': (val: any) => emit('update:modelValue', val)
    });
  }
});

export const Alert = defineComponent({ setup(props, { slots }) { return () => h('div', { class: 'p-4 bg-blue-50 text-blue-800 rounded' }, slots.default?.()); } });
export const Badge = defineComponent({ setup(props, { slots }) { return () => h('span', { class: 'px-2 py-1 bg-gray-100 rounded text-xs' }, slots.default?.()); } });
export const Dialog = defineComponent({
  props: ['modelValue', 'options'],
  setup(props, { slots }) {
    return () => props.modelValue ? h('div', { class: 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200' }, h('div', { class: 'bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform animate-in zoom-in duration-200' }, [
      h('div', { class: 'px-6 py-4 border-b flex justify-between items-center bg-gray-50/50' }, [
        h('h3', { class: 'text-lg font-bold text-gray-900' }, props.options?.title || 'Dialog'),
        h('button', { class: 'text-gray-400 hover:text-gray-600', onClick: () => slots.close ? slots.close() : null }, '✕')
      ]),
      h('div', { class: 'px-6 py-6' }, slots['body-content']?.() || slots.default?.()),
      slots.actions ? h('div', { class: 'px-6 py-4 border-t bg-gray-50/50 flex justify-end gap-3' }, slots.actions({ close: () => {} })) : null
    ])) : null;
  }
});

export const ErrorMessage = defineComponent({ setup(props, { slots }) { return () => h('p', { class: 'text-red-500 text-sm' }, slots.default?.()); } });
export const TextInput = Input;
export const Combobox = Select;
export const LoadingIndicator = defineComponent({
  setup() {
    return () => h('div', { class: 'animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600' });
  }
});

export const LoadingText = defineComponent({
  props: ['label'],
  setup(props) {
    return () => h('div', { class: 'flex items-center gap-2' }, [
      h(LoadingIndicator),
      h('span', props.label || 'Loading...')
    ]);
  }
});
export const Breadcrumbs = defineComponent({ props: ['items'], setup(props) { return () => h('div', { class: 'flex gap-2 text-sm' }, props.items?.map((i: any) => h('span', i.label))); } });
export const Sidebar = defineComponent({
  props: ['sections'],
  setup(props, { slots }) {
    return () => h('div', { class: 'flex h-full border-r bg-gray-50' }, [
      h('div', { class: 'w-64 flex flex-col' }, [
        h('div', { class: 'p-4 border-b' }, slots.header?.()),
        h('div', { class: 'flex-1 p-4' }, props.sections?.map((s: any) => h('div', [
          h('h4', { class: 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2' }, s.label),
          h('div', { class: 'space-y-1' }, s.items?.map((i: any) => h('a', { href: i.to, class: 'block px-2 py-1.5 rounded hover:bg-gray-200 text-gray-700' }, i.label)))
        ]))),
        h('div', { class: 'p-4 border-t' }, slots['footer-items']?.({ isCollapsed: false }))
      ])
    ]);
  }
});

export const Popover = defineComponent({
  props: ['placement'],
  setup(props, { slots }) {
    const isOpen = ref(false);
    const togglePopover = () => isOpen.value = !isOpen.value;
    return () => h('div', { class: 'relative inline-block' }, [
      slots.target?.({ togglePopover, isOpen: isOpen.value }),
      isOpen.value ? h('div', { class: 'absolute z-50 mt-2' }, slots.body?.()) : null
    ]);
  }
});

export const Tooltip = defineComponent({
  props: ['text'],
  setup(props, { slots }) {
    return () => h('div', { class: 'relative group' }, [
      slots.default?.(),
      h('div', { class: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg' }, props.text)
    ]);
  }
});

export const TabButtons = defineComponent({
  props: ['options', 'modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'flex bg-gray-100 p-1 rounded-lg gap-1 border border-gray-200' }, 
      props.options?.map((opt: any) => h('button', {
        class: `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          props.modelValue === opt.value ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'
        }`,
        onClick: () => emit('update:modelValue', opt.value)
      }, [
        opt.icon ? h(opt.icon, { class: 'w-4 h-4 inline-block mr-1.5 -mt-0.5' }) : null,
        opt.label
      ]))
    );
  }
});

export const FeathersIcon = defineComponent({
  props: ['name'],
  setup(props) {
    return () => h('span', { class: 'text-gray-400' }, `[icon:${props.name}]`);
  }
});
