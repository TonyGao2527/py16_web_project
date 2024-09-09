<template>
	<!-- 登录页面 -->
	<LoginBack>
		<div class="login_box">
			<!--登录的标题  -->
			<div class="title"><img src="../assets/images/log.png" /></div>
			<!-- 登录的表单输入框 -->
			<el-form :model="loginForm" :rules="loginRules" ref='loginRef'>
				<!-- 账户输入框 -->
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="请输入账号">
						<template #prefix>
							<el-icon :size="24" color="#fff"><User /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				<!-- 密码输入框 -->
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
						<template #prefix>
							<el-icon :size="24" color="#fff"><Lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				<!-- 记住账户的开关 -->
				<el-form-item label="记住用户"><el-switch style="--el-switch-on-color: #0071a5; --el-switch-off-color: #e3e3e3" v-model="loginForm.status" /></el-form-item>
				<!-- 登录的按钮 -->
				<el-form-item><el-button color="#0071a6" type="primary" @click="clickLogin" style="width: 100%;">登 录</el-button></el-form-item>
			</el-form>
		</div>
	</LoginBack>
</template>

<script type="text/javascript">
import LoginBack from '../components/LoginBack.vue';
import { ElMessage } from 'element-plus';
export default {
	components: {
		LoginBack
	},
	data() {
		return {
			// 登录表单数据
			loginForm: {
				username: '',
				password: '',
				status: false
			},
			// 登录数据的校验规则
			loginRules:{
				username:[
					{ required: true, message: '账号不能为空', trigger: 'blur' },
				],
				password:[
					{ required: true, message: '密码不能为空', trigger: 'blur' },
				]
			}
		};
	},
	methods: {
		// 点击登录的方法
		clickLogin() {
			// 获取登录的表单对象
			this.$refs['loginRef'].validate((res) =>{
				if(res){
					// 调用后端登录的结果
					this.loginRequest()
				}
			})
		},
		async loginRequest(){
			// 调用登录接口，发送请求进行登录
			const response = await this.$api.loginApi(this.loginForm);
			if (response.status === 200) {
				// 提取token和用户名保存起来
				window.sessionStorage.setItem('token',response.data.token)
				window.sessionStorage.setItem('username',response.data.username)
				// 判断是否选中记住账号密码
				if(this.loginForm.status){
					// 勾选记住账号
					const userInfo = JSON.stringify(this.loginForm)
					window.localStorage.setItem('userInfo',userInfo)
				}
				// 路由跳转
				this.$router.push({ name: 'allpro' });
				// 提示登录成功
				ElMessage({
					message: '登录成功',
					type: 'success'
				});
			} 
		}
	},
	created() {
		const userInfo = window.localStorage.getItem('userInfo')
		if(userInfo){
			this.loginForm = JSON.parse(userInfo)
		}
	}
};
</script>

<style scoped>
.login_box {
	width: 500px;
	height: 400px;
	margin: calc((100vh - 400px) / 2) auto;
}
.title {
	text-align: center;
	padding-bottom: 30px;
}
</style>
