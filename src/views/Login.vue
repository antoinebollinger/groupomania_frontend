<template>
    <div class="start">
        <div class="container-fluid">
            <div class="container">
                <div class="row">
                    <div class="col-md-7 d-flex flex-column justify-content-center text-left py-5">
                        <h4><b>Bienvenue</b><br>sur le réseau social<br>des collaborateurs de</h4>
                        <img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania" class="logo d-none d-md-block" />
                        <img src="../assets/icon-left-font-monochrome-black.png" alt="Logo Groupomania" class="logo d-block d-md-none" />
                    </div>
                    <div class="col-md-5">
                        <LoginForm />
                        <br><hr><br>
                        <p>Pas encore inscrit ?</p>
                        <router-link to="/signup" title="S'inscrire">
                            <button type="button" class="btn btn-lg btn-primary-2 text-uppercase">S'inscrire</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'

export default {
    name: 'Login',
    mounted () {
        document.title = 'Se connecter | Groupomania';
    },
    components: {
        LoginForm
    }
}
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
  h4 {
      color: white;
  }
}

.start:before {
    background-image: url('../assets/bgRed1.jpg');
}
</style>