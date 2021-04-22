<template>
	<div class="signupForm">
		<form role="form" id="signupForm" @submit.prevent="signup()">
			<fieldset>							
				<h1 class="text-uppercase pull-center text-primary-2">Inscrivez-vous</h1>
				<p class="alerte text-danger">{{ errorMsg.general }} </p>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.firstName }}</p>
					<InputText v-focus icone="fas fa-user" v-model="input.firstName" name="firstName" id="firstName" placeholder="Prénom" :disabled="loading"/>
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.lastName }}</p>
					<InputText icone="fas fa-user" v-model="input.lastName" name="lastName" id="lastName" placeholder="Nom" :disabled="loading"/>
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.email }}</p>
					<InputEmail v-model="input.email" :disabled="loading" />
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.password }}</p>
					<InputPassword v-model="input.password" :disabled="loading" classe="invalid" />
					<br>
					<CheckPwd binder="password" />
				</div>
				<div>
					<button type="submit" class="btn btn-lg btn-primary-2 text-uppercase w-100 d-flex align-items-center p-0" :disabled="loading">
						<span class="iSubmit" v-show="loading"><img src="../../assets/spinner.gif" height="20"></span>
						<span class="iSubmit" v-show="!loading"><i class="fas fa-sign-in-alt"></i></span>
						<span class="flex-grow-1">{{ loadingMsg }}</span>
					</button>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script>
import EventBus from '@/services/eventBus';
import InputEmail from '@/utils/inputs/Email';
import InputPassword from '@/utils/inputs/Password';
import InputText from '@/utils/inputs/Text';
import checkForm from '@/services/checkForm';
import CheckPwd from '@/utils/CheckPwd.vue';
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
		}
    },
	components: {
		InputEmail,
		InputPassword,
		InputText,
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

.iSubmit {
	padding: 0.375rem 0.75rem;
}
</style>