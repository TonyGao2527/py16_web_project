import axios from 'axios';
import {
	ElMessage
} from 'element-plus';
import router from '../router/index.js'
// const baseURL = 'http://121.4.107.148:18899' 
const baseURL = 'http://42.192.110.51:18899'

// http的请求实例对象
const http = axios.create({
	baseURL: baseURL,
	validateStatus: function(status) {
		return true;
	},
});

// 通过axios的请求拦截器，处理后端接口请求的权限问题
// 添加请求拦截器
http.interceptors.request.use(function(config) {
	if (config.url !== '/login/') {
		const token = window.sessionStorage.getItem('token')
		if (token) {
			config.headers['Authorization'] = 'JWT ' + token
		}
	}
	return config;
});
// 200  201   204

// 添加响应拦截器
http.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	// 判断操作是否成功(成功直接返回response,不做任何处理)
	if (response.status === 200 || response.status === 201 || response.status === 204) return response;
	if (response.status === 401) {
		// 没有token权限(登录失败),跳转到登录页面
		window.localStorage.removeItem('token')
		router.push({
			name: "login"
		})
	} else if (response.status === 400) {
		// 请求参数有误，给出错误提示
		console.log(response)
		// 判断是否时登录请求
		if (response.config.url === "/login/") {
			ElMessage({
				message: response.data.non_field_errors,
				type: 'success'
			});
		} else {
			const body = response.data
			// 如果不是登录请求，那就是请求的请求参数有问题,可能会有多个字段的提示信息
			for (let i in body) {
				ElMessage({
					message: body[i],
					type: 'success'
				});
			}
		}
	} else {
		ElMessage({
			message: response.data.detail,
			type: 'success'
		});
	}
});





