<template>
    <div id="createPostDiv" class="card shadow-sm mb-1 mb-md-4 bg-secondary" v-on:click="showPostDialog()">
        <div class="d-flex justify-content-between p-2">
            <div class="d-flex flex-row align-items-center w-100"> 
                <UserImage dia="40" />
                <div class="ml-2 flex-grow-1"> 
                    <input type="text" class="form-control bg-light w-100" :placeholder="`Que voulez-vous dire, ${ firstName } ?`" disabled>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserImage from '@/components/user/UserImage.vue';
import EventBus from '@/services/eventBus';

export default {
    name: 'CreatePost',
    data () {
        return {
            firstName: ''
        }
    },
    mounted () {
        this.firstName = localStorage.firstName;
        EventBus.$on('logged', () => {
            this.firstName = localStorage.firstName;
        })
    },
    methods: {
        showPostDialog: function() {
            EventBus.$emit('showPostDialog', {"action": "create", "message": "Créer une publication"});
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
#createPostDiv {
    cursor: pointer;
    transition: all 0.4s;
    &:hover {
        box-shadow: 0 0 10px grey!important;
    }
    input, img {
        cursor: pointer;
        pointer-events: none;
    }
}

@media (max-width: 768px) {
    #createPostDiv {
        box-shadow: none!important;
        &:hover {
            box-shadow: none!important;
        }
    }
}
</style>