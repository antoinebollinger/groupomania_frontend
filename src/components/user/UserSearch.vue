<template>
    <div class="card mb-1 mb-md-4 userSearch">
        <div class="p-2">
            <p class="font-weight-bold">Mes collègues :</p>
			<InputText class="mb-4" prependIcone="fas fa-search" placeholder="Rechercher un collègue..." v-model="input.search" />
            <div>
				<User v-for="user in users" :user="user" :key="user.id" :ref="user.id" />
            </div>
        </div>
    </div>
</template>

<script>
import User from '@/components/user/User.vue';
import InputText from '@/utils/inputs/Text';

export default {
    name: 'UserSearch',
	data () {
		return {
			users: {},
			input: {
				search: ''
			}
		}
	},   
	mounted () {
		this.getRandUser(10);
	},
	watch: {
		'input.search': {
			handler: function(after) {
				if (after != '') {
					this.getFilterUser(after);
				} else {
					this.getRandUser(10);
				}
			},
			deep: true
		},
	},
	methods: {
		getRandUser: function(nbRand) {
			this.$http.get(`${process.env.VUE_APP_API}/api/user/${localStorage.id}/rand/${nbRand}/`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
			.then(response => {
				this.users = response.data;
			})
			.catch(error => {
				console.log(error);
			})			
		},
		getFilterUser: function(filter) {
			this.$http.get(`${process.env.VUE_APP_API}/api/user/${localStorage.id}/filter/${filter}/`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
			.then(response => {
				this.users = response.data;
			})
			.catch(error => {
				console.log(error);
			})			
		}
	},
	components: {
		User,
		InputText
	}
}
</script>

<style lang="scss" scoped>
.userSearch {
	position: -webkit-sticky;
	position: sticky;
	top:65px;
}

@media (max-width: 768px) {
	.userSearch {
		position: static;
	}
}
</style>