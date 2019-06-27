import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Demo from '@/demo'
import Class from '@/class'
import { zList } from '@/demo/z/router'
import { classList } from '@/class/components/router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
    }
  ]
})
