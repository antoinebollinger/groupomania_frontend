<template>
	<div class="loginForm">
		<form role="form" id="loginForm" @submit.prevent="login()" method="post">
			<fieldset>
				<h1 class="text-uppercase pull-center text-primary">Connexion</h1>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.email }}</p>
					<input v-focus v-model="input.email" type="email" name="email" id="email" class="form-control input-lg w-100" placeholder="E-mail">
				</div>
				<div class="form-group">
					<p class="text-left alerte">{{ errorMsg.password }}</p>
					<input v-model="input.password" type="password" name="password" id="password" class="form-control input-lg w-100" placeholder="Mot de passe">
				</div>
				<div>
					<button type="submit" class="btn btn-lg btn-primary text-uppercase w-100"><i class="fas fa-sign-in-alt"></i> Se connecter</button>
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
			this.$loading.show({delay: 0});
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
					EventBus.$emit('logged', { message: response.data });
					this.$router.push('Home');
				})
				.catch(error => {
					localStorage.clear();
					this.errorMsg[error.response.data.objet] = error.response.data.message;
				});
			} else {
				this.errorMsg.email = 'Veuillez vérifier vos informations.';
			}
			this.$loading.hide();
		}
	}
}
</script>