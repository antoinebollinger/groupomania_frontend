<template>
    <div class="input-group">
        <div class="input-group-prepend" v-if="prepend">
            <span class="input-group-text"><i :class="`${prependIcone}`"></i></span>
        </div>
        <input :class="`form-control ${classe}`" type="text" data-type="text" :id="id" :name="name" :placeholder="placeholder" :value="value" :required="required" :disabled="disabled" v-on:input="updateValue($event.target.value)">
        <div class="input-group-append" v-if="append">
            <span class="input-group-text"><i :class="`${appendIcone}`"></i></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Email',
    props: {
        prepend: {
            type: Boolean,
            default: true
        },
        prependIcone: {
            type: String,
            default: 'fas fa-paragraph'
        },
        append: {
            type: Boolean,
            default: false
        },
        appendIcone: {
            type: String,
            default: 'fas fa-paper-plane'
        },
        classe: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        updateValue: function (value) {
            this.$emit('input', value)
        }       
    }
}
</script>