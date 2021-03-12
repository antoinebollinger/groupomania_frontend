<template>
    <div class="imgDiv" :style="'background-image:url('+imageUrl+');height:'+dia+'px;width:'+dia+'px;cursor:'+cursor+';'">
        <small class="text-white">{{ message1 }}<br>{{ message2 }}</small>
    </div>    
</template>

<script>
import EventBus from '@/services/eventBus';

export default {
    props: {
        message1: {
            type: String,
            default: ''
        },
        message2: {
            type: String,
            default: ''
        },
        dia: {
            type: String,
            default: '40'
        },
        image: {
            type: String,
            default: ''
        },
        cursor: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            imageUrl: ''
        }
    },
    mounted() {
        if (this.image == '') {
            this.imageUrl = localStorage.imageUrl,
            EventBus.$on('logged', () => {
                this.imageUrl = localStorage.imageUrl
            })
        } else {
            this.imageUrl = this.image;
        }
    }
}
</script>

<style lang="scss">
.imgDiv {
    border-radius: 50% !important;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    small {
        visibility: hidden;
    }
    &:hover small {
        visibility: visible;
    }
}
</style>