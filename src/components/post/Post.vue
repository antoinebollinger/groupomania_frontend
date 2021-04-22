<template>
    <transition name="fade" mode="out-in">
        <div class="card shadow-sm mb-1 mb-md-4" :data-postId="post.id">
            <div class="d-flex justify-content-between p-2">
                <div class="d-flex flex-row align-items-center"> 
                    <UserImage :image="imgProfile" dia="40" />
                    <div class="d-flex flex-column ml-2">
                        <span class="font-weight-bold cursorPointer hoverColor" v-if="!userCanDelete && typePost != 'userPost'" @click="goToUser()">{{ nom }}</span>
                        <span class="font-weight-bold" v-else>{{ nom }}</span>
                        <small>{{ temps }}</small>
                    </div>
                </div>
                <div class="d-flex flex-row mt-1 ellipsis" v-if="!isSinglePost">
                    <small class="cursorPointer hoverColor ml-2" @click="editPost()" v-if="userCanDelete">Modifier</small>
                    <small class="cursorPointer hoverColor ml-2" @click="deletePost()" v-if="userCanDelete || isAdmin"><i class="fas fa-shield-alt mr-1" v-if="isAdmin && !userCanDelete"></i>Supprimer</small>
                </div>
            </div>
            <div class="p-md-2" v-bind:class="{ 'cursorPointer': !isSinglePost }" @click="singlePostView()">
                <p class="text-justify p-2">{{ post.content }}</p>
                <div class="bg-dark text-center rounded position-relative" v-if="post.imageUrl != ''">
                    <img :src="post.imageUrl" class="img-fluid rounded w-100 imgMain">
                    <div v-if="isSinglePost" class="imgPreview position-absolute text-white" @click="imgPreview()"><i class="fas fa-expand"></i></div>
                </div>
            </div>
            <div class="p-2">
                <div class="d-flex flex-row align-items-center justify-content-between text-muted pt-2 my-2">
                    <div class="d-flex flex-row d-flex align-items-center position-relative">
                        <div v-if="post.likes === 0 ">
                            <i class="far fa-heart"></i>
                            <span class="mx-1">0</span>
                        </div>
                        <div v-else class="cursorPointer" @mouseover="showLikes = true" @mouseleave="showLikes = false">
                            <i class="fa fa-heart text-primary-2"></i>
                            <span class="mx-1 text-primary-2">{{ post.likes }}</span>
                            <transition name="fade" mode="out-in">
                                <div class="position-absolute userLikes" v-if="showLikes">
                                    <template v-for="like in likes">
                                        <User :user="like" :key="like.id" :ref="like.id" />
                                    </template>
                                </div>
                            </transition>
                        </div>
                        <span class="mx-1" v-if="post.comments > 0">&bull;</span>
                        <span class="mx-1 cursorPointer hoverUnderline" v-if="post.comments > 0" @click="showComments = !showComments">{{ post.comments }} commentaire<span v-if="post.comments > 1">s</span></span>
                    </div>
                    <div class="d-flex flex-row">
                        <div class="cursorPointer text-primary-2" v-if="post.currentUserLike === 1" @click="userUnLike()"><i class="fas fa-thumbs-up"></i><span class="mx-1">J'aime</span></div>
                        <div class="cursorPointer hoverColor" v-else @click="userLike()"><i class="far fa-thumbs-up"></i><span class="mx-1">J'aime</span></div>
                    </div>
                </div>
                <hr>
                <div class="comments" >
                    <div v-if="showComments">
                        <template v-for="comment in comments">
                            <Comment :comment="comment" :key="comment.id" :postId="post.userId" :typePost="typePost" />
                        </template>
                    </div>
                    <div class="comment-input">
                        <form role="form" @submit.prevent="createComment()" method="post">
                            <div class="input-group">
                                <input class="form-control" type="text" name="content" placeholder="Votre commentaire" v-model="content">
                                <div class="input-group-append" >
                                    <button type="submit" class="btn btn-outline-tertary" :disabled="(content == '') ? true : false"><i class="fas fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </form>

                        <!--<form role="form" @submit.prevent="createComment()" method="post" class="d-flex ">
                            <input type="text" class="form-control flex-grow-1 bg-light" name="content" v-model="content" placeholder="Votre commentaire...">
                            <button type="submit" class="commentButton btn" :disabled="(content == '') ? true : false"><i class="fas fa-paper-plane"></i></button>
                        </form>-->
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import UserImage from '@/components/user/UserImage.vue';
import Comment from '@/components/post/Comment.vue';
import User from '@/components/user/User.vue';
import EventBus from '@/services/eventBus';
import notification from '@/services/notification'

