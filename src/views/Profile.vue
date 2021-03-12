<template>
    <div class="home">
        <div class="container min-vh-100">
            <div class="row justify-content-center py-md-4 py-1">
                <div class="col-md-4 mb-3">
                    <ModifyImg />
                </div>
                <div class="col-md-8">
                    <div class="card mb-3">
                        <ModifyInfos />
                    </div>
                   <div class="card mb-3">
                        <ModifyNotifs />
                    </div>
                    <div class="card mb-3">
                        <ModifyPwd />
                    </div>
                    <div class="card mb-0">
                        <DeleteUser />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ModifyImg from '@/components/profile/ModifyImg.vue';
import ModifyInfos from '@/components/profile/ModifyInfos.vue';
import ModifyPwd from '@/components/profile/ModifyPwd.vue';
import DeleteUser from '@/components/profile/DeleteUser.vue';
import ModifyNotifs from '@/components/profile/ModifyNotifs.vue';

export default {
    name: 'Profile',
    mounted () {
        document.title = localStorage.firstName+' '+localStorage.lastName+' | Groupomania';
    },
    components: {
        ModifyImg,
        ModifyInfos,
        ModifyPwd,
        DeleteUser,
        ModifyNotifs
    }
}
</script>