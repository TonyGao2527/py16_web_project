<template>
	<!-- 显示用户信息的盒子 -->
	<div class="user_box">
		<!-- logo图片 -->
		<img src="../assets/images/logo2.png" width="45" />
		<!-- 用户信息 -->
		<div class="info">
			<el-icon><User /></el-icon>
			<el-dropdown>
				<!-- 下拉菜单显示的标题 -->
				<span class="el-dropdown-link">
					{{ username }}
					<el-icon class="el-icon--right"><arrow-down /></el-icon>
				</span>
				<!-- 下拉显示的菜单项 -->
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="$router.push({ name: 'allpro' })">选择项目</el-dropdown-item>
						<el-dropdown-item @click="logout">注销登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
	<!-- 菜单列表 -->

	<el-menu :default-active="$route.path" router text-color="#fff" active-text-color="#ffd04b" background-color="#00aa7f" class="el-menu-vertical-demo">
		<el-menu-item index="/project/index">
			<el-icon><HomeFilled /></el-icon>
			<span>项目首页</span>
		</el-menu-item>
		<el-menu-item index="/project/interface">
			<el-icon><Paperclip /></el-icon>
			<span>接口管理</span>
		</el-menu-item>
		<el-menu-item index="/project/test">
			<el-icon><Connection /></el-icon>
			<span>接口测试</span>
		</el-menu-item>
		<el-menu-item index="/testscent">
			<el-icon><HelpFilled /></el-icon>
			<span>测试场景</span>
		</el-menu-item>
		<el-menu-item index="/testplan">
			<el-icon><CollectionTag /></el-icon>
			<span>测试计划</span>
		</el-menu-item>
		<el-menu-item index="/testenv">
			<el-icon><Coin /></el-icon>
			<span>测试环境</span>
		</el-menu-item>
		<el-menu-item index="/crontab">
			<el-icon><Clock /></el-icon>
			<span>定时任务</span>
		</el-menu-item>
		<el-menu-item index="/bugs">
			<el-icon><Lightning /></el-icon>
			<span>bug管理</span>
		</el-menu-item>
		<el-menu-item index="/records">
			<el-icon><Histogram /></el-icon>
			<span>测试报表</span>
		</el-menu-item>
	</el-menu>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	methods: {
		// 注销登录
		logout() {
			ElMessageBox.confirm('确定要退出登录?', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					// 点击确认按钮执行的代码
					// 删除登录成功保存的用户信息
					window.sessionStorage.removeItem('username');
					window.sessionStorage.removeItem('token');
					// 跳转到登录页面
					this.$router.push({ name: 'login' });
					ElMessage({
						type: 'success',
						message: '成功退出登录',
						duration: 1000
					});
				})
				.catch(() => {
					// 点击取消按钮执行的代码
					ElMessage({
						type: 'info',
						message: '已取消退出登录的操作',
						duration: 1000
					});
				});
		}
	},
	computed: {
		username() {
			return window.sessionStorage.getItem('username');
		}
	}
};
</script>

<style scoped>
.user_box {
	height: 62px;
	border-bottom: solid 1px #fff;
	display: flex;
	align-items: center;
}
.user_box img {
	padding: 10px 40px 10px 10px;
}
.info {
	flex: 1;
	line-height: 62px;
	color: #fff;
}
.user_box .el-dropdown-link {
	cursor: pointer;
	color: #fff;

	line-height: 62px;
}
</style>
