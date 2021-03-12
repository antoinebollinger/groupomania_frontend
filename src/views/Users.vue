<template>
    <div class="home">
        <div class="container min-vh-100">
            <div class="row d-flex flex-column align-items-center justify-content-center pt-1 pt-md-0">
                <div class="mb-1 mb-md-4 pb-2 col-md-7 bg-white">
                    <UserSearch />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserSearch from '@/components/user/UserSearch.vue';

export default {
    name: 'Users',
    mounted () {
        document.title = 'Membres | Groupomania'
    },
	components: {
		UserSearch
	}
}
</script>