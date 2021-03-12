<template>
  <div class="start">
    <div class="container-fluid">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5"></div>
          <div class="col-md-5 d-flex flex-column justify-content-center text-left">
            <img src="@/assets/icon-left-font-monochrome-black.png" alt="Logo Groupomania" class="logo" />
            <h4 class="text-left"><br>Notre entreprise, spécialisée dans la grande distribution, est en pleine expansion. Nous avons actuellement plus de 600 collaborateurs et avons beaucoup recruté depuis quelques années. Nous étions uniquement 300 il y a 3 ans.<br><br>Afin d'améliorer la qualité de la communication entre ses collaborateurs, Groupomania a décidé de créer un réseau social interne, moderne et ludique, qui permettra aux employés de mieux se connaître dans un cadre plus informel.</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  mounted () {
    document.title = 'A propos | Groupomania';
  }
}
</script>

<style lang="scss" scoped>
.start:before {
    background-image: url('../assets/bgRed3.jpg');
}
</style>