<template>
    <footer class="bg-white text-center text-lg-start shadow d-flex flex-column justify-content-center" v-if="!isLogged">
        <div>
            <router-link class="mx-2 hoverColor" to="/">Se connecter</router-link>
            <router-link class="mx-2 hoverColor" to="/signup">S'inscrire</router-link>
            <router-link class="mx-2 hoverColor" to="/about">A propos</router-link>
        </div>
        <div>© 2021 Copyright Groupomania</div>
    </footer>
</template>

<script>
import EventBus from '../services/eventBus';

export default {
    name: 'Footer',
    data () {
        return {
            isLogged: this.isLoggedFu(),
        }
    },
    mounted () {
        EventBus.$on('logged', () => {
            this.isLogged = this.isLoggedFu();
        })
    },
    methods: {
        isLoggedFu: function() {
            return (localStorage.id == null) ? false : true
        }
    }
}
</script>

<style lang="scss" scoped>
footer {
    height: 60px;
    a {
        color: #2c3e50!important;
        &.router-link-exact-active, &:hover {
            color: var(--primary)!important;
        }
    }
}

@media (max-width: 768px) {
    footer {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
    }
}
</style>