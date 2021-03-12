<template>
    <div class="text-left">
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
    name: 'CheckPwd'
}
</script>