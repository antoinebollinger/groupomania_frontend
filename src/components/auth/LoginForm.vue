<template>
	<div class="loginForm">
		<form role="form" id="loginForm" @submit.prevent="login()" method="post">
			<fieldset>
				<h1 class="text-uppercase pull-center text-primary">Connexion</h1>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.email }}</p>
					<input v-focus v-model="input.email" type="email" data-type="email" name="email" id="email" class="form-control input-lg w-100" placeholder="E-mail" :disabled="loading">
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.password }}</p>
					<input v-model="input.password" type="password" data-type="password" name="password" id="password" class="form-control input-lg w-100" placeholder="Mot de passe" :disabled="loading">
				</div>
				<div>
					<button type="submit" class="btn btn-lg btn-primary text-uppercase w-100 d-flex align-items-center p-0" :disabled="loading">
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
import checkForm from '@/services/checkForm';
import login from '@/services/login';

export default {
	name: 'LoginForm',
	data () {
		return {
			loading: false,
			loadingMsg: 'Se connecter',
			input: {
				email: '',
				password: ''
			},
			errorMsg: {
				email: '',
				password: ''
			}
		}
	},
	mixins: [checkForm, login],
	methods: {
		login: function() {
			this.loading = true; this.loadingMsg = '...connection';
			const inputs = document.getElementById("loginForm").querySelectorAll("input");
			const goSignup = this.checkForm(inputs);
			for (let element in this.errorMsg) {
				this.errorMsg[element] = '';
			}
			if (goSignup.valid) {
				this.afterLogin({
					"email": this.input.email,
					"password": this.input.password
				})
				.then(response => {
					setTimeout( () => {
						this.$router.push({ path: '/home'});
						EventBus.$emit('logged', { message: response.data });
					}, 1500);
					//this.$router.push('Home');
				})
				.catch(error => {
					localStorage.clear();
					this.errorMsg[error.response.data.objet] = error.response.data.message;
					this.loading = false; this.loadingMsg = 'Se connecter';
				});
			} else {
				this.errorMsg.email = 'Veuillez vérifier vos informations.';
				this.loading = false; this.loadingMsg = 'Se connecter';
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.iSubmit {
	padding: 0.375rem 0.75rem;
}
</style>