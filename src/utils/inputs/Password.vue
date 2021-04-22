<template>
    <div class="input-group">
        <div class="input-group-prepend" v-if="prepend">
            <span class="input-group-text"><i class="fas fa-key"></i></span>
        </div>
        <input :class="`form-control ${classe}`" :type="type.pwd" data-type="password" :id="id" :name="name" :placeholder="placeholder" :value="value" :required="required" :disabled="disabled" v-on:input="updateValue($event.target.value)">
        <div class="input-group-append cursorPointer" @click="switchVisibility()" v-if="append">
            <span class="input-group-text" title="Masquer le mot de passe" v-if="see.pwd"><i  class="fas fa-eye-slash"></i></span>
            <span class="input-group-text" title="Afficher le mot de passe" v-else><i class="fas fa-eye"></i></span>
        </div>
    </div>
</template>
                    
<script>
export default {
    name: 'Password',
    data () {
        return {
            type: {
                pwd: 'password'
            },
            see: {
                pwd: false
            }
        }
    },
    props: {
        prepend: {
            type: Boolean,
            default: true
        },
        append: {
            type: Boolean,
            default: true
        },
        classe: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'password'
        },
        id: {
            type: String,
            default: 'password'
        },
        placeholder: {
            type: String,
            default: 'Mot de passe'
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
        switchVisibility() {
			this.see.pwd = !this.see.pwd;
            this.type.pwd = (this.see.pwd) ? 'text' : 'password';
        },
        updateValue: function (value) {
            this.$emit('input', value)
        }
    }
}
</script>