export default {
    name: 'Post',
    props: {
        post: {
            type: Object
        },
        typePost: {
            type: String,
        }
    },
    data () {
        return {
            showComments: false,
            showLikes: false,
            isSinglePost: false,
            comments: {},
            likes: {},
            content: ''
        }
    },
    computed: {
        nom: function() {
            return ((this.post.firstName != '') ? this.post.firstName : 'Compte')+' '+((this.post.lastName != '') ? this.post.lastName : 'supprimé');
        },
        imgProfile: function() {
            return ((this.post.userImage != '') ? this.post.userImage : `${process.env.VUE_APP_API}/images/user.png`);
        },
        temps: function() {
            let temps = '';
            if (this.post.postDateD != 0) {
                temps = this.post.postDateD+' j';
            } else {
                if (this.post.postDateH != 0) {
                    temps = this.post.postDateH+' h';
                } else {
                    temps = ((this.post.postDateM == 0 ) ? '1' : this.post.postDateM)+' min';
                }
            }
            return temps;

        },
        userCanDelete: function() {
            return this.post.userId == localStorage.id;
        },
        isAdmin: function() {
            return (localStorage.admin == 1) ? true : false;
        }
    },
    mounted () {
        this.isSinglePost = (this.typePost == 'singlePost') ? true : false ;
        this.getComments();
        this.getLikes();
		EventBus.$on('newPost', () => {
			this.getComments();
		})
        if (this.typePost == 'singlePost') {
            this.showComments = true;
        }
    },
    mixins: [notification],
    methods: {
        singlePostView: function() {
            if (this.typePost == 'post' || this.typePost == 'userPost') {
                EventBus.$emit('showSinglePost', { "postId": this.post.id })
            }
        },
        imgPreview: function() {
            this.$ImagePreview.show(this.post.imageUrl);
        },
        getComments: function() {
            this.$http.get(`${process.env.VUE_APP_API}/api/post/${this.post.id}/comment`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
            .then(response => {
                this.comments = response.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
        createComment: function() {
            if (this.content != '') {
                this.$http.post(`${process.env.VUE_APP_API}/api/post/${this.post.id}/comment`, {"currentUserId": localStorage.id, "content": this.content}, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
                .then(response => {
                    this.content = '';
                    EventBus.$emit('newPost', '');
                    this.createNotification({
                        "currentUserId": localStorage.id,
                        "postId": this.post.id,
                        "commentId": response.data.commentId[0].commentId
                    })
                    .then(() => {
                        EventBus.$emit('newNotification', '');
                        this.showComments = true;
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })
                .catch(error => {
                    console.log(error)
                });
            }
        },
        getLikes: function() {
            this.$http.get(`${process.env.VUE_APP_API}/api/post/${this.post.id}/like`, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
            .then(response => {
                this.likes = response.data;
            })
            .catch(error => {
                console.log(error);
            })
        },
        userLike: function() {
            this.$http.post(`${process.env.VUE_APP_API}/api/post/${this.post.id}/like`, {"currentUserId": localStorage.id, "like": 1}, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
            .then(() => {
                EventBus.$emit('newPost', '');
            })
            .catch(error => {
                console.log(error);
            })

        },
        userUnLike: function() {
           this.$http.post(`${process.env.VUE_APP_API}/api/post/${this.post.id}/like`, {"currentUserId": localStorage.id, "like": 0}, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
            .then(() => {
                EventBus.$emit('newPost', '');
            })
            .catch(error => {
                console.log(error);
            })

        },
        editPost: function() {
            EventBus.$emit('showPostDialog', {"action": "edit", "message": "Modifier une publication", "content": this.post.content, "imageUrl": this.post.imageUrl, "postId": this.post.id });
        },
        deletePost: function() {
            this.$dialog({
                title: 'Suppression',
                content: 'Êtes-vous certain de vouloir supprimer cette publication ?',
                btns: [{
                    label: 'Oui',
                    class: 'btn btn-primary',
                    callback: () => { this.deletePostQuery(); }
                },
                {
                    label: 'Non',
                    color: '#444',
                    ghost: true
                }],
            })
        },
        deletePostQuery: function() {
            this.$http.delete(`${process.env.VUE_APP_API}/api/post/${this.post.id}`, {
                headers: {	
                    Authorization: `Bearer ${localStorage.token}` 
                },
                data: {
                    "currentUserId": localStorage.id,
                    "admin": this.isAdmin
                }
            })
            .then(() => {
                EventBus.$emit('newPost', '');
            })
            .catch(error => {
                console.log(error);
            });
        },
        goToUser: function() {
            if (!this.userCanDelete && this.typePost != 'userPost') {
                this.$router.push(`/user?userId=${this.post.userId}`);
            }
        }
    },
    components: {
        UserImage,
        Comment,
        User
    }
}
</script>

<style lang="scss" scoped>
textarea {
    min-width: 100%;
    cols: 2;
}

.imgPreview {
    top: 5px;
    right: 5px;
    i {
        font-size: 1.5em;
        cursor: pointer;
        text-shadow: 0 0 10px black;
    }
}

.userLikes {
    bottom: 100%;
}

@media (max-width: 768px) {
    .imgMain {
        border-radius: 0!important;
    }
}
</style>