// 导出封装的所有后端api请求
export default {



	// 登录api
	loginApi(params) {
		return http.post('/login/', params)
	},
	// --------------项目相关的api-----------------
	// 获取项目列表
	getProjects() {
		return http.get('/projects/')
	},
	// 添加项目
	createProject(params) {
		return http.post('/projects/', params)
	},
	// 修改项目
	updateProject(id, params) {
		return http.patch(`/projects/${id}/`, params)
	},
	// 删除项目
	deleteProject(id) {
		// return http.delete('/projects/' + id + '/')
		return http.delete(`/projects/${id}/`)
	},
	// 获取单个项目详细信息
	getProjectInfo(id) {
		return http.get(`/projects/${id}/`)
	},
	// -------------项目接口相关的api-----------------------
	getInterfaces(params) {
		return http.get('/interface/', {
			params: params
		})
	},
	// 删除接口
	delInterface(id) {
		return http.delete(`/interface/${id}/`)
	},
	// 添加接口
	createInterface(params) {
		return http.post('/interface/', params)
	},
	// 修改接口
	updateInterface(id, params) {
		return http.patch(`/interface/${id}/`, params)
	},
	// ------------测试用例相关的接口------------------------
	// 获取单个用例的详细信息
	getCaseInfo(id) {
		return http.get(`/teststep/${id}/`)
	},
	// 删除测试用例
	delTeststep(id) {
		return http.delete(`/teststep/${id}/`)
	},
	// 创建测试用例
	createTeststep(params) {
		return http.post('/teststep/', params)
	},
	// 修改测试用例
	updateTeststep(id, params) {
		return http.patch(`/teststep/${id}/`, params)
	},
	// ============测试场景相关的接口====================
	// 获取项目所有测试场景
	getTestScent(params) {
		return http.get(`/testscent/`, {
			params: params
		})
	},
	// 获取单个测试场景下的详细数据
	getScentInfo(scren_id) {
		return http.get(`/testscent/${scren_id}/`)
	},
	// 删除测试场景
	delTestScent(id) {
		return http.delete(`/testscent/${id}/`)
	},
	// 添加测试场景
	createTestScent(params) {
		return http.post('/testscent/', params)
	},
	// 修改测试场景
	updateTestScent(id, params) {
		return http.patch(`/testscent/${id}/`, params)
	},
	// ==============测试场景中的数据==================
	// 修改测试场景中的执行步骤顺序
	updateScentDataOrder(params) {
		return http.put('/testscent/order', params)
	},
	// 获取测试场景数据
	getScentDatas(scentId) {
		return http.get(`/scentdata/`, {
			params: {
				scent: scentId
			}
		})
	},

	// 添加步骤到测试场景中
	addScentData(params) {
		return http.post('/scentdata/', params)
	},
	// 删除测试场景中的步骤 
	delScentData(id) {
		return http.delete(`/scentdata/${id}/`)
	},

	// ============测试计划相关的接口====================
	// 获取项目所有测试计划
	getTestPlan(project_id) {
		return http.get(`/testplan/`, {
			params: {
				project: project_id
			}
		})
	},
	// 删除测试计划
	delTestPlan(id) {
		return http.delete(`/testplan/${id}/`)
	},
	// 添加测试计划
	createTestPlan(params) {
		return http.post('/testplan/', params)
	},
	// 修改测试计划
	updateTestPlan(id, params) {
		return http.patch(`/testplan/${id}/`, params)
	},

	// -----------------环境相关的api--------------------
	// 获取项目所有测试环境
	getTestEnvs(project_id) {
		return http.get(`/testenvs/`, {
			params: {
				project: project_id
			}
		})
	},
	getEnvInfo(id) {
		return http.get(`/testenvs/${id}/`)
	},
	// 删除测试环境
	delTestEnvs(id) {
		return http.delete(`/testenvs/${id}/`)
	},
	// 添加测试环境
	createTestEnvs(params) {
		return http.post('/testenvs/', params)
	},
	// 修改测试环境
	updateTestEnvs(id, params) {
		return http.patch(`/testenvs/${id}/`, params)
	},
	// ==========================定时任务接口================
	// 获取所有定时任务
	getCrons(project_id) {
		return http.get(`/cron/`, {
			params: {
				project: project_id
			}
		})
	},
	// 删除定时任务
	delCron(id) {
		return http.delete(`/cron/${id}/`)
	},
	// 添加定时任务
	createCron(params) {
		return http.post('/cron/', params)
	},
	// 修改定时任务
	updateCron(id, params) {
		return http.patch(`/cron/${id}/`, params)
	},


	// ===================测试记录==========================
	// 获取所有的测试记录
	getTestRecord(params) {
		return http.get(`/record/`, {
			params: params
		})
	},
	getRecordInfo(id) {
		return http.get(`/record/${id}/`)
	},
	// 获取测试报告信息
	getTestReport(id) {
		return http.get(`/report/${id}/`)
	},
	//=====================bug管理======================
	// 获取所有bug
	getBugs(params) {
		return http.get('/bugs/', {
			params: params
		})
	},
	// 添加bug记录
	createBugs(params) {
		return http.post('/bugs/', params)
	},
	// 修改bug记录
	updateBug(id, params) {
		return http.patch(`/bugs/${id}/`, params)
	},
	// 删除bug
	deleteBug(id) {
		return http.delete(`/bugs/${id}/`)
	},
	//=====================获取bug处理记录列表======================
	getBugLogs(params) {
		return http.get('/blog/', {
			params: params
		})
	},


	// =================用例运行===========================
	// 运行测试的接口
	runTest(params) {
		/*
		:param env: 测试环境ID,必填项 
		
		:param plan: 测试计划id 
		:param scent: 测试场景id 
		:param data: 测试数据(运行单条用例时使用) 
		*/
		return http.post('/runTest/', params)
	},



	// ================文件上传操作========================
	// 上传文件
	uploadFile: {
		url: baseURL + "/upload/file/",
		headers: {
			Authorization: 'JWT ' + window.sessionStorage.getItem('token')
		}
	},
	// 获取文件列表
	getFiles() {
		return http.get('/upload/file/')
	},
	// 删除文件
	deleteFile(id) {
		return http.delete('/upload/file/{id}/')
	}

}
