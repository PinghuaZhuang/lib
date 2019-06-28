import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Demo from '@/demo'
import Class from '@/class'
import Event from '@/event'
import { zList } from '@/demo/z/router'
import { classList } from '@/class/components/router'
import { eventList } from '@/event/components/router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      children: [
        ...zList
      ]
    },
    {
      path: '/class',
      name: 'class',
      component: Class,
      children: [ ...classList ]
    },
    {
      path: '/event',
      name: 'event',
      component: Event,
      children: [ ...eventList ]
    }
  ]
})
