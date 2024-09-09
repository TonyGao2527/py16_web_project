import {
	createStore
} from 'vuex'

/*
全局的state使用: 
*/
import api from '../api/index.js'
export default createStore({
	// 全局共享的数据
	state: {
		// 存放历史点击过的路由，在渲染成导航标签
		tags: [],
		//保存当前选择的项目
		pro:null,
		//保存项目中所有的接口信息
		interfaces:[],
		// 保存项目中所有的环境
		testEnvs: [],
		// 项目中索引的测试场景
		testScents: [],
		// 项目中所有的测试计划
		testPlans: [],
		// 项目中所有的定时任务
		cronTabs: [],
		envId:1,
	},
	// 全局的计算属性(由一个或者多个全局数据技术而来的)
	getters: {
		// 项目接口
		inters1(state){
			return state.interfaces.filter( (item) =>{
				return item.type==='1'
			})
		},
		// 外部接口
		inters2(state){
			return state.interfaces.filter( (item) =>{
				return item.type==='2'
			})
		}
	},
	// 用来修改全局数据的方法
	mutations: {
		
		// 往tags中添加数据的方法
		addTags(state, item) {
			// 添加之前,做去重处理
			const res = state.tags.find((i) => {
				return i.path === item.path
			})
			if (!res) {
				state.tags.push(item)
			}
		},
		// 删除tags中数据的方法
		popTags(state, item) {
			state.tags = state.tags.filter(i =>{
				return i.path !==item.path
			})
		},
		// 选中的环境
		selectEnv(state, value) {
			state.envId = value
		},
		savePro(state,value){
			state.pro =value
		},
		// 保存接口数据数据到state中
		saveInterface(state,value){
			state.interfaces =value
		},
		updateTestScents(state,value){
			state.testScents = value
		},
		updateTestPlans(state,value){
			state.testPlans = value
		},
		updateTestEnvs(state,value){
			state.testEnvs = value
		},
		updatecronTabs(state,value){
			state.cronTabs = value
		},
	},
	// 定义全局的异步方法(涉及到后端接口请求的方法)
	actions: {
		async getAllInterFaces(content){
			// 获取项目下面所有的接口
			const response = await api.getInterfaces({project:content.state.pro.id})
			if(response.status===200){
				// 将获取到的接口数据保存到state中
				content.commit('saveInterface',response.data)
			}	
		},
		// 获取所有测试场景
		async getAllScent(context) {
			const response = await api.getTestScent({project:context.state.pro.id});
			if (response.status === 200) {
				context.commit('updateTestScents',response.data)
			
			}
		},
		// 获取所有测试环境
		async getAllEnvs(context) {
			const response = await api.getTestEnvs(context.state.pro.id);
			if (response.status === 200) {
				context.commit('updateTestEnvs',response.data)
			
			}
		},
		async getAllPlan(context) {
			const response = await api.getTestPlan(context.state.pro.id);
			if (response.status === 200) {
				context.commit('updateTestPlans',response.data)
			
			}
		},

	},
	// 模块（项目特别大时，对项目中全局的数据分模块进行管理）
	modules: {}
})
