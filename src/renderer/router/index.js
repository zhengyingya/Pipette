import Vue from 'vue'
import Router from 'vue-router'
import Measure from '@/components/Measure'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'measure',
      component: Measure
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
