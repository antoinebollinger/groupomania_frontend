<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header, 
    Footer
  }
}
</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
  height: 100%;
}
</style>
