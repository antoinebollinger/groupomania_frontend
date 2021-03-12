<template>
    <div class="d-flex flex-row pb-1 mb-1 border-bottom">
        <UserImage :image="imgProfile" dia="40" />
        <div class="d-flex flex-column ml-1 pl-1 pr-1 flex-grow-1 text-left bg-light rounded">
            <div class="d-flex flex-row justify-content-between">
                <p class="name cursorPointer hoverColor" v-if="(!userCanDelete && (this.typePost != 'userPost' || (this.typePost == 'userPost' && this.comment.userId != this.postId)))" @click="goToUser()">{{ nom }}<small class="ellipsis"> &bull; {{ temps }}</small></p>
                <p class="name" v-else>{{ nom }}<small class="ellipsis"> &bull; {{ temps }}</small></p>
                <div v-if="userCanDelete" class="d-flex ellipsis">
                        <small class="deleteComment ml-2" @click="showEditComment = !showEditComment" v-if="showEditComment">Annuler</small>
                        <small class="deleteComment ml-2" @click="showEditComment = !showEditComment" v-else>Modifier</small>
                        <small class="deleteComment ml-2" @click="deleteComment()">Supprimer</small>
                    </div>
            </div>
            <form role="form" @submit.prevent="editComment()" method="post" class="d-flex mb-1" v-if="showEditComment">
                <input type="text" class="form-control flex-grow-1" name="newContent" v-model="newContent">
                <button type="submit" class="btn"><i class="fas fa-paper-plane"></i></button>
            </form>
            <p class="comment-text" v-else>{{ comment.content }}</p>
        </div>
    </div>
</template>

<script>
import UserImage from '@/components/user/UserImage.vue';
import EventBus from '@/services/eventBus';

export default {
    name: 'Comment',
    props: {
        comment: {
            type: Object
        },
        postId: {
            type: Number
        },
        typePost: {
            type: String
        }
    },
    data () {
        return {
            showEditComment: false,
            newContent: ''
        }
    },
    mounted () {
        this.newContent = this.comment.content;
    },
    computed: {
        nom: function() {
            return ((this.comment.firstName != '') ? this.comment.firstName : 'Compte')+' '+((this.comment.lastName != '') ? this.comment.lastName : 'supprimé');
        },
        imgProfile: function() {
            return ((this.comment.userImage != '') ? this.comment.userImage : `${process.env.VUE_APP_API}/images/user.png`);
        },
        temps: function() {
            let temps = '';
            if (this.comment.commentDateD != 0) {
                temps = this.comment.commentDateD+' j';
            } else {
                if (this.comment.commentDateH != 0) {
                    temps = this.comment.commentDateH+' h';
                } else {
                    temps = ((this.comment.commentDateM == 0 ) ? '1' : this.comment.commentDateM)+' min';
                }
            }
            return temps;

        },
        userCanDelete: function() {
            return this.comment.userId == localStorage.id;
        }
    },
    methods: {
        editComment: function() {
            if (this.newContent != '') {
                const url = `${process.env.VUE_APP_API}/api/post/${this.comment.postId}/comment/${this.comment.id}`;
                this.$http.put(url, {"currentUserId": localStorage.id, "content": this.newContent}, {headers: {	Authorization: `Bearer ${localStorage.token}` }})
                .then(() => {
                    this.showEditComment = !this.showEditComment;
                    EventBus.$emit('newPost', '');
                })
                .catch(error => {
                    console.log(error)
                });
            }                
        },
        deleteComment: function() {
            this.$dialog({
                title: 'Suppression',
                content: 'Êtes-vous certain de vouloir supprimer ce commentaire ?',
                btns: [{
                    label: 'Oui',
                    class: 'btn btn-primary',
                    callback: () => { this.deleteCommentQuery(); }
                },
                {
                    label: 'Non',
                    color: '#444',
                    ghost: true
                }],
            })
        },
        deleteCommentQuery: function() {
            this.$http.delete(`${process.env.VUE_APP_API}/api/post/${this.comment.postId}/comment/${this.comment.id}`, {
                headers: {	
                    Authorization: `Bearer ${localStorage.token}` 
                },
                data: {
                    "currentUserId": localStorage.id,
                    "admin": false
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
            this.$router.push(`/user?userId=${this.comment.userId}`);
            if (this.$route.name == 'User') { location.reload(); }
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
.deleteComment {
    transition: all 0.4s;
    cursor: pointer;
    &:hover {
        color: var(--primary);
    }
}
</style>