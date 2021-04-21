<template>
    <div class="card profilCard bg1">
        <div class="card-body">
            <div class="d-flex flex-column align-items-center text-center">
                <UserImage message1="Cliquez sur l'image" message2="pour la modifier" dia="200" cursor="pointer" @click.native="openFileSelector" />
                <input id="imgSelector" type="file" name="image" ref="file" @change="onSelect" />
                <p class="alerte text-danger">{{ errorMsg }}</p>
                <button type="button" class="btn btn-primary" v-on:click="logout()"><i class="fas fa-sign-out-alt"></i> Se déconnecter</button>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/services/eventBus';
import UserImage from '@/components/user/UserImage.vue';
import logout from '@/services/logout.js';

export default {
    name: 'UserCard',
    data () {
		return {
            imageUrl: '',
            errorMsg: '',
            user: {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                fonction: '',
            }
		}
	},
    mounted() {
        this.imageUrl = localStorage.imageUrl;
        this.user.email = localStorage.email;
        this.user.firstName = localStorage.firstName;
        this.user.lastName = localStorage.lastName;
        this.user.fonction = localStorage.fonction;
        this.user.id = localStorage.id;
    },
    mixins: [logout],
    methods: {
        openFileSelector: function() {
            document.getElementById('imgSelector').click();
        },
        onSelect: function() {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            const file = this.$refs.file.files[0];
            let goImage = true;
            if (!allowedTypes.includes(file.type)) {
                this.errorMsg = 'Seuls les images au format jpg/jpeg ou png sont autorisées.';
                goImage = false;
            }
            if (file.size>500000) {
                this.errorMsg = 'Taille maximale :  500kb';
                goImage = false;
            } 
            const formData = new FormData();
            formData.append('image', file);
            formData.append('user', JSON.stringify(this.user));
        if (goImage) {
                this.$http.put(process.env.VUE_APP_API+'/api/user/'+localStorage.id, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    localStorage.setItem('imageUrl', response.data.newUrl)
                    this.imageUrl = localStorage.imageUrl;
                    EventBus.$emit('logged', 'L\'image a bien été modifiée.');
                    this.$dialog({
                        title: 'Confirmation',
                        content: response.data.message,
                        btns: [{
                            label: 'Ok',
                            class: 'btn btn-primary'
                        }],
                    })
                })
                .catch(error => {
                    this.errorMsg = error.response.data.message;
                });
            }
        },
        logout: function() {
            this.$dialog({
                title: 'Déconnexion',
                content: 'Êtes-vous certain de vouloir vous déconnecter ?',
                btns: [{
                    label: 'Oui',
                    class: 'btn btn-primary',
                    callback: () => { this.logoutQuery(); }
                   
                },
                {
                    label: 'Non',
                    color: '#444',
                    ghost: true
                }],
            })
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
#imgSelector {
    display: none;
}
</style>