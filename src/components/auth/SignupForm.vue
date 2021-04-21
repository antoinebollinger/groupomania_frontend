<template>
	<div class="signupForm">
		<form role="form" id="signupForm" @submit.prevent="signup()">
			<fieldset>							
				<h1 class="text-uppercase pull-center text-primary-2">Inscrivez-vous</h1>
				<p class="alerte text-danger">{{ errorMsg.general }} </p>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.firstName }}</p>
					<input v-focus v-model="input.firstName" type="text" data-type="text" name="firstName" id="firstName" class="form-control input-lg w-100" placeholder="Prénom" required :disabled="loading">
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.lastName }}</p>
					<input v-model="input.lastName" type="text" data-type="text" name="lastName" id="lastName" class="form-control input-lg w-100" placeholder="Nom" required :disabled="loading">
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.email }}</p>
					<input v-model="input.email" type="email" data-type="email" name="email" id="email" class="form-control input-lg w-100" placeholder="E-mail" required :disabled="loading">
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.password }}</p>
					<input v-model="input.password" type="password" data-type="password" name="password" id="password" class="form-control input-lg invalid w-100" placeholder="Mot de passe" :disabled="loading">
					<br>
					<CheckPwd />
				</div>
				<div>
					<button type="submit" class="btn btn-lg btn-primary-2 text-uppercase w-100 d-flex align-items-center p-0" :disabled="loading">
						<span class="iSubmit" v-if="loading"><img src="../../assets/spinner.gif" height="20"></span>
						<span class="iSubmit" v-else><i class="fas fa-sign-in-alt"></i></span>
						<span class="flex-grow-1">{{ loadingMsg }}</span>
					</button>
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
			loading: false,
			loadingMsg: 'S\'inscrire',
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
			this.loading = true; this.loadingMsg = '...inscription';
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
					this.loadingMsg = '...connexion';
					this.afterLogin({
						"email": user.email,
						"password": user.password
					})
					.then(response => {
						setTimeout( () => {
							this.$router.push({ path: '/home'});
							EventBus.$emit('logged', { message: response.data });
						}, 1500);
					})
					.catch(error => {
						localStorage.clear();
						this.errorMsg.firstName = error.response.data.message;
						this.loading = false; this.loadingMsg = 'S\'inscrire';
					});
				})
				.catch(error => {
					this.errorMsg.firstName = error.response.data.message;
					this.loading = false; this.loadingMsg = 'S\'inscrire';
				});
			} else {
				for (const property in goSignup.elements) {
					this.errorMsg[property] = goSignup.elements[property];
					this.loading = false; this.loadingMsg = 'S\'inscrire';
				}
			}
			this.loading = false; this.loadingMsg = 'S\'inscrire';
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

.iSubmit {
	padding: 0.375rem 0.75rem;
}
</style>