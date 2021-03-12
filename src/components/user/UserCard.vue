<template>
    <div class="card profilCard" v-bind:class="{'bg2': !link, 'bg3': link}">
        <div class="p-2 d-flex">
            <div class="d-flex flex-column mr-2">
                <a href="/profile" v-if="link">
                    <div class="imgDiv" :style="'background-image:url('+user.imageUrl+');'"><i class="fas fa-shield-alt text-primary" v-if="userAdmin"></i></div>
                </a>
                <div class="imgDiv" :style="'background-image:url('+user.imageUrl+');'" v-else><i class="fas fa-shield-alt text-primary" v-if="userAdmin"></i></div>
            </div>
            <div class="d-flex flex-column justify-content-around">
                <div>
                    <p class="font-weight-bold m-0 text-white">{{ userFirstName }} {{ userLastName }}</p>
                    <p class="m-0 text-white">{{ user.fonction }}</p>
                </div>
                <div>
                    <template v-if="link">
                        <a href="/profile"><small class="ellipsis hoverColor"><i class="fas fa-user-tie"></i> Mon compte</small></a><br>
                        <a :href="`/user?userId=${user.id}`"><small class="ellipsis hoverColor"><i class="fas fa-clipboard"></i> Mes publications</small></a>
                    </template>
                    <template v-else>
                        <a :href="`mailto:${user.email}`"><small class="ellipsis hoverColor"><i class="fas fa-envelope"></i> Contacter {{ userFirstName }}</small></a><br>
                    </template>
                    <small v-if="isAdmin && !currentUser" class="ellipsis cursorPointer hoverColor mt-2" @click="deleteUser()"><i class="fas fa-shield-alt mr-1"></i>Supprimer ce profil</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import deleteUserQuery from '@/services/deleteUserQuery';

export default {
    name: 'HomeCard',
    props: {
        user: {
            type: Object,
            default: function () {
                return {
                    id: localStorage.id,
                    firstName: localStorage.firstName,
                    lastName: localStorage.lastName,
                    fonction: localStorage.fonction,
                    imageUrl: localStorage.imageUrl,
                    admin: localStorage.admin,
                    email: localStorage.email
                }
            }
        },
        position: {
            type: String,
            default: 'center'
        },
        link: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            data: {
                token: localStorage.token,
                id: '',
                body: {
                    email: '',
                    password: '',
                    deleteDatas: true,
                    admin: false
                }
            }
        }
    },
    computed: {
        userFirstName: function() {
            return (this.user.firstName != '') ? this.user.firstName : 'Compte';
        },
        userLastName: function() {
            return (this.user.lastName != '') ? this.user.lastName : 'supprimé';
        },
        userImageUrl: function() {
            return ((this.user.imageUrl != '') ? this.user.imageUrl : `${process.env.VUE_APP_API}/images/user.png`);
        },
        userFonction: function() {
            return ((this.user.fonction != '') ? this.user.fonction : ``);
        },
        userAdmin: function() {
            return (this.user.admin == 1) ? true : false;
        },
        isAdmin: function() {
            return (localStorage.admin == 1) ? true : false;
        },
        currentUser: function() {
            return (this.user.id == localStorage.id);
        }
    },
	mixins: [deleteUserQuery],
    methods: {
        deleteUser: function() {
            this.data.id = this.user.id;
            this.data.body.email = this.user.email,
            this.data.body.admin = (localStorage.admin == 1) ? true : false;
            console.log(JSON.stringify(this.data))
            this.$dialog({
                title: 'Suppression de compte',
                content: 'Êtes-vous certain de vouloir supprimer votre compte ?',
                btns: [{
                    label: 'Oui',
                    class: 'btn btn-primary',
                    callback: () => { this.deleteQuery(); }
                },
                {
                    label: 'Non',
                    color: '#444',
                    ghost: true
                }],
            })
        },
        deleteQuery: function() {
            this.deleteUserQuery(this.data)
            .then(response => {
                this.$dialog({
                    title: 'Confirmation',
                    content: response.data.message,
                    btns: [{
                        label: 'Oui',
                        class: 'btn btn-primary',
                        callback: () => { this.$router.push('Home'); }
                    }],
                })
            })
            .catch(error => {
                this.errorMsg.password = error.response.data.message;
            });
        }

    }
}
</script>