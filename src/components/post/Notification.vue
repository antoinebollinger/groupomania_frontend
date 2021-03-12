<template>    
    <transition name="fade" mode="out-in">
        <div class="notifDiv d-flex flex-row align-items-center p-2" v-if="isCurrentUserIdNotif">
            <i class="fas fa-circle mr-2 text-primary" v-if="isActive" title="Marquer comme lu"></i>
            <i class="fas fa-circle mr-2 text-light" v-else @click="active()" title="Marquer comme non-lu"></i>
            <div class="d-flex flex-row align-items-center flex-grow-1" @click="unactive(); goToPost()">
                <UserImage :image="imgProfile" dia="40" />
                <div class="d-flex flex-column ml-1 pl-1 pr-1 flex-grow-1 text-left rounded">
                    <p class="m-0" v-bind:class="{ 'font-weight-bold': isActive, 'text-muted': !isActive }">{{ nom }} {{ postOrComment }}.<br>
                    <small class="text-primary">{{ temps }}</small></p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import UserImage from '@/components/user/UserImage.vue';
import EventBus from '@/services/eventBus';
import notification from '@/services/notification';

export default {
	name: 'Notification',
    props: {
        notification: {
            type: Object
        }
    }, 
    computed: {
        nom: function() {
            return ((this.notification.firstName != '') ? this.notification.firstName : 'Compte')+' '+((this.notification.lastName != '') ? this.notification.lastName : 'supprimé');
        },
        imgProfile: function() {
            return ((this.notification.userImage != '') ? this.notification.userImage : `${process.env.VUE_APP_API}/images/user.png`);
        },
        temps: function() {
            let temps = '';
            if (this.notification.notificationDateD != 0) {
                temps = this.notification.notificationDateD+' jours';
            } else {
                if (this.notification.notificationDateH != 0) {
                    temps = this.notification.notificationDateH+' h';
                } else {
                    temps = ((this.notification.notificationDateM == 0 ) ? '1' : this.notification.notificationDateM)+' min';
                }
            }
            return temps;

        },
        postOrComment: function() {
            return (this.notification.commentId == 0) ? ((this.notification.postId == 0) ? "a publié quelque chose" : "a publié un post") : "a laissé un commentaire";
        },
        isActive: function() {
            const inactiveUsers = this.notification.inactiveUsers.split(',')
            return (inactiveUsers.includes(localStorage.id)) ? false : true;
        },
        isCurrentUserIdNotif: function() {
            return (this.notification.userId == localStorage.id) ? false : true;
        }
    },
    mounted () {
    },
    mixins: [notification],
    methods: {
        unactive: function() {
            if (this.isActive) {
                this.unactiveNotification(this.notification.id)
                .then(response => {
                    EventBus.$emit('newNotification', { "message": response.data.message });
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        active: function() {
           if (!this.isActive) {
                this.activeNotification(this.notification.id) 
                .then(response => {
                    EventBus.$emit('newNotification', { "message": response.data.message });
                })
                .catch(error => {
                    console.log(error);
                });   
           }         
        },
        goToPost: function() {
            this.$router.push({ name: 'Home', params: { postId: this.notification.postId }})
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
.notifDiv {
    cursor: pointer;
    transition: all 0.2s;
    background-color: #f8f9fa;
    border-bottom: thin solid #ced4da;
    &:first-of-type {
        border-top: thin solid #ced4da;
    }
    &:hover, .active {
        background-color: rgb(240, 240, 240);
    }
}
</style>