<template>
    <header>
        <div id="headerLogo">
            <a href="/"><img src="../assets/icon-left-font.png" alt="Revenir à la page d'accueil" class="logoNavImg d-inline-block align-middle mr-2"></a>
        </div>
        <Nav />
    </header>
</template>

<script>
import Nav from '@/components/Nav.vue';

export default {
  name: 'Header',
  components: {
    Nav
  }    
}
</script>

<style lang="scss" scoped>
#headerLogo {
    display: none;
}

@media (max-width: 768px) {
    #headerLogo {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        box-shadow: 0 0 10px grey;
        img {
            max-height: 40px;
        }
    }
}
</style>