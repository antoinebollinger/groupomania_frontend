<template>
    <div class="card-body">
        <div class="row">
            <div class="col d-flex justify-content-between">
                <h5 class="cursorPointer hoverColor" @click="showPwd = !showPwd"><i class="fas fa-key animate__animated animate__rubberBand animate__faster"></i> Mot de passe</h5>
                <i class="fas fa-chevron-down cursorPointer hoverColor" @click="showPwd = !showPwd" v-if="showPwd"></i>
                <i class="fas fa-chevron-up cursorPointer hoverColor" @click="showPwd = !showPwd" v-else></i>
            </div>
        </div>
        <transition name="fade" mode="out-in">
            <form role="form" id="modifyPwdForm" @submit.prevent="modifyPwd()" v-if="!showPwd">
             
                <div class="row">
                    <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Ancien mot de passe</h6></div>
                    <div class="col-sm-7 text-primary-2">
                        <p class="text-left alerte">{{ errorMsg.oldPwd }}</p>
                        <input type="password" data-type="password" v-model="data.oldPwd" id="oldPwd" name="oldPwd" class="form-control input-lg w-100" required>
                    </div>
                </div>
 
                <div class="row">
                    <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Nouveau mot de passe</h6></div>
                    <div class="col-sm-7 text-primary-2">
                        <p class="text-left alerte">{{ errorMsg.newPwd1 }}</p>
                        <input type="password" data-type="password" v-model="data.newPwd1" id="newPwd1" name="newPwd1" class="form-control input-lg invalid w-100" required>
                        <CheckPwd />
                    </div>
                </div>
         
                <div class="row  mb-4">
                    <div class="col-sm-5 d-flex align-items-center"><h6 class="mb-0">Répétez le nouveau mot de passe</h6></div>
                    <div class="col-sm-7 text-primary-2">
                        <p class="text-left alerte" id="textNewPwd2">{{ errorMsg.newPwd2 }}</p>
                        <input type="password" data-type="password" v-model="data.newPwd2" id="newPwd2" name="newPwd2" class="form-control input-lg invalid w-100" required>
                    </div>
                </div>
         
                <div class="d-flex flex-row-reverse">
                    <button type="submit" class="btn btn-primary-2 ml-1"><i class="far fa-check-square"></i> Valider</button>
                </div>
            </form>
        </transition>
    </div>
</template>

<script>
import checkForm from '@/services/checkForm';
import CheckPwd from '@/services/CheckPwd.vue';

export default {
    name: 'ModifyPwd',
    data () {
		return {
            showPwd: true,
            data: {
                oldPwd: '',
                newPwd1: '',
                newPwd2: '',
            },
            errorMsg: {
                oldPwd: '',
                newPwd1: '',
                newPwd2: ''
            }
		}
	},
	watch: {
		'data.newPwd1': {
			handler: function(after) {
				const resultat = this.checkPassword(after);
				const newPwd1 = document.getElementById("newPwd1");
				let ok = true;
				for (const property in resultat) {
					if (resultat[property]) {
						document.getElementById(property).classList.add("ok");
					} else {
						document.getElementById(property).classList.remove("ok");
						ok = false;
					}
				}
				if (ok) {
					newPwd1.classList.add("valid");
					newPwd1.classList.remove('invalid');
				} else {
					newPwd1.classList.add("invalid")
					newPwd1.classList.remove('valid');
				}
			},
			deep: true
		},
        'data.newPwd2' : {
            handler: function(after) {
                const newPwd2 = document.getElementById("newPwd2");
                const textNewPwd2 = document.getElementById('textNewPwd2');
                if (after == this.data.newPwd1) {
					newPwd2.classList.add("valid");
					newPwd2.classList.remove('invalid');
                    textNewPwd2.classList.add('ok');
                    this.errorMsg.newPwd2 = 'Les mots de passe correspondent.';
				} else {
					newPwd2.classList.add("invalid")
					newPwd2.classList.remove('valid');
                    textNewPwd2.classList.remove('ok');
                    this.errorMsg.newPwd2 = 'Les mots de passe de correspondent pas.';
				}
            }
        }
	},
    mixins: [checkForm],
    methods: {
        modifyPwd: function() {
            this.$loading.show({delay: 0});
            const inputs = document.getElementById("modifyPwdForm").querySelectorAll('input');
            const goModify = this.checkForm(inputs);
            for (let element in this.errorMsg) {
                this.errorMsg[element] = '';
            }
            if (goModify.valid) {
                if (this.data.newPwd1 == this.data.newPwd2) {
                    console.log('go');
                    this.$http.put(process.env.VUE_APP_API+'/api/user/'+localStorage.id+'/pwd', this.data, {headers: { Authorization: `Bearer ${localStorage.token}` }})
                    .then(response => {
                        console.log(response);
                        this.$dialog({
                            title: 'Confirmation',
                            content: response.data.message,
                            btns: [{
                                label: 'Ok',
                                class: 'btn btn-primary',
                                callback: () => { window.location.reload() }
                            }]
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            } else {
				for (const property in goModify.elements) {
					this.errorMsg[property] = goModify.elements[property];
                }          
            }
            this.$loading.hide();
        }
    },
    components: {
        CheckPwd
    }
}
</script>

<style lang="scss" scoped>
input {
	&:valid, &.valid {
		border-color: var(--success);
	}
	&:invalid, &.invalid {
		border-color: #ced4da;
	}
};
</style>