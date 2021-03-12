<template>
	<transition name="fade" mode="out-in">
		<div id="singlePostView" class="PostDialog position-fixed row justify-content-center align-items-center overflow-auto" v-if="showSinglePost" v-scroll-lock="showSinglePost" @click="closeSinglePost($event)">
			<div class="col-md-6 flex-column">
				<div class="m-2 text-right">
					<i class="far fa-times-circle text-white closeDialog"></i>
				</div>
				<template v-for="post in posts" >
					<Post :post="post" :key="post.id" :ref="`post${post.id}`" :typePost="`singlePost`" />
				</template>
			</div>
		</div>
	</transition>
</template>

<script>
import EventBus from '@/services/eventBus';
import Post from '@/components/post/Post.vue';

export default {
    name: "singlePost",
	data () {
		return {
			showSinglePost: false,
			postId: '',
			posts: {}
		}
	},
	mounted () {
		EventBus.$on('showSinglePost', payload => {
			this.postId = payload.postId;
			this.getOnePost(payload.postId);
		});
		EventBus.$on('newPost', () => {
			if (this.postId != '') {
				this.getOnePost(this.postId);
			}
		});
		if (this.$route.params.postId && this.$route.params.postId != '') {
			this.postId = this.$route.params.postId;
			this.getOnePost(this.$route.params.postId);
		}
	},
	methods: {
		getOnePost: function(postId) {
			this.$http.get(`${process.env.VUE_APP_API}/api/post/${postId}?currentUserId=${localStorage.id}`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
			.then(response => {
				this.posts = response.data;
				this.showSinglePost = true;
			})
			.catch(error => {
				console.log(error);
			})
		},
		closeSinglePost: function (event) {
			if (event.target.id == 'singlePostView' || event.target.classList.contains('closeDialog')) {
				this.showSinglePost = !this.showSinglePost;
				if (!this.showSinglePost) {this.postId = '';}
			}
		}
	},
	components: {
		Post
	}
}
</script>