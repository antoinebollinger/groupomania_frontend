<template>
    <div class="start">
        <div class="container-fluid">
            <div class="container">
                <div class="row">
                    <div class="col-md-7 d-flex flex-column justify-content-center text-left py-5">
                        <h4><b>Rejoignez votre équipe</b><br>sur le réseau social<br>des collaborateurs de</h4>
                        <img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania" class="logo d-none d-md-block" />
                        <img src="../assets/icon-left-font-monochrome-black.png" alt="Logo Groupomania" class="logo d-block d-md-none" />
                    </div>
                    <div class="col-md-5">
                        <SignupForm />
                        <br><hr><br>
                        <router-link to="/login" title="Connexion"><p class="m-0 hoverColor">J'ai déjà un compte</p></router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SignupForm from '@/components/auth/SignupForm.vue'

export default {
    name: 'Signup',
    mounted () {
        document.title = 'S\'inscrire | Groupomania';
    },
    components: {
        SignupForm
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
    background-image: url('../assets/bgRed2.jpg');
}
</style>