<template>
    <div class="user d-flex flex-row align-items-center p-1 cursorPointer hoverColor" @click="goToUser(user.id)">
        <UserImage :image="user.imageUrl" dia="40" />
        <div class="d-flex flex-column ml-2"> 
            <span class="font-weight-bold">{{ user.firstName+' '+user.lastName }}</span>
            <small>{{ user.fonction }}</small>
        </div>
    </div>   
</template>

<script>
import UserImage from '@/components/user/UserImage.vue';

export default {
    name: 'User',
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        goToUser: function(userId) {
            this.$router.push(`/user?userId=${userId}`);
            if(this.$route.name == 'User') {location.reload();}
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
.user {
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