<template>
    <div class="card mb-1 mb-md-4 userSearch">
        <div class="p-2">
            <p class="font-weight-bold">Mes collègues :</p>
			<input type="search" placeholder="Rechercher un collègue..." aria-describedby="button-addon1" class="form-control bg-light w-100 mb-4" v-model="input.search">
            <template v-for="user in users">
            <User :user="user" :key="user.id" :ref="user.id" />
            </template>
        </div>
    </div>
</template>

<script>
import User from '@/components/user/User.vue';

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
		User
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