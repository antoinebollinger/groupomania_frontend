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
import logout from '@/services/logout'

export default {
  name: 'App',
  components: {
    Header, 
    Footer
  },
  mixins: [logout],
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        console.log(resolve);
        console.log(reject);
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.logoutQuery();
        }
        throw err;
      });
    });
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
