<template>
    <div class="card-body">
        <div class="row">
            <div class="col d-flex justify-content-between">
                <h5 class="cursorPointer hoverColor" @click="showPwd = !showPwd"><i class="fas fa-user-times  animate__animated animate__heartBeat animate__faster"></i> Supprimer mon compte</h5>
                <i class="fas fa-chevron-down cursorPointer hoverColor" @click="showPwd = !showPwd" v-if="!showPwd"></i>
                <i class="fas fa-chevron-up cursorPointer hoverColor" @click="showPwd = !showPwd" v-else></i>
            </div>
        </div>
        <transition name="fade" mode="out-in">
        <form role="form" id="deleteUserForm" @submit.prevent="deleteUser()" v-if="showPwd">
            <hr>
            <div class="row">
                <div class="col">
                    <input v-model="data.body.deleteDatas" type="checkbox" name="deleteDatas" id="deleteDatas"><label for="deleteDatas" class="pl-2" style="display:unset;">Supprimer également mes publications, commentaires et autres*</label>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Veuillez saisir votre mot de passe pour pouvoir supprimer ce compte :</h6></div>
                <div class="col-sm-7 text-primary-2">
                    <p class="text-left alerte">{{ errorMsg.password }}</p>
                    <input v-model="data.body.password" type="password" id="deletePwd" name="password" class="form-control input-lg mb-4 w-100" placeholder="Votre mot de passe" required />
                </div>
            </div>
            <div class="text-right mb-5">
                <button id="deleteUserValid" type="submit" class="btn btn-primary" disabled><i class="fas fa-user-times"></i> Supprimer mon compte</button>
            </div>
            <div class="row">
                <div class="col">
                    <small class="text-danger">* Sélectionnez cette option si vous souhaitez que Groupomania supprime toutes les publications, tous les commentaires et tous les likes dont vous être l'auteur. Si cette option n'est pas sélectionnée, seul votre compte sera supprimé, vos publications, commentaires et likes seront conservés et visibles par les autres membres.</small>
                </div>
            </div>
        </form>
        </transition>
    </div>
</template>

<script>
import deleteUserQuery from '@/services/deleteUserQuery';

export default {
    name: 'DeleteUser',
    data () {
        return {
            data: {
                token: localStorage.token,
                id: localStorage.id,
                body: {
                    email: localStorage.email,
                    password: '',
                    deleteDatas: false,
                }
            },
            email: localStorage.email,
            password: '',
            deleteDatas: false,
            errorMsg: {
                password: ''
            },
            showPwd: false
        }
    },
    watch: {
        'data.body.password': {
            handler: function(after) {
                document.getElementById('deleteUserValid').disabled = (after != '') ? false : true;
            }
        },
    },
	mixins: [deleteUserQuery],
    methods: {
        deleteUser: function() {
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
                localStorage.clear();
                setTimeout( () => window.location.reload(), 1500);
                this.$dialog({
                    title: 'Confirmation',
                    content: response.data.message,
                    btns: [{
                        label: 'Oui',
                        class: 'btn btn-primary'
                    }],
                })
            })
            .catch(error => {
                this.errorMsg.password = error.response.data.message;
            });
        },
    }
}
</script>

<style lang="scss" scoped>
input[checkbox], label {
    cursor: pointer;
}
</style>