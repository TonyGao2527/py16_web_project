<template>
	<el-row>
		<el-col :span="4">
			<div class="list_box">
				<el-tabs type="border-card" stretch>
					<el-button @click='$router.push({name:"interface"})' style="width: 100%;" plain type="success" icon="Link">接口管理</el-button>
					<el-tab-pane label="项目接口">
						<el-scrollbar height="calc(100vh - 142px)">
							<!-- 菜单组件 -->
							<el-menu  class="el-menu-vertical-demo">
								<el-sub-menu :index="iter.name + iter.id" v-for='iter in inters1'>
									<!-- 一级菜单：显示接口名 -->
									<template #title>
										<el-icon><Paperclip /></el-icon>
										<span>{{iter.name}}</span>
									</template>
									<!-- 二级菜单：显示接口下面的用例 -->
									<el-menu-item @click='selectCase(c_)' :index="c_.id.toString()" v-for='c_ in iter.steps'>
										<el-icon><Link /></el-icon>
										<span>{{c_.title}}</span>
									</el-menu-item>
					
									<el-menu-item @click='clickAdd(iter.id)' :index="iter.id+'a'">
										<span style="color: #ffaa00;">
											<el-icon><CirclePlus /></el-icon>
											<span>添加用例</span>
										</span>
									</el-menu-item>
									
								</el-sub-menu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>
					<el-tab-pane label="外部接口">
						<el-scrollbar height="calc(100vh - 142px)">
							<!-- 菜单组件 -->
							<el-menu default-active="2" class="el-menu-vertical-demo">
								<el-sub-menu :index="iter.name + iter.id" v-for='iter in inters2'>
									<!-- 一级菜单：显示接口名 -->
									<template #title>
										<el-icon><Paperclip /></el-icon>
										<span>{{iter.name}}</span>
									</template>
									<!-- 二级菜单：显示接口下面的用例 -->
									<el-menu-item @click='selectCase(c_)' :index="c_.id.toString()" v-for='c_ in iter.steps'>
										<el-icon><Link /></el-icon>
										<span>{{c_.title}}</span>
									</el-menu-item>
											
									<el-menu-item @click='clickAdd(iter.id)' :index="iter.id+'a'">
										<span style="color: #ffaa00;">
											<el-icon><CirclePlus /></el-icon>
											<span>添加用例</span>
										</span>
									</el-menu-item>
									
								</el-sub-menu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-col>
		
		<!--用例编辑 -->
		<el-col :span="20">
			<el-scrollbar height="calc(100vh - 68px)">
				<CaseEdit :edit-case='editCase'></CaseEdit>
			</el-scrollbar>
			
		</el-col>
	</el-row>
	
	<!-- 添加用例的弹框 -->
	<el-dialog v-model="addDlg" title="添加接口" width="40%">
		<el-form :model="addCaseForm">
			<el-form-item label="用例名称"><el-input v-model="addCaseForm.title" autocomplete="off" /></el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDlg = false" size="small">取消</el-button>
				<el-button type="success" @click="addCase" size="small">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
import CaseEdit from '../components/CaseEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	data() {
		return {
			editCase:'',
			name:'',
			addDlg: false,
			addCaseForm: {
				title: ''
			}
		};
	},
	components:{
		CaseEdit
	},
	computed: {
		...mapGetters(['inters1', 'inters2'])
	},
	methods:{
		...mapActions(['getAllInterFaces']),
		selectCase(case_){
			this.editCase = case_
		},
		// 点击添加用例
		clickAdd(interId) {
			this.addDlg = true;
			this.addCaseForm.interface = interId;
			this.addCaseForm.title = '';
		},
		async addCase() {
			const response = await this.$api.createTeststep(this.addCaseForm);
			if (response.status === 201) {
				this.addDlg = false;
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				this.getAllInterFaces();
			}
		}
	}
};
</script>

<style scoped>
.list_box {
	height: calc(100vh - 68px);

	box-shadow: 0 0 5px #00aa7f;
}



</style>
