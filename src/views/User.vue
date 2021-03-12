<template>
    <div class="home">
        <div class="container min-vh-100">
            <div class="row justify-content-center py-md-4 py-1">
                <div class="mb-1 mb-md-4 col-md-12 px-0 px-md-2">
                    <UserCard :user="user" :position="''" :link="false" />
                </div>
                <div class="col-md-4 px-0 px-md-2 homeCard">
                    <UserSearch class="mb-1 mb-md-4" />
                </div>
                <div class="col-md-8 px-0 px-md-2">
                    <div class="card shadow-sm mb-1 mb-md-4 bg-secondary">
                        <div class="card-body d-flex justify-content-between p-2">
                            <div v-if="isCurrentUser">
                                <p class="font-italic m-0" v-if="posts.length == 0">Vous n'avez encore rien publié</p>
                                <p class="font-weight-bold m-0" v-else>Vos publications :</p>
                            </div>
                            <div v-else>
                                <p class="font-italic m-0" v-if="posts.length == 0">{{ user.firstName }} n'a encore rien publié</p>
                                <p class="font-weight-bold m-0" v-else>Publications de {{ user.firstName }} :</p>
                            </div>
                        </div>
                    </div>
                    <template v-for="post in posts" >
                        <Post :post="post" :key="post.id" :ref="`post${post.id}`" :typePost="`userPost`" />
                    </template>
                </div>
            </div>
        </div>
        <SinglePost />
    </div>
</template>

<script>
import EventBus from '@/services/eventBus';
import Post from '@/components/post/Post.vue';
import SinglePost from '@/components/post/SinglePost.vue';
import UserCard from '@/components/user/UserCard.vue';
import UserSearch from '@/components/user/UserSearch.vue';


export default {
    name: "User",
    data () {
        return {
            user: {},
            posts: {},
            userId: this.$route.query.userId,
            currentUserId: localStorage.id
        }
    },
    computed: {
        userName: function() {
            return ((this.user.firstName != '') ? this.user.firstName : 'Compte')+' '+((this.user.lastName != '') ? this.user.lastName : 'supprimé');
        },
        userImageUrl: function() {
            return ((this.user.imageUrl != '') ? this.user.imageUrl : `${process.env.VUE_APP_API}/images/user.png`);
        },
        userFonction: function() {
            return ((this.user.fonction != '') ? this.user.fonction : ``);
        },
        isCurrentUser: function() {
            return (this.currentUserId == this.$route.query.userId)
        }
    },
    beforeCreate () {
        if (!this.$route.query.userId) {
            this.$router.push('/home');
        }
    },
    mounted () {
        
        this.getUser(this.$route.query.userId);
        this.getPosts(this.$route.query.userId);
		EventBus.$on('newPost', () => {
			this.getPosts(this.$route.query.userId);
		});
        
    },
    methods: {
        getUser: function(userId) {
            this.$http.get(`${process.env.VUE_APP_API}/api/user/${userId}`, {headers: { Authorization: `Bearer ${localStorage.token}` }})
            .then(response => {
                this.user = response.data[0];
                document.title = this.userName+' | Groupomania';
            })
            .catch(error => {
                console.log(error);
            })
        },
        getPosts: function(userId) {
			this.$http.get(`${process.env.VUE_APP_API}/api/post/?currentUserId=${localStorage.id}&userId=${userId}`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
			.then(response => {
				this.posts = response.data;
			})
			.catch(error => {
				console.log(error);
			})
		}
    },
    components: {
        Post,
        SinglePost,
        UserSearch,
        UserCard
    }
}
</script>