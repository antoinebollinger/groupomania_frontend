<template>
    <div class="home">
        <div class="container min-vh-100">
			<div class="row justify-content-center py-md-4 py-1">
				<div id="HomeCard" class="col-md-4 px-0 px-md-2 homeCard">
                    <UserCard class="mb-1 mb-md-4" />
					<UserSearch class="mb-1 mb-md-4" />
				</div>
				<div class="col-md-8 px-0 px-md-2">
                    <div class="card shadow-sm mb-1 mb-md-4">
                        <div class="card-body">
                            <h4>Notifications</h4>
                            <p v-if="notifications.length == 0">Pas de notifications</p>
                            <template v-for="notification in notifications" >
                                <Notification :notification="notification" :key="notification.id" />
                            </template>
                        </div>
                    </div>
				</div>
			</div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/services/eventBus';
import UserCard from '@/components/user/UserCard.vue';
import UserSearch from '@/components/user/UserSearch.vue';
import Notification from '@/components/post/Notification.vue';
import notification from '@/services/notification';

export default {
    name: 'MyNotification',
    data () {
        return {
            notifications: {}
        }
    },
    mounted () {
        document.title = 'Notifications | Groupomania';
        this.getNotifs();
        EventBus.$on('newNotification', () => {
            this.getNotifs();
        });
    },
    mixins: [notification],
    methods: {
        getNotifs: function() {
            this.$http.get(`${process.env.VUE_APP_API}/api/notification/${localStorage.id}`,   {headers: {	Authorization: `Bearer ${localStorage.token}` }})
            .then(response => {
                this.notifications = response.data;
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
	components: {
		Notification,
        UserCard,
        UserSearch
	}
}
</script>