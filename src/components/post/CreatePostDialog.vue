<template>
    <transition name="fade" mode="out-in">
        <div id="createPostDialog" class="PostDialog position-fixed row justify-content-center align-items-center overflow-auto" v-if="showPostDialog" v-scroll-lock="showPostDialog">
            <div class="col-md-4 flex-column">
                <div class="m-2 text-right">
                    <i class="far fa-times-circle text-white" @click="closeDialog()"></i>
                </div>
                <div class="card shadow-sm mb-1 mb-md-4">
                    <div class="p-2">
                        <h4 class="text-center position-relative">{{ titleDialog }}</h4>
                        <p class="alerte text-danger">{{ errorMsg }}</p>
                        <textarea id="postContent" class="form-control my-2" v-model="post.content" placeholder="Exprimez-vous ici..."></textarea>
                    </div>
                    <div id="postImgPreview" v-if="imgPreview != ''">
                        <img :src="imgPreview" class="w-100" id="imgPreview" @click="openFileSelector()">
                    </div>
                    <div class="d-flex justify-content-center align-items-center my-2 p-2">
                        <div class="d-flex flex-row icons d-flex align-items-center cursorPointer px-5 rounded" @click="openFileSelector()">
                            <i class="fas fa-image text-primary"></i>
                            <span class="mx-1" v-if="imgPreview == ''">Ajouter une image</span>
                            <span class="mx-1" v-else>Modifier l'image</span>
                            <input id="postImgSelector" type="file" name="image" ref="file" @change="onSelect()" />
                        </div>
                    </div>
                    <hr class="p-2">
                    <div class="p-2 form-group my-2">
                        <button class="btn btn-primary-2 w-100" @click="createPost('create')" v-if="resetDialog">Publier</button>
                        <button class="btn btn-primary-2 w-100" @click="createPost('edit')" v-else>Valider les modifications</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import EventBus from '@/services/eventBus';
import notification from '@/services/notification'
import checkImg from '@/services/checkImg'

export default {
    name: "CreatePostDiv",
    data () {
        return {
            showPostDialog: false,
            resetDialog: false,
            titleDialog: '',
            imgPreview: '',
            editPostId: '',
            errorMsg: '',
            post: {
                currentUserId: '',
                content: '',
                file: '',
            }
        }
    },
    watch: {
        'showPostDialog': {
            handler: function() {
                if (this.resetDialog) {
                    this.post.file = '';
                    this.post.content = '';
                    this.errorMsg = '';
                }
            }
        }
    },
    mounted () {
        this.post.currentUserId = localStorage.id;
        this.showPostDialog = false;
        EventBus.$on('showPostDialog', (payload) => {
            this.resetDialog = (['create','close'].includes(payload.action)) ? true : false;
            this.post.content = (payload.content) ? payload.content : '';
            this.imgPreview = (payload.imageUrl && payload.imageUrl != '') ? payload.imageUrl : "";
            this.editPostId = (payload.postId) ? payload.postId : '';
            this.titleDialog = payload.message;
            this.showPostDialog = !this.showPostDialog;
        });
    },   
    mixins: [notification, checkImg],
    methods: {
        openFileSelector: function() {
            this.errorMsg = '';
            const imageFile = document.getElementById('postImgSelector');
            imageFile.click();
        },
        onSelect: function() {
            if (this.$refs.file.files && this.$refs.file.files[0]) {
                const checkImg = this.checkImg({"img": this.$refs.file.files[0], "allowedTypes": ["jpeg", "jpg", "png", "gif"], "allowedSize": 10000000});
                if (checkImg.valid) {
                    this.post.file = this.$refs.file.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        this.imgPreview = reader.result;
                    }, false);
                    reader.readAsDataURL(this.$refs.file.files[0]);
                } else {
                    this.errorMsg = checkImg.message;
                }
            }
        },
        createPost: function(action) {
            const formData = new FormData();
            let goPost = false;
            if (this.post.file) {
                formData.append('image', this.post.file);
                goPost = true;
            } else {
                if (this.post.content == '' && action != 'edit') {
                    this.errorMsg = 'Veuillez saisir au moins un texte ou une image';
                } else {
                    goPost = true;
                }
            }
            if (goPost) {
                formData.append('post', JSON.stringify(this.post));
                console.log(...formData);
                switch (action) {
                    case "create":
                        this.$http.post(process.env.VUE_APP_API+'/api/post', formData, {
                            headers: {
                                Authorization: `Bearer ${localStorage.token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then(response => {
                            EventBus.$emit('newPost', '');
                            this.createNotification({
                                "currentUserId": localStorage.id,
                                "postId": response.data.postId[0].postId,
                                "commentId": 0
                            })
                            .then(() => {
                                EventBus.$emit('newNotification', '');
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            this.closeDialog();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                        break;
                    case "edit":
                        this.$http.put(`${process.env.VUE_APP_API}/api/post/${this.editPostId}`, formData, {
                            headers: {
                                Authorization: `Bearer ${localStorage.token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then(() => {
                            EventBus.$emit('newPost', '');
                            this.closeDialog();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                        break;
                    default:
                        console.log('default');
                        break;
                }
            }
        },
        closeDialog: function() {
            EventBus.$emit('showPostDialog', {"action": "close", "message": ""});
        }
    }
}
</script>