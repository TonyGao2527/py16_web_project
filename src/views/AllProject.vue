<template>
	<!-- 项目列表页面 -->
	<div class="pros_box">
		<!-- 页面顶部区域 -->
		<div class="top_box">
			<span>项目列表</span>
			<el-button @click="logout" type="success" icon="UserFilled">注销登录</el-button>
			<el-button @click="addDlg = true" type="success" icon="CirclePlus">添加项目</el-button>
		</div>
		<!-- 显示项目列表的区域 -->
		<div class="pro_list">
			<el-card class="pro" v-for="item in project_list" :key="item.id">
				<div @click="selectPro(item)" style="cursor: pointer;">
					<!-- 项目里面的图标 -->
					<div class="pro-icon">
						<el-icon><Platform /></el-icon>
					</div>
					<!-- 项目名称 -->
					<div class="pro_name">
						<!-- 判断项目名称的长度，是否少于8个字符 -->
						<span v-if="item.name.length < 8">{{ item.name }}</span>
						<!-- 项目名称显示前八个字，鼠标悬浮时显示完整名称 -->
						<el-tooltip v-else class="box-item" effect="dark" :content="item.name" placement="top">
							<span>{{ item.name.slice(0, 8) }}...</span>
						</el-tooltip>
					</div>
					<!-- 项目负责人 -->
					<div class="leader">负责人：{{ item.leader }}</div>
				</div>

				<!-- 按钮区域 -->
				<div class="btns">
					<el-tag @click="clickEdit(item)" class="ml-2" type="info" color="#efefef" style="float: left;">
						<el-icon><Edit /></el-icon>
						<span>编 辑</span>
					</el-tag>
					<el-tag @click="delPro(item.id)" class="ml-2" type="info" style="float: right;">
						<el-icon><Delete /></el-icon>
						<span>删 除</span>
					</el-tag>
				</div>
			</el-card>
			<!-- 添加项目的卡片 -->
			<el-card @click="addDlg = true" class="pro" style="text-align: center; line-height: 250px;color: #d0d0d0;cursor: pointer;">
				<el-icon :size="50"><Plus /></el-icon>
			</el-card>
		</div>
	</div>

	<!-- 添加项目的弹框 -->
	<el-dialog v-model="addDlg" title="添加项目">
		<el-form :model="addForm">
			<el-form-item label="项目名称"><el-input v-model="addForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="负责人"><el-input v-model="addForm.leader" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDlg = false">取消</el-button>
				<el-button type="primary" @click="clickAddPro">确认</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- 修改项目的窗口 -->
	<el-dialog v-model="editDlg" title="修改项目信息">
		<el-form :model="editForm">
			<el-form-item label="项目名称"><el-input v-model="editForm.name" autocomplete="off" /></el-form-item>
			<el-form-item label="负责人"><el-input v-model="editForm.leader" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="editDlg = false">取消</el-button>
				<el-button type="primary" @click="editPro">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	data() {
		return {
			// 项目列表信息
			project_list: [],
			// 控制添加窗口显示
			addDlg: false,
			// 添加窗口的数据
			addForm: {
				name: '',
				leader: ''
			},
			// 编辑窗口
			editDlg: false,
			// 编辑窗口的数据
			editForm: {
				name: '',
				leader: ''
			}
		};
	},
	methods: {
		// 通过接口获取索引的项目信息
		async getAllProject() {
			const response = await this.$api.getProjects();
			if (response.status === 200) {
				this.project_list = response.data;
			}
		},
		selectPro(pro) {
			// 将选择的项目信息，保存到vuex中
			this.$store.commit('savePro', pro);
			this.$router.push({ name: 'project' });
		},
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
		},
		// 添加项目(点击确认按钮)
		async clickAddPro() {
			// 发送请求到后端添加项目
			const response = await this.$api.createProject(this.addForm);
			if (response.status === 201) {
				ElMessage({
					type: 'success',
					message: '项目添加成功',
					duration: 1000
				});
				this.addDlg = false;
				// 重新发送请求获取后端数据库中所以的项目信息
				this.getAllProject();
			}
		},
		// 点击删除项目
		delPro(id) {
			ElMessageBox.confirm('此删除操作不可恢复，是否继续?', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.deleteProject(id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						// 更新页面数据
						this.getAllProject();
					}
				})
				.catch(() => {
					// 点击取消按钮执行的代码
					ElMessage({
						type: 'info',
						message: '已取消操作',
						duration: 1000
					});
				});
		},
		// 点击编辑按钮
		clickEdit(item) {
			this.editDlg = true;
			this.editForm = { ...item };
		},
		// 编辑项目(点击确认按钮)
		async editPro() {
			// 发送请求到后端，进行数据修改
			const response = await this.$api.updateProject(this.editForm.id, this.editForm);
			if (response.status === 200) {
				ElMessage({
					type: 'success',
					message: '修改成功',
					duration: 1000
				});
				// 关闭窗口
				this.editDlg = false;
				// 刷新数据
				this.getAllProject();
			}
		}
	},
	created() {
		this.getAllProject();
	}
};
</script>

<style scoped>
.pros_box {
	max-width: 1480px;
	margin: 20px auto;
}
/* 页面顶部内容 */
.top_box {
	border-bottom: solid 5px #42b983;
	height: 40px;
	font: bold 20px/40px 'microsoft yahei';
	color: #42b983;
}
/* 顶部两个按钮 */
.top_box .el-button {
	float: right;
	margin-left: 10px;
}

/* 项目列表区域样式 */
/* 项目框 */
.pro {
	width: 200px;
	height: 250px;
	float: left;
	margin: 20px;
}

/* 项目框中的图标 */
.pro .pro-icon {
	width: 60px;
	height: 60px;
	background: #d7f0e0;
	text-align: center;
	font: normal 30px/60px 'microsoft yahei';
	color: #42b983;
	border-radius: 30px;
	margin: 0 auto;
}
/* 项目框中的项目名称 */
.pro .pro_name {
	margin-top: 20px;
	font: bold 18px/40px 'microsoft yahei';
	text-align: center;
}
/* 项目负责人 */
.pro .leader {
	text-align: center;
	font: normal 14px/20px 'microsoft yahei';
	color: #ababab;
}
/* 项目按钮区域 */
.pro .btns {
	margin-top: 50px;
}

.pro .btns .el-tag {
	cursor: pointer;
}
</style>
