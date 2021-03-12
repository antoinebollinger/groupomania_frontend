<template>
	<div class="home">
		<div class="container min-vh-100">
			<div class="row justify-content-center py-md-4 py-1">
				<div id="HomeCard" class="col-md-4 px-0 px-md-2 homeCard">
                    <UserCard class="mb-1 mb-md-4" />
					<UserSearch class="mb-1 mb-md-4" />
				</div>
				<div class="col-md-8 px-0 px-md-2">
				<CreatePost />
				<template v-for="post in posts" >
					<Post :post="post" :key="post.id" :ref="`post${post.id}`" :typePost="`post`" />
				</template>
				</div>
			</div>
		</div>
		<CreatePostDialog />
		<SinglePost />
	</div>
</template>

<script>
import EventBus from '@/services/eventBus';
import Post from '@/components/post/Post.vue';
import CreatePost from '@/components/post/CreatePost.vue';
import CreatePostDialog from '@/components/post/CreatePostDialog.vue';
import SinglePost from '@/components/post/SinglePost.vue';
import UserCard from '@/components/user/UserCard.vue';
import UserSearch from '@/components/user/UserSearch.vue';

export default {
	name: 'Home',
	data () {
		return {
			cible: '',
			posts: {},
		}
	},
	mounted () {
		document.title = 'Fil d\'actualité | Groupomania'
		this.getPosts();
		EventBus.$on('newPost', () => {
			this.getPosts();
		});
	},
	methods: {
		getPosts: function() {
			this.$http.get(`${process.env.VUE_APP_API}/api/post/?currentUserId=${localStorage.id}`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
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
		CreatePost,
		CreatePostDialog,
		SinglePost,
		UserCard,
		UserSearch
	}
}
</script>