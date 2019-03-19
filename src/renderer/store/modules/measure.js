import basis from '../../../constant/basis'
import kt from '../../../constant/kt'
import usb from '../../../common/usb'

// 初始化测量表数据
const init = () => {
  let list = []
  for (let i=0; i< 18; i++) {
    let point = 0.1
    if (parseInt(i / 6) === 1) {
      point = 0.5
    } else if (parseInt(i / 6) === 2) {
      point = 1
    }
    list.push({
      point: point,
      temp: '',
      mass: '',
      k: '',
      v20: '',
      ave: '',
      relativeError: '',
      repeatability: ''
    })
  }
  return list
}

// 清空state中所有的数据，还原至初始状态
function clearAll(state) {
  state.tableData = init()
  state.currentNum = 0
  state.capacity = 1
}

// 计算平均值和误差
const computeE = (state, start) => {
  let v = 0;
  for (let i = start; i < start + 6; i++) {
    v += Number(state.tableData[i].v20)
  }
  const ave = (v / 6).toFixed(2)                  // 计算平均值

  const E = ((Number(state.tableData[start].point) - ave) * 100 / ave).toFixed(1)   // 计算误差
  let total = 0                                   // 计算标准差
  for (let i = start; i < start + 6; i++) {
    total += Math.pow(Number(state.tableData[i].v20 - ave), 2)
  }
  const S = (Math.sqrt(total / 5) * 100 / ave).toFixed(1)
  return [ave, E, S]
}

// 判断结论
const computeResult = (point, E, S) => {
  const { error, repeatability } = basis[state.capacity][point]
  if (Math.abs(E) <= error && S <= repeatability ) {
    return '合格'
  } else {
    return '不合格'
  }
}


const state = {
  tableData: init(),                             // 原始记录表数据
  currentNum: 0,
  capacity: 1                                    // 当前移液器的容量
}

const actions = {
  // 移液器容量的选择
  changeCapacity(context, { capacity }) {
    context.commit('MEASURE_CHANGE_CAPACITY', { capacity })
  },
  saveMeasureData(context, { mass }) {
    context.commit('MEASURE_SAVE_MEASURE_DATA', { mass })
  },
  saveRemearData(context, { mass, index }) {
    context.commit('MEASURE_SAVE_REMEAR_DATA', { mass, index })
  },
  clearAll({ commit }) {
    commit('MEASURE_CLEAR_ALL')
  }
}

const mutations = {
  MEASURE_CLEAR_ALL(state) {
    clearAll(state)
  },
  MEASURE_CHANGE_CAPACITY(state, { capacity }) {
    let keys = Object.keys(basis[capacity]).sort((a, b) => {
      return Number(a) - Number(b)
    })
    let data = state.tableData.map((item, index) => {
      let point = keys[0]
      if (parseInt(index / 6) === 1) {
        point = keys[1]
      } else if (parseInt(index / 6) === 2) {
        point = keys[2]
      }
      return { ...item, point }
    })
    state.tableData = [].concat(JSON.parse(JSON.stringify(data)))
    state.capacity = capacity

    if (state.tableData[0].ave !== '') {
      const ave = state.tableData[0].ave
      const E = ((Number(state.tableData[0].point) - ave) * 100 / ave).toFixed(1) 
      let result = computeResult(state.tableData[0].point, E, state.tableData[0].repeatability)
      state.tableData[0] = {
        ...state.tableData[0],
        relativeError: E,
        result
      }
    }
    if (state.tableData[6].ave !== '') {
      const ave = state.tableData[6].ave
      const E = ((Number(state.tableData[6].point) - ave) * 100 / ave).toFixed(1)
      let result = computeResult(state.tableData[6].point, E, state.tableData[6].repeatability)
      state.tableData[6] = {
        ...state.tableData[6],
        relativeError: E,
        result
      }
    }
    if (state.tableData[12].ave !== '') {
      const ave = state.tableData[12].ave
      const E = ((Number(state.tableData[12].point) - ave) * 100 / ave).toFixed(1)
      let result = computeResult(state.tableData[12].point, E, state.tableData[12].repeatability)
      state.tableData[12] = {
        ...state.tableData[12],
        relativeError: E,
        result
      }
    }
    state.tableData = [].concat(JSON.parse(JSON.stringify(state.tableData)))
  },
  MEASURE_SAVE_MEASURE_DATA(state, { mass }) {
    const currentNum = state.currentNum
    const temp = usb.get()
    state.tableData[currentNum] = {
      ...state.tableData[currentNum],
      mass,
      temp,
      k: kt[temp],
      v20: (Number(mass) * Number(kt[temp]) * 1000).toFixed(2)
    }
    if (currentNum > 0 && parseInt(currentNum+1) % 6 === 0) {
      const start = parseInt(currentNum) - 5
      let [ave, E, S] = computeE(state, start)
      let result = computeResult(state.tableData[start].point, E, S)
      
      state.tableData[start] = {
        ...state.tableData[start],
        ave,
        relativeError: E,
        repeatability: S,
        result
      }
    }
    
    if (state.currentNum === 17) {
      state.currentNum = 0
    } else {
      state.currentNum++
    }
    state.tableData = [].concat(JSON.parse(JSON.stringify(state.tableData)))
  },
  MEASURE_SAVE_REMEAR_DATA(state, { mass, index }) {
    const temp = usb.get()
    state.tableData[index] = {
      ...state.tableData[index],
      mass,
      temp,
      k: kt[temp],
      v20: (Number(mass) * Number(kt[temp]) * 1000).toFixed(2)
    }
    const start = parseInt(index) - parseInt(index) % 6
    let [ave, E, S] = computeE(state, start)
    let result = computeResult(state.tableData[start].point, E, S)
    state.tableData[start] = {
      ...state.tableData[start],
      ave,
      relativeError: E,
      repeatability: S,
      result
    }
    state.tableData = [].concat(JSON.parse(JSON.stringify(state.tableData)))
  }
}

export default {
  state,
  mutations,
  actions
}