<template>
    <div class="input-group">
        <div class="input-group-prepend" v-if="prepend">
            <span class="input-group-text"><i class="fas fa-at"></i></span>
        </div>
        <input :class="`form-control ${classe}`" type="email" data-type="email" :id="id" :name="name" :placeholder="placeholder" :value="value" :required="required" :disabled="disabled" v-on:input="updateValue($event.target.value)">
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
        classe: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'email'
        },
        id: {
            type: String,
            default: 'email'
        },
        placeholder: {
            type: String,
            default: 'E-mail'
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