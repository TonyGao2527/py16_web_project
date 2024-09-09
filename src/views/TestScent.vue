<template>
	<el-row :gutter="10">
		<el-col :span="4">
			<div class="list_box">
				<!-- 标题 -->
				<div class="title">测试场景</div>
				<!-- 按钮 -->
				<el-button @click="addScent" icon="Plus" plain type="success" style="width: 100%;">添加测试场景</el-button>
				<!-- 场景列表 -->
				<el-menu :default-active="active" class="el-menu-vertical-demo" active-text-color="#00aa7f" text-color="#000000" style="background: none;border: none;">
					<el-menu-item @click="getScentData(item)" :index="item.id.toString()" v-for="item in testScents" style="height: 35px;line-height: 35px;">
						<el-icon><HelpFilled /></el-icon>
						<span>{{ item.name }}</span>
					</el-menu-item>
				</el-menu>
			</div>
		</el-col>

		<!--用例编辑 -->
		<el-col :span="20">
			<el-scrollbar height="calc(100vh - 68px)">
				<div class="scent-data-box" v-if="steps">
					<el-divider content-position="left"><b>场景信息</b></el-divider>
					<el-row :gutter="5" style="margin-bottom: 20px;">
						<el-col :span="12">
							<el-input v-model="scentInfo.name" size="small">
								<template #prepend>
									场景名称
								</template>
								<template #append>
									<el-button @click="saveScent" plain icon="CircleCheck" type="success">保存</el-button>
								</template>
							</el-input>
						</el-col>
						<el-col :span="12" style="text-align: right;">
							<el-button @click="runScent" plain type="success" icon="Promotion">运行</el-button>
							<el-button @click="deleteScent" plain icon="Delete" type="danger">删除</el-button>
						</el-col>
					</el-row>
					<el-divider content-position="left"><b>执行步骤</b></el-divider>
					<el-scrollbar height="calc(100vh - 210px)">
						<el-table :data="steps" row-key="id" style="width: 100%;margin-bottom: 10px;" :show-header="false">
							<el-table-column>
								<template #default="scope">
									<span class="el-icon-upload" style="color: #009A71;font-weight: bold;font-size: 14px;">{{ '步骤' + (scope.$index + 1) + ': ' }}</span>
									<span style="font-weight: bold;font-size: 14px;">{{ scope.row.stepInfo.title }}</span>
								</template>
							</el-table-column>
							<el-table-column width="200px">
								<template #default="scope">
									<el-button @click="clickEditStep(scope.row.stepInfo)" plain type="success" icon="Edit">编辑</el-button>
									<el-button @click="clickDelete(scope.row.id)" plain type="danger" icon="Delete">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button @click="addStepDlg = true" plain icon="Plus" type="success">新增步骤</el-button>
					</el-scrollbar>
				</div>
			</el-scrollbar>
		</el-col>
	</el-row>

	<!-- 显示运行结果 -->
	<el-drawer v-model="ResultDlg" :with-header="false" size="60%">
		<div style="padding:20px;">
			<el-descriptions title="执行结果" border :column="4">
				<el-descriptions-item label="总数">{{ runScentResult.all }}</el-descriptions-item>
				<el-descriptions-item label="通过">{{ runScentResult.success }}</el-descriptions-item>
				<el-descriptions-item label="失败">{{ runScentResult.fail }}</el-descriptions-item>
				<el-descriptions-item label="错误">{{ runScentResult.error }}</el-descriptions-item>
			</el-descriptions>
			<div style="height: 40px;line-height: 40px;"><b>执行详情</b></div>
			<el-scrollbar height="calc(100vh - 180px)">
				<el-table :data="runScentResult.cases" style="width: 100%">
					<el-table-column type="expand">
						<template #default="props">
							<caseResult :result="props.row"></caseResult>
						</template>
					</el-table-column>
					<el-table-column label="用例名" prop="name" />
					<el-table-column label="请求方法" prop="method" />
					<el-table-column label="响应状态码" prop="status_cede" />
					<el-table-column label="执行结果" prop="state" min-width="40px">
						<template #default="props">
							<span v-if="props.row.state == '成功'" style="color: #00AA7F;">成功</span>
							<span v-else style="color:#F56C6C">{{ props.row.state }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>
		</div>
	</el-drawer>
	<!-- 编辑用例的窗口 -->
	<el-drawer v-model="editStepDlg" :with-header="false" size="65%"><EditCase :editCase="editCase" style="padding: 0 10px; min-height: 500px;"></EditCase></el-drawer>
	<!-- 添加测试步骤窗口 -->
	<el-drawer v-model="addStepDlg" :with-header="false">
		<template #default>
			<el-tabs stretch>
				<el-tab-pane label="内部接口">
					<el-tree ref="treeM1" :data="inters1" show-checkbox :props="addTreeProps" node-key="id" default-expand-all highlight-current>
						<template #default="{ node, data }">
							<span class="custom-tree-node">
								<div v-if="data.name">
									<b style="color:#00AA7F ;">
										<el-icon><Paperclip /></el-icon>
										<span>{{ data.name }}</span>
									</b>
								</div>
								<div v-if="data.title">
									<b style="color:#00AA7F ;">
										<el-icon><Link /></el-icon>

										<span>用例</span>
									</b>
									<span>: {{ data.title }}</span>
								</div>
							</span>
						</template>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="外部接口" name="second">
					<el-tree ref="treeM2" :data="inters2" show-checkbox :props="addTreeProps" node-key="id" default-expand-all :expand-on-click-node="false">
						<template #default="{ node, data }">
							<span class="custom-tree-node">
								<div v-if="data.name">
									<b style="color:#00AA7F ;">
										<el-icon><Paperclip /></el-icon>
										<span>{{ data.name }}</span>
									</b>
								</div>
								<div v-if="data.title">
									<b style="color:#00AA7F ;">
										<el-icon><Link /></el-icon>

										<span>用例</span>
									</b>
									<span>: {{ data.title }}</span>
								</div>
							</span>
						</template>
					</el-tree>
				</el-tab-pane>
			</el-tabs>
			<el-affix position="bottom" :offset="40">
				<div class="add-btns" style="text-align: center;">
					<el-tooltip class="item" effect="dark" content="将选择的用例,加入到测试场景中" placement="top-start">
						<el-button plain type="success" size="small" @click="addToScent('add')">确认添加</el-button>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="关闭当前窗口" placement="top-start">
						<el-button plain type="danger" size="small" @click="addStepDlg = false">关闭窗口</el-button>
					</el-tooltip>
				</div>
			</el-affix>
		</template>
	</el-drawer>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { ElNotification } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import Sortable from 'sortablejs';
import EditCase from '../components/CaseEdit.vue';
import caseResult from '../components/caseResult.vue';
export default {
	components: {
		EditCase,
		caseResult
	},
	data() {
		return {
			active: '1',
			// 当前选中的测试场景
			scentInfo: null,
			// 测试场景中的测试步骤列表
			steps: null,
			// 添加步骤到测试套件
			addStepDlg: false,
			// 树形数据子元素的字段
			addTreeProps: {
				children: 'steps'
			},
			// 编辑用例的窗口显示
			editStepDlg: false,
			//编辑用例
			editCase: null,
			// 运行结果
			runScentResult: null,
			// 是否显示运行结果
			ResultDlg: false
		};
	},
	computed: {
		...mapState(['pro', 'testScents', 'envId']),
		...mapGetters(['inters1', 'inters2'])
	},
	methods: {
		...mapActions(['getAllScent', 'getAllInterFaces']),
		// 添加测试场景
		async addScent() {
			const params = {
				name: 'New Scent',
				project: this.pro.id
			};
			const response = await this.$api.createTestScent(params);
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				this.getAllScent();
			}
		},
		// 删除测试场景
		async deleteScent() {
			ElMessageBox.confirm('确定要删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.delTestScent(this.scentInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						this.getAllScent();
					}
				})
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '取消删除',
						duration: 1000
					});
				});
		},
		// 编辑场景名保存
		async saveScent() {
			const response = await this.$api.updateTestScent(this.scentInfo.id, this.scentInfo);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '保存成功',
					duration: 1000
				});
			}
			this.getAllScent();
		},
		// 运行测试场景
		async runScent() {
			if (this.envId) {
				const params = {
					env: this.envId,
					scent: this.scentInfo.id
				};
				this.$message({
					type: 'success',
					message: '开始运行!',
					duration: 1000
				});
				const response = await this.$api.runTest(params);
				console.log(response.data);
				if (response.status == 200) {
					// 显示执行结果到窗口页面
					this.runScentResult = response.data;
					this.ResultDlg = true;
				}
			} else {
				this.$message({
					type: 'warning',
					message: '当前未选中测试环境!',
					duration: 1000
				});
			}
		},
		// 点击编辑用例
		clickEditStep(editCase) {
			this.editStepDlg = true;
			this.editCase = editCase;
		},
		// 获取树形控件中被选中的用例
		getcheckedCase() {
			const Nodes1 = this.$refs.treeM1.getCheckedNodes();
			const Nodes2 = this.$refs.treeM2.getCheckedNodes();
			const Nodes = [...Nodes1, ...Nodes2];
			// 过滤出选中的用例
			const result = Nodes.filter(function(item, index) {
				return item.title;
			});
			return result;
		},
		// 获取测试场景下所有的测试步骤
		async getScentData(scent) {
			this.scentInfo = { ...scent };
			const response = await this.$api.getScentDatas(scent.id);
			if (response.status === 200) {
				this.steps = response.data;
			}
		},
		// 删除测试场景中的数据
		async clickDelete(id) {
			const response = await this.$api.delScentData(id);
			if (response.status === 204) {
				this.$message({
					type: 'success',
					message: '删除成功',
					duration: 1000
				});
				this.getScentData(this.scentInfo);
			}
		},
		// 往测试场景中添加用例数据
		async addToScent() {
			this.checkedCase = this.getcheckedCase();
			let order_s = this.steps.length;
			for (let value of this.checkedCase) {
				let item = { ...value };
				order_s += 1;
				const response = await this.$api.addScentData({ step: item.id, scent: this.scentInfo.id, sort: order_s });
				if (response.status === 201) {
					ElNotification({
						type: 'success',
						title: '成功',
						message: `用例-${item.title}-添加成功`,
						duration: 2000
					});
				} else {
					ElNotification({
						title: '失败',
						message: `用例-${item.title}-添加失败`,
						type: 'warning',
						duration: 2000
					});
				}
			}
			this.getScentData(this.scentInfo);
			this.getAllInterFaces();
		},
		// 拖动套件中的用例顺序
		initSort() {
			// 选择表格
			const tbody = document.querySelector('.scent-data-box .el-table__body-wrapper tbody');
			const _this = this;
			Sortable.create(tbody, {
				onEnd(evt) {
					// 从数组中根据原来位置的索引将数据删除
					const currRow = _this.steps.splice(evt.oldIndex, 1)[0];
					// 将数据放入到新索引的位置
					_this.steps.splice(evt.newIndex, 0, currRow);
					// 修改后端用例数据的顺序
					_this.updateScentOrder();
				}
			});
		},
		// 修改后端套件内用例顺序
		async updateScentOrder() {
			// 修改caseList中的order字段
			this.steps.forEach((item, index, array) => {
				item.sort = index + 1;
			});
			// 发送请求后端修改测试场景中用例执行的顺序
			const response = await this.$api.updateScentDataOrder(this.steps);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '调整排序成功',
					duration: 500
				});
			}
		}
	},

	async created() {
		await this.getAllScent();
		if (this.testScents.length > 0) {
			// 设置默认显示激活的测试场景
			this.active = this.testScents[0].id.toString();
			this.scentInfo = { ...this.testScents[0] };
			await this.getScentData(this.scentInfo);
			// 初始化可拖动的表格
			this.initSort();
		}
	}
};
</script>

<style scoped>
.list_box {
	height: calc(100vh - 68px);
	box-shadow: 0 0 5px #00aa7f;
}
.list_box .title {
	text-align: center;
	font: bold 20px/40px 'microsoft yahei';
	border-bottom: solid 4px #b3b3b3;
}
</style>
