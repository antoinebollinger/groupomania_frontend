<template>
    <nav class="navbar navbar-expand-lg py-0 fixed-top navbar-light" v-if="isLogged">
        <div class="container h-100">
            <div id="divLogoNav">
                <a href="/"><img src="../assets/icon-left-font.png" alt="Revenir à la page d'accueil" class="logoNavImg d-inline-block align-middle mr-2"></a>
            </div>
            <ul class="navbar-nav">
                <li class="nav-item rounded mx-1 hoverGrey" @click="toTop()">
                    <router-link to="/home" class="nav-link rounded" title="Fil d'actualité">
                        <i class="fas fa-home"></i>
                    </router-link>
                </li>
                <li class="nav-item rounded mx-" id="usersNavItem" >
                    <router-link to="/users" class="nav-link rounded" title="Rechercher...">
                        <i class="fas fa-search"></i>
                    </router-link>
                </li>
                <li class="nav-item rounded mx-1 hoverGrey" v-if="userWantsNotifs" @click="unactiveNotifs()">
                    <router-link to="/notification" class="nav-link rounded" title="Mes notifications">
                        <i class="fas fa-bell" v-bind:class="{'animate__animated animate__swing animate__faster' : animateBell}"></i>
                    </router-link>
                    <small id="nbNotifs" class="bg-primary text-light" v-if="nbNotifications > 0">{{ nbNotifications }}</small>
                </li>               
                <li class="nav-item rounded mx-1 hoverGrey">
                    <router-link to="/profile" class="nav-link rounded" :title="userName">
                        <UserImage dia="35" v-if="showImage" class="my-1" />
                        <i class="fas fa-user-tie" v-else></i>
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import EventBus from '../services/eventBus';
import UserImage from '@/components/user/UserImage.vue';

export default {
    name: 'Nav',
    data () {
        return {
            showImage: this.getImageUrl().showImage,
            isLogged: this.isLoggedFu(),
            imageUrl: this.getImageUrl().imageUrl,
            userWantsNotifs: false,
            nbNotifications: 0,
            animateBell: false
        }
    },
    computed: {
        userName: function() {
            return localStorage.firstName+' '+localStorage.lastName;
        }
    },
    mounted () {
        EventBus.$on('logged', () => {
            this.showImage = this.getImageUrl().showImage;
            this.isLogged = this.isLoggedFu();
            this.imageUrl = this.getImageUrl().imageUrl;
            this.getNotifs();
        });
        this.getNotifs();
        EventBus.$on('newNotification', () => {
            this.getNotifs();
        });
    },
    methods: {
        isLoggedFu: function() {
            return (localStorage.id == null) ? false : true
        },
        getImageUrl: function() {
           let showImage = Boolean;
           let imageUrl = '';
           if (localStorage.id == null) {
                showImage = false;
                imageUrl = '';
           } else {
               imageUrl = localStorage.imageUrl;
               if (imageUrl.includes('user.png')) {
                   showImage = false;
               } else {
                   showImage = true;
               }
           }
           return {"showImage": showImage, "imageUrl": imageUrl}
        },
        getNotifs: function() {
            this.userWantsNotifs = (localStorage.notification && parseInt(localStorage.notification) > -1) ? true : false ;
            if (this.userWantsNotifs) {
                this.$http.get(`${process.env.VUE_APP_API}/api/notification/${localStorage.id}`,   {headers: {	Authorization: `Bearer ${localStorage.token}` }})
                .then(response => {
                    this.nbNotifications = parseInt(response.data.length) - parseInt(localStorage.notification) ;
                    localStorage.notification = parseInt(response.data.length);
                    this.animateBell = (this.nbNotifications > 0) ? true : false;
                    if (this.nbNotifications > 0) {this.changeFavicon(`${window.location.origin}/notif.ico`);}
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        unactiveNotifs: function() {
            this.changeFavicon(`${window.location.origin}/icon.ico`);
            if (this.nbNotifications > 0) {
                localStorage.notification = parseInt(localStorage.notification) + parseInt(this.nbNotifications) ;
                this.$http.put(`${process.env.VUE_APP_API}/api/user/${localStorage.id}/notifs`, { "notification": localStorage.notification }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`
                    }
                })
                .then(() => {
                    this.nbNotifications = 0;
                    this.getNotifs();
                })
                .catch(error => {
                    console.log(error);
                }) 
            }
        },
        changeFavicon: function(href) {
            const favicon = document.getElementById("favicon");
            favicon.href = href;     
        },
        toTop: function() {
            if (this.$route.name == 'Home') {
                window.scroll({
                    top: 0, 
                    left: 0
                });
            }
        }
    },
    components: {
        UserImage
    }
}
</script>

<style lang="scss" scoped>
#nbNotifs {
    pointer-events: none;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 50%!important;
}
nav {
    height: 50px;
    background-color: #fff;
    box-shadow: 0 0 10px lightgray;
    img.logoNavImg {
        max-height: 40px;
    }
    ul {
        flex-direction: row!important;
        li {
            display: flex;
            position: relative;

            a {
                padding: 0 1em!important;
                display: flex!important;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                color: #2c3e50!important;
                line-height: 50px;
                &.router-link-exact-active {
                color: var(--primary)!important;
                }
                .imgDiv {
                    cursor: pointer;
                    transition: border-color 0.4s;
                    //border: thin solid white;
                }
                &.router-link-active .imgDiv, .imgDiv:hover {
                    //border: thin solid var(--primary);
                }
                &.router-link-active {
                    background-color: var(--secondary);
                }
            }
            i {
                line-height: 30px;
                font-size: 30px;
            }
            small {
                position: absolute;
                right: 0;
                bottom: 0;

            }
        }
    }
    #usersNavItem {
        display: none;
    }
}

@media (max-width: 768px) {
    nav {
        top:unset!important;
        bottom: 0!important;
        ul {
            width: 100%!important;
            height: 100%!important;
            justify-content: space-between !important;
            a.router-link-active {
                background-color: white!important;
                &:before {
                    content: "";
                    position: absolute;
                    top:0;
                    left:0;
                    right:0;
                    height: 3px;
                    background-color: var(--primary);
                }
            }
            small {
                bottom:5px!important;
            }
        }
        #divLogoNav {
            display: none;
        }
        #usersNavItem {
            display: flex;
        }
    }
}
</style>