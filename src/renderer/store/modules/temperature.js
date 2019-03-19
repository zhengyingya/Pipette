import usb from '../../../common/usb'
const state = {
  temp: ''
}

const actions = {
  changeRouter(context, { name }) {
    context.commit('APP_CHANGE_ROUTER', { name })
  }
}

const mutations = {
  APP_CHANGE_ROUTER(state, { name, params }) {
    console.log('===========')
    state.navActive = '/' + name
  }
}

export default {
  state,
  mutations,
  actions
}