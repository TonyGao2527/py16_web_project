<template>
	<!-- 测试报表页面 -->
	<div class="chart_box" ref="chart1"></div>

	<el-table :data="recordList" style="width: 100%" height="calc(100vh - 320px)">
		<el-table-column label="执行时间">
			<template #default="scope">
				{{ $date.rTime(scope.row.create_time) }}
			</template>
		</el-table-column>
		<el-table-column label="测试计划" prop="plan_name"></el-table-column>
		<el-table-column label="执行环境" prop="env_name"></el-table-column>
		<el-table-column label="通过" prop="success"></el-table-column>
		<el-table-column label="失败" prop="fail"></el-table-column>
		<el-table-column label="通过率" prop="pass_rate"></el-table-column>
		<el-table-column label="查看报告" width="100">
			<template #default="scope">
				<el-button @click="$router.push({ name: 'report', params: { id: scope.row.id } })" size="small" type="success" plain>测试报告</el-button>
			</template>
		</el-table-column>
	</el-table>
	
	<!--分页器使用的演示 -->
	 <el-pagination
	      v-model:currentPage="page"
	      v-model:page-size="size"
	      :page-sizes="[10, 20, 50, 100]"
	      layout="total, sizes, prev, pager, next, jumper"  
	      :total="count"
	      @size-change="updateData"
	      @current-change="updateData"
	    />

</template>

<script>
export default {
	data() {
		return {
			recordList: [],
			count:900,
			page:1,
			size:10
		};
	},

	methods: {
		async updateData(){
			// 当页面或者每页显示的数量发生变化时，执行该方法发生请求，刷新页面数据
			const params = {
				page:this.page,
				size:this.size
			}
			// 发生请求，获取数据
			// 获取完数据之后，将数据更新到页面上
			// 要显示的数据列表，赋值给 recordList
			// 数据总数：赋值给 count	
		},
		async getProjectrecords() {
			const response = await this.$api.getTestRecord({
				project: this.$store.state.pro.id,
			});
			if (response.status === 200) {
				this.recordList = response.data;
			}
		},
		showChart() {
			const ele = this.$refs.chart1;
			this.$chart.chart3(ele, this.chartData.value, this.chartData.lable);
		}
	},
	computed: {
		chartData() {
			let lable = [];
			let value = [];
			this.recordList.forEach(item => {
				lable.push(this.$date.rTime(item.create_time));
				value.push(item.pass_rate);
			});
			return {
				lable: lable,
				value: value
			};
		}
	},
	created() {
		this.getProjectrecords();
	},
	mounted() {
		this.showChart();
	},
	watch: {
		recordList(value) {
			if (value.length > 1) {
				this.showChart();
			}
		}
	}
};
</script>

<style scoped>
.chart_box {
	height: 250px;
	background: #f8f8f8;
}
</style>
