<template>
	<el-row :gutter="10" style="height:calc(100vh - 68px);">
		<el-col :span="4">
			<div class="list_box">
				<!-- 标题 -->
				<div class="title">测试计划</div>
				<!-- 按钮 -->
				<el-button @click="addPlan" icon="Plus" plain type="success" style="width: 100%;">添加测试计划</el-button>
				<!-- 场景列表 -->
				<el-menu :default-active="active" class="el-menu-vertical-demo" active-text-color="#00aa7f" text-color="#000000" style="background: none;border: none;">
					<el-menu-item @click="getPlanData(item)" :index="item.id.toString()" v-for="item in planList" style="height: 35px;line-height: 35px;">
						<el-icon><CollectionTag /></el-icon>
						<span>{{ item.name }}</span>
					</el-menu-item>
				</el-menu>
			</div>
		</el-col>

		<!--用例编辑 -->
		<el-col :span="10" v-if="planInfo">
			<!-- 基本信息 -->
			<el-divider content-position="left"><b>基本信息</b></el-divider>
			<el-row :gutter="5" style="margin-bottom: 20px;">
				<el-col :span="16">
					<el-input v-model="planInfo.name" size="small">
						<template #prepend>
							场景名称
						</template>
						<template #append>
							<el-button @click="savePlan" plain icon="CircleCheck" size="small" type="success">保存</el-button>
						</template>
					</el-input>
				</el-col>
				<el-col :span="8" style="text-align: right;">
					<el-button @click="runPlan" plain size="small" type="success" icon="Promotion">运行</el-button>
					<el-button @click="delPlan" plain icon="Delete" size="small" type="danger">删除</el-button>
				</el-col>
			</el-row>
			<!-- 测试场景列表 -->
			<el-divider content-position="left"><b>测试场景</b></el-divider>
			<el-button @click="drawer = true" plain icon="Plus" size="small" type="success">添加</el-button>
			<el-table :data="scents" row-key="id" style="width: 100%;margin-bottom: 10px;" :show-header="false" height="calc(100vh - 235px)">
				<el-table-column>
					<template #default="scope">
						<span style="color: #009A71;font-weight: bold;font-size: 14px;">{{ '测试场景' + (scope.$index + 1) + ': ' }}</span>
						<span style="font-weight: bold;font-size: 14px;">{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px">
					<template #default="scope">
						<el-button @click="delPlanInScent(scope.$index)" plain size="small" type="danger" icon="Delete">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
		</el-col>
		<el-col :span="10">
			<el-divider content-position="left"><b>通过率趋势图</b></el-divider>
			<!-- 通过率趋势图 -->
			<div ref="chartTable" class="char_box1"></div>

			<el-divider content-position="left"><b>执行记录</b></el-divider>
			<!-- 执行记录 -->

			<el-table :data="records" class="table-style" size="small" height="calc(100vh - 380px)">
				<el-table-column prop="create_time" label="执行时间" min-width="140">
					<template #default="scope">
						{{ $date.rTime(scope.row.create_time) }}
					</template>
				</el-table-column>
				<el-table-column prop="env_name" label="测试环境" min-width="110"></el-table-column>
				<el-table-column prop="all" label="总用例" min-width="50">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.all }}</span>
					</template>
				</el-table-column>

				<el-table-column label="通过数" min-width="50">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.success }}</span>
					</template>
				</el-table-column>
				<el-table-column label="通过率" min-width="80">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.pass_rate + '%' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="测试报告" width="100">
					<template #default="scope">
						<span v-if="scope.row.statue === '执行中'">
							<el-tag>{{ scope.row.statue }}...</el-tag>
						</span>
						<el-button v-else type="success" icon="View" plain size="small" @click="$router.push({ name: 'report', params: { id: scope.row.id } })">报告</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-col>
	</el-row>

	<!-- 添加测试场景到测试计划中 -->
	<el-drawer v-model="drawer" direction="rtl" size="20%" :show-close="false">
		<template #header>
			<b style="color: #000000;">添加测试流程</b>
		</template>
		<div class="select_content">
			<el-table ref="addRef" @selection-change="selectTable" size="small" :data="Scents2" tooltip-effect="dark" style="width: 100%">
				<el-table-column type="selection" min-width="40"></el-table-column>
				<el-table-column prop="name" label="全选" min-width="120"></el-table-column>
			</el-table>
		</div>
		<div style="margin: 10px; text-align: center;">
			<el-tooltip class="item" effect="dark" content="添加选中测试流程到任务中" placement="top-start">
				<el-button @click="addScentToPlan" plain type="success" size="small">确认添加</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="清除选中选项" placement="top-start">
				<el-button plain type="warning" size="small" @click="$refs.addRef.clearSelection()">清除选中</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="关闭当前窗口" placement="top-start">
				<el-button plain type="danger" size="small" @click="drawer = false">关闭窗口</el-button>
			</el-tooltip>
		</div>
	</el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import { ElNotification } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
	data() {
		return {
			// 选中激活的测试计划id
			active: '1',
			// 测试计划列表
			planList: [],
			// 当前选中的测试计划信息
			planInfo: null,
			// 测试计划中的所有测试场景
			scents: [],
			// 测试计划中所有运行记录
			records: [],
			// 添加测试场景的弹框
			drawer: false,
			// 存储勾选要添加到计划中的测试场景
			addScentList: []
		}
	},
	computed: {
		...mapState(['pro', 'envId', 'testScents']),
		chartData: function() {
			let runDate = [];
			let passRate = [];

			for (let item of this.records) {
				runDate.push(this.$date.rTime(item.create_time));
				passRate.push(parseFloat(item.pass_rate).toFixed(2));
			}
			return {
				label: runDate.reverse(),
				value: passRate.reverse()
			}
		},
		// 可以添加到任务中的套件
		Scents2: function() {
			// 获取计划中没有添加的所有测试场景
			let newSuites = this.testScents.filter((item, index) => {
				return !this.scents.find(item2 => {
					return item2.id == item.id;
				});
			});
			return newSuites;
		}
	},
	methods: {
		// 获取所有测试计划
		async getAllPlan() {
			const response = await this.$api.getTestPlan(this.pro.id);
			if (response.status === 200) {
				this.planList = response.data;
				// 设置默认激活的测试计划,并获取数据
				if (this.planList.length > 0 && this.planInfo == null) {
					this.active = this.planList[0].id.toString();
					this.getPlanData(this.planList[0]);
				}
			}
		},
		// 获取测试计划下所有的测试场景
		async getPlanData(plan) {
			this.planInfo = { ...plan };
			// 获取测试计划下所有的测试场景
			const response = await this.$api.getTestScent({
				testplan: plan.id
			});
			if (response.status == 200) {
				this.scents = response.data;
			}
			this.getAllRecord();
		},
		// 获取测试计划所有的执行记录
		async getAllRecord() {
			const response2 = await this.$api.getTestRecord({ plan: this.planInfo.id });
			if (response2.status == 200) {
				this.records = response2.data;
			}
		},
		// 添加测试计划
		async addPlan() {
			const params = {
				project: this.pro.id,
				name: 'New Plan'
			};
			const response = await this.$api.createTestPlan(params);
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				this.getAllPlan();
			}
		},
		// 保存修改的测试计划名
		async savePlan() {
			const response = await this.$api.updateTestPlan(this.planInfo.id, this.planInfo);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '保存成功',
					duration: 1000
				});
				this.getAllPlan();
			}
		},
		// 运行测试计划
		async runPlan() {
			if (this.envId) {
				const params = {
					env: this.envId,
					plan: this.planInfo.id
				};
				this.$message({
					type: 'success',
					message: '开始运行!',
					duration: 1000
				});
				const response = await this.$api.runTest(params);
				if (response.status === 200) {
					ElNotification({
						title: '提示',
						message: response.data.statue,
						duration: 1000
					});
					this.getAllRecord();
				}
				console.log(response.data);
			} else {
				this.$message({
					type: 'warning',
					message: '当前未选中测试环境!',
					duration: 1000
				});
			}
		},
		// 删除测试计划
		delPlan() {
			ElMessageBox.confirm('确定要删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.delTestPlan(this.planInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						this.getAllPlan();
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
		selectTable(val) {
			// 将选中的测试场景id保存到addScentList中
			this.addScentList = []
			val.forEach(item => {
				this.addScentList.push(item.id);
			});
		},
		// 添加选中的测试场景到测试计划中
		async addScentToPlan() {
			let params = { ...this.planInfo };
			params.scent.push(...this.addScentList);
			// 发送请求
			const response = await this.$api.updateTestPlan(params.id, params);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				// 更新页面数据
				this.planInfo = response.data;
				this.getPlanData(this.planInfo);
			}
			// 清空选中的选项
			this.$refs.addRef.clearSelection();
		},
		// 删除测试计划中的测试场景
		async delPlanInScent(index) {
			let params = { ...this.planInfo };
			params.scent.splice(index, 1);
			const response = await this.$api.updateTestPlan(params.id, params);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '删除成功',
					duration: 1000
				});
				// 更新页面中当前任务的数据
				this.planInfo = response.data;
				this.getPlanData(this.planInfo);
			}
		}
	},
	created() {
		this.getAllPlan();
	},
	watch: {
		records(val) {
			if (val) {
				// 渲染通过率趋势图
				this.$chart.chart3(this.$refs.chartTable, this.chartData.value, this.chartData.label);
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
.list_box .title {
	text-align: center;
	font: bold 20px/40px 'microsoft yahei';
	border-bottom: solid 4px #b3b3b3;
}
/* 显示图标的框 */
.char_box1 {
	height: 200px;
}
</style>
