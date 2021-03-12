<template>
    <div class="card-body">
        <div class="row">
            <div class="col d-flex justify-content-between">
                <h5><i class="fas fa-bell animate__animated animate__swing animate__faster" v-if="notification"></i><i class="fas fa-bell-slash" v-else></i> Notifications</h5>
            </div>
        </div>
        <hr>
        <div class="d-flex align-items-center">
            <label class="switch m-0">
                <input type="checkbox" v-model="notification">
                <span class="slider round"></span>
            </label>
            <p class="m-0 ml-2">{{ notificationMsg }}</p>
        </div>
    </div>
</template>

<script>
import EventBus from '../../services/eventBus';

export default {
    name: 'ModifyNotifs',
    data () {
        return {
            notification: true,
            notificationMsg: '',
        }
    },
    watch: {
        'notification': {
            handler: function(after) {
                const newNotification = (after) ? 0 : -1 ;
                this.updateUserWantsNotifs(newNotification);
                if (!after) {
                    const favicon = document.getElementById("favicon");
                    favicon.href = `${window.location.origin}/icon.ico`;     
                }
            }
        },
    },
    mounted () {
        this.localUpdate(false);
    },
    methods: {
        updateUserWantsNotifs: function(notification) {
            this.$http.put(`${process.env.VUE_APP_API}/api/user/${localStorage.id}/notifs`, { "notification": notification }, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                }
            })
            .then(() => {
                localStorage.notification = notification ; 
                this.localUpdate(true);
            })
            .catch(error => {
                console.log(error);
            }) 
        },
        localUpdate: function(emit) {
            this.notification = (localStorage.notification > -1) ? true : false;
            this.notificationMsg = (localStorage.notification > -1) ? 'Notifications activées' : 'Notifications désactivées';
            if (emit) {EventBus.$emit('newNotification', '');}
        }
    }
}
</script>

<style lang="scss" scoped>
$h: 20;
$w: 40;
$d: 16;
$x: ($h - $d) / 2;
$y: ($w - 2*$x - $d);

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: $w * 1px;
  height: $h * 1px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: $d * 1px;
  width: $d * 1px;
  left: $x * 1px;
  bottom: $x * 1px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-2);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-2);
}

input:checked + .slider:before {
  -webkit-transform: translateX($y * 1px);
  -ms-transform: translateX($y * 1px);
  transform: translateX($y * 1px);
}

/* Rounded sliders */
.slider.round {
  border-radius: $d * 1px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>