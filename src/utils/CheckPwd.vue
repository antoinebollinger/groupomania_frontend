<template>
  <div :class="`checkPwd text-left w-100 ${binderChange}`">
    <div class="row">
      <div class="col-5">
        <p class="alerte" id="minuscule">
          <span class="icon login"></span> 1 minuscule
        </p>
      </div>
      <div class="col-7">
        <p class="alerte" id="majuscule">
          <span class="icon login"></span> 1 MAJUSCULE
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-5">
        <p class="alerte" id="chiffre">
          <span class="icon login"></span> 1 chiffre
        </p>
      </div>
      <div class="col-7">
        <p class="alerte" id="special">
          <span class="icon login"></span> 1 caractère spécial : @$!%*?&
        </p>
      </div>
    </div>
    <p class="alerte mt-1" :style="textStyle">Force du mot de passe</p>
    <div class="progress" style="height: 5px">
      <div
        role="progressbar"
        class="progress-bar"
        :style="barStyle"
        :aria-valuenow="pwdStrength"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckPwd",
  data() {
    return {
      binderChange: "",
    };
  },
  props: {
    binder: {
      type: String,
      default: "",
    },
    pwdStrength: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    H: function () {
      return this.pwdStrength <= 100 ? (131 * this.pwdStrength) / 100 + 3 : 134;
    },
    S: function () {
      return this.pwdStrength <= 100
        ? (-39 * this.pwdStrength) / 100 + 100
        : 61;
    },
    A: function () {
      return this.pwdStrength <= 100 ? (-20 * this.pwdStrength) / 100 + 61 : 41;
    },
    barStyle: function () {
      return {
        width: `${this.pwdStrength}%`,
        backgroundColor: `hsl(${this.H},${this.S}%,${this.A}%)`,
      };
    },
    textStyle: function () {
      return {
        color: `hsl(${this.H},${this.S}%,${this.A}%)`,
      };
    },
  },

  mounted() {
    const binder = document.getElementById(this.binder);
    if (binder != null) {
      binder.addEventListener("focus", () => {
        this.binderChange = "active";
      });
      binder.addEventListener("blur", () => {
        this.binderChange = binder.value != "" ? "active" : "";
      });
    }
  },
};
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