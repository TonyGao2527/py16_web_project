import {
	createRouter,
	createWebHashHistory
} from 'vue-router'


import store from '../store/index.js'
const routes = [{
		path: '/',
		name: 'home',
		redirect: "/login"
	},
	{
		path: '/login',
		name: 'login',
		component: () => import( /* webpackChunkName: "about" */ '../views/Login.vue')
	},

	// 项目列表页面
	{
		path: '/allProject',
		name: 'allpro',
		component: () => import( /* webpackChunkName: "about" */ '../views/AllProject.vue')
	},
	// 项目首页
	{
		path: '/project',
		name: 'project',
		redirect: "/project/index",
		component: () => import( /* webpackChunkName: "about" */ '../views/Project.vue'),
		children: [{
				meta: {
					'name': "项目首页"
				},
				path: "/project/index",
				name: "index",
				component: () => import( /* webpackChunkName: "about" */ '../views/ProjectIndex.vue')
			},
			{
				meta: {
					'name': "接口管理"
				},
				path: "/project/interface",
				name: "interface",
				component: () => import( /* webpackChunkName: "about" */ '../views/InterFace.vue')
			},
			{
				meta: {
					'name': "接口测试"
				},
				path: "/project/test",
				name: "test",
				component: () => import( /* webpackChunkName: "about" */ '../views/InterFaceTest.vue')
			},
			{
				path: '/testscent',
				name: 'testscent',
				component: () => import( /* webpackChunkName: "group-8" */ '../views/TestScent.vue'),
				meta: {
					name: "测试场景"
				}
			},
			{
				path: '/testplan',
				name: 'testplan',
				component: () => import( /* webpackChunkName: "group-5" */ '../views/TestPlan.vue'),
				meta: {
					name: "测试计划"
				}
			},
			{
				path: '/testenv',
				name: 'testenv',
				component: () => import( /* webpackChunkName: "group-4" */ '../views/TestEnv.vue'),
				meta: {
					name: "测试环境"
				}
			}, {
				path: '/crontab',
				name: 'crontab',
				component: () => import( /* webpackChunkName: "group-user" */ '../views/CronTab.vue'),
				meta: {
					name: "定时任务"
				}
			},
			{
				path: '/bugs',
				name: 'bug',
				component: () => import( /* webpackChunkName: "group-3" */ '../views/BugManage.vue'),
				meta: {
					name: "bug管理"
				}
			},
			{
				path: '/records',
				name: 'records',
				component: () => import( /* webpackChunkName: "group-2" */ '../views/Records.vue'),
				meta: {
					name: "测试报表"
				}
			},
			{
				path: '/report/:id',
				name: 'report',
				component: () => import( /* webpackChunkName: "group-2" */ '../views/Report.vue'),
				meta: {
					name: "测试报告"
				}
			},

		]

	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

// 设置路由导航守卫：控制前端路由访问的权限
router.beforeEach((to, from, next) => {
	// 对访问的历史路由进行存储(怎么存？存哪里？)
	// 将访问的路由添加到vuex中的tags里面
	// 只添加头meta属性的路径
	if (to.meta.name) {
		store.commit('addTags', to)
	}
	// 判断用户是否登录：
	const token = window.sessionStorage.getItem('token')
	if (token) {
		next()
	} else if (to.name === 'login') {
		next()
	} else {
		next({
			name: "login"
		})
	}
})







export default router
