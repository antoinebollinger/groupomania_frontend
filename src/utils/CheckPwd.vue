<template>
    <div :class="`checkPwd text-left w-100 ${binderChange}`">
        <div class="row">
            <div class="col-5"><p class="alerte" id="minuscule"><span class="icon login"></span> 1 minuscule</p></div>
            <div class="col-7"><p class="alerte" id="majuscule"><span class="icon login"></span> 1 MAJUSCULE</p></div>
        </div>
        <div class="row">
            <div class="col-5"><p class="alerte" id="chiffre"><span class="icon login"></span> 1 chiffre</p></div>
            <div class="col-7"><p class="alerte" id="special"><span class="icon login"></span> 1 caractère spécial : @$!%*?&</p></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckPwd',
    data () {
        return {
            binderChange: ''
        }
    },
    props: {
        binder: {
            type: String,
            default: ""
        }
    },
    mounted () {
        const binder = document.getElementById(this.binder);
        if (binder!= null) {
            binder.addEventListener('focus', () => {
                this.binderChange = 'active';
            });
            binder.addEventListener('blur', () => {
                this.binderChange = (binder.value != '') ? 'active' : '';
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.checkPwd {
    opacity: 0;
    transition: opacity 0.4s;
    &.active {
        opacity: 1;
    }
}
</style>