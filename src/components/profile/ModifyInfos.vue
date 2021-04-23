<template>
        <div class="card-body">
            <div class="row">
                <div class="col d-flex justify-content-between">
                    <h5><i class="fas fa-user-tie animate__animated  animate__bounce animate__faster"></i> Mes informations</h5>
                    <i class="far fa-edit cursorPointer hoverColor" @click="showInfos = !showInfos" v-if="showInfos"></i>
                    <i class="far fa-times-circle cursorPointer hoverColor" @click="showInfos = !showInfos; updateLocal()" v-else></i>
                </div>
            </div>
            <hr>
            <form role="form" id="modifyInfosForm" @submit.prevent="modifyInfos()">
            <div class="row">
                <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Prénom</h6></div>
                <div class="col-sm-7 text-primary-2" v-if="showInfos">{{ user.firstName }}</div>
                <div class="col-sm-7 text-primary-2" v-if="!showInfos">
                    <p class="text-left alerte">{{ errorMsg.firstName }}</p>
                    <InputText name="firstName" id="firstName" v-model="user.firstName" prependIcone="fas fa-user" />
                </div>
            </div>
     
            <div class="row">
                <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Nom</h6></div>
                <div class="col-sm-7 text-primary-2" v-if="showInfos">{{ user.lastName }}</div>
                <div class="col-sm-7 text-primary-2" v-if="!showInfos">
                    <p class="text-left alerte">{{ errorMsg.lastName }}</p>
                    <InputText name="lastName" id="lastName" v-model="user.lastName" prependIcone="fas fa-user" />
                </div>
            </div>
           
            <div class="row">
                <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Email</h6></div>
                <div class="col-sm-7 text-primary-2" v-if="showInfos">{{ user.email }}</div>
                <div class="col-sm-7 text-primary-2" v-if="!showInfos">
                    <p class="text-left alerte">{{ errorMsg.email }}</p>
                    <InputEmail name="email" id="email" v-model="user.email" />
                </div>
            </div>
     
            <div class="row">
                <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Fonction</h6></div>
                <div class="col-sm-7 text-primary-2" v-if="showInfos">{{ user.fonction }}</div>
                <div class="col-sm-7 text-primary-2" v-if="!showInfos">
                    <p class="text-left alerte">{{ errorMsg.fonction }}</p>
                    <InputText name="fonction" id="fonction" v-model="user.fonction" prependIcone="fas fa-network-wired" />
                </div>
            </div>

            <template v-if="!showInfos">
                <div class="d-flex flex-row-reverse mt-4">
                        <button type="submit" class="btn btn-primary-2 ml-1"><i class="far fa-check-square"></i> Valider</button>
                </div>
            </template>
            </form>
        </div>
</template>

<script>
import EventBus from '@/services/eventBus';
import InputEmail from '@/utils/inputs/Email';
import InputText from '@/utils/inputs/Text';
import checkForm from '@/services/checkForm';

export default {
    name: 'ModifyInfos',
	data () {
		return {
            showInfos: true,
            showPwd: true,
            user: {
                firstName: '',
                lastName: '',
                email: '',
                fonction: '',
            },
            errorMsg: {
                firstName: '',
                lastName: '',
                email: '',
                fonction: '',
            }
		}
	},
    mounted() {
        this.updateLocal();
    },
    mixins: [checkForm],
    methods: {
        modifyInfos: function() {
            this.$loading.show({delay: 0});
            const inputs = document.getElementById("modifyInfosForm").querySelectorAll('input');

            const goModify = this.checkForm(inputs);
            for (let element in this.errorMsg) {
                this.errorMsg[element] = '';
            }
            if (goModify.valid) {
                this.$http.put(process.env.VUE_APP_API+'/api/user/'+localStorage.id, {"user": JSON.stringify(this.user)}, {headers: { Authorization: `Bearer ${localStorage.token}` }})
                .then(response => {
                    localStorage.email = this.user.email;
                    localStorage.firstName = this.user.firstName;
                    localStorage.lastName = this.user.lastName;
                    localStorage.fonction = this.user.fonction;
                    this.showInfos = !this.showInfos;
                    EventBus.$emit('logged', 'Vos données ont bien été mises à jour.');
                    this.$dialog({
                        title: 'Confirmation',
                        content: response.data.message,
                        btns: [{
                            label: 'Ok',
                            class: 'btn btn-primary'
                        }]
                    })
                })
                .catch(error => {
                    this.errorMsg.firstName = error.response.data.message;
                });
            } else {
				for (const property in goModify.elements) {
					this.errorMsg[property] = goModify.elements[property];
				}
            }
            this.$loading.hide();
        },
        updateLocal: function() {
            this.user.firstName = localStorage.firstName;
            this.user.lastName = localStorage.lastName;
            this.user.email = localStorage.email;
            this.user.fonction = localStorage.fonction;
        }
    },
    components: {
        InputEmail,
		InputText,
    }
}
</script>