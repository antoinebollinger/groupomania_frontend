import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter)

const routes = [
  {
    path: process.env.BASE_URL,
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
    meta: {
      guest: true
    }    
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('../views/Notification.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue'),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '*', 
    redirect: '/login'
  }
]

const router = new VueRouter({
  
  inkActiveClass: 'active', 
  routes, 
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.token == null) {
      next({ name: "Login" })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if(localStorage.token == null) {
      next()
    } else {
      next({ name: 'Home' })
    }
  } else {
    next()
  }
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next()
})

router.afterEach(() => {
  NProgress.done();
})

export default router
