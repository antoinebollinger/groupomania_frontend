<template>
	<div class="signupForm">
		<form role="form" id="signupForm" @submit.prevent="signup()">
			<fieldset>							
				<h1 class="text-uppercase pull-center text-primary-2">Inscrivez-vous</h1>
				<p class="alerte text-danger">{{ errorMsg.general }} </p>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.firstName }}</p>
					<input v-focus v-model="input.firstName" type="text" name="firstName" id="firstName" class="form-control input-lg w-100" placeholder="Prénom" required>
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.lastName }}</p>
					<input v-model="input.lastName" type="text" name="lastName" id="lastName" class="form-control input-lg w-100" placeholder="Nom" required>
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.email }}</p>
					<input v-model="input.email" type="email" name="email" id="email" class="form-control input-lg w-100" placeholder="E-mail" required>
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.password }}</p>
					<input v-model="input.password" type="password" name="password" id="password" class="form-control input-lg invalid w-100" placeholder="Mot de passe">
					<br>
					<CheckPwd />
				</div>
				<div>
					<button type="submit" class="btn btn-lg btn-primary-2 text-uppercase w-100">S'inscrire</button>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script>
import EventBus from '@/services/eventBus';
import checkForm from '@/services/checkForm';
import CheckPwd from '@/services/CheckPwd.vue';
import login from '@/services/login';

export default {
	name: 'SignupForm',
	data () {
		return {
			input: {
				firstName: '',
				lastName: '',
				email: '',
				password: ''
			},
			errorMsg: {
				general: '',
				firstName: '',
				lastName: '',
				email: '',
				password: ''
			}
		}
	},
	watch: {
		'input.password': {
			handler: function(after) {
				const resultat = this.checkPassword(after);
				const pwdInput = document.getElementById("password");
				let ok = true;
				for (const property in resultat) {
					if (resultat[property]) {
						document.getElementById(property).classList.add("ok");
					} else {
						document.getElementById(property).classList.remove("ok");
						ok = false;
					}
				}
				if (ok) {
					pwdInput.classList.add("valid");
					pwdInput.classList.remove('invalid');
				} else {
					pwdInput.classList.add("invalid")
					pwdInput.classList.remove('valid');
				}
			},
			deep: true
		},
	},
	mixins: [checkForm, login],
	methods: {
		signup: function() {
			this.$loading.show({delay: 0});
			const inputs = document.getElementById("signupForm").querySelectorAll("input");
			const goSignup = this.checkForm(inputs);
			for (let element in this.errorMsg) {
				this.errorMsg[element] = '';
			}
			if (goSignup.valid) {
				const user = this.input;
				this.$http.post(process.env.VUE_APP_API+'/api/auth/signup', {
					user: JSON.stringify(user)
				})
				.then(() => {
					this.afterLogin({
						"email": user.email,
						"password": user.password
					})
					.then(response => {
						EventBus.$emit('logged', { message: response.data });
						this.$router.push('Home');
					})
					.catch(error => {
						localStorage.clear();
						this.errorMsg.firstName = error.response.data.message;
					});
				})
				.catch(error => {
					this.errorMsg.firstName = error.response.data.message;
				});
			} else {
				for (const property in goSignup.elements) {
					this.errorMsg[property] = goSignup.elements[property];
				}
			}
			this.$loading.hide();
		}
    },
	components: {
		CheckPwd
	}
}
</script>

<style lang="scss" scoped>
input {
	&:valid, &.valid {
		border-color: var(--success);
	}
	&:invalid, &.invalid {
		border-color: #ced4da;
	}
};

#password {
	~ div {
		opacity: 0;
		transition: opacity 0.4s;
	}
	&:focus ~ div, &:not(:placeholder-shown) ~ div {
		opacity: 1;
	}
};
</style>