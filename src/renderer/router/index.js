import Vue from 'vue'
import Router from 'vue-router'
import Measure from '@/components/Measure'
import List from '@/pages/list/list'
import ComConfig from '@/pages/ComConfig/comConfig'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Measure
    },
    {
      path: '/',
      name: 'list',
      component: List
    },
    {
      path: '/comConfig',
      name: 'comConfig',
      component: ComConfig
    }
  ]
})
