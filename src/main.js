import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 引入自定义的全局css文件(覆盖element-plus自带的样式写这里)
import './assets/css/main.css'

var app = createApp(App)

// 将封装的请求对象，设置为应用的全局属性
import api from './api/index.js'
app.config.globalProperties.$api = api

//  将定义echarts图表对象绑定为全局属性
import chart from './assets/js/chart.js'
app.config.globalProperties.$chart = chart


// 将element-plus注册到app这个应用中
app.use(ElementPlus, {
	locale: zhCn,
})

// 引入element的图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 将element的图标注册为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}


// 将处理日期的工具函数对象，引入进来，设置为应用app的全局属性
import dataH from './assets/js/dateHandler.js'
app.config.globalProperties.$date = dataH


// 注册vuex
app.use(store)

// // 关于pinia的使用(代替vuex进行全局数据管理)案例讲解时使用的代码
// import { createPinia } from 'pinia'
// app.use(createPinia())


app.use(router).mount('#app')
