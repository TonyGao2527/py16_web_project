<template>
	<el-tabs model-value="rb" style="min-height: 300px;width: 100%;" type="border-card" value="rb" size="small">
		<el-tab-pane label="响应体" name="rb">
			<div v-if="result.response_header">
				<div v-if="result.response_header['Content-Type'].search('application/json') != -1">
					<Editor :read-only="true" v-model="result.response_body" lang="json" theme="chrome"></Editor>
				</div>
				<div v-else><Editor :read-only="true" v-model="result.response_body" lang="html" theme="chrome" height="500px"></Editor></div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="响应头" name="rh">
			<div class="tab-box-sli" v-if="result.response_header">
				<div v-for="(value, key) in result.response_header">
					<el-tag style="margin-top: 3px;" type="info">
						<b style="color: #747474;">{{ key + ' : ' }}</b>
						<span>{{ value }}</span>
					</el-tag>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="请求信息" name="rq">
			<div v-if="result.requests_body">
				<el-collapse v-model="activeNames" class="tab-box-sli">
					<el-collapse-item name="1">
						<template #title>
							<b>General</b>
						</template>
						<div>Request Method : {{ result.method }}</div>
						<div>Request URL : {{ result.url }}</div>
					</el-collapse-item>
					<el-collapse-item name="2">
						<template #title>
							<b>Request Headers</b>
						</template>
						<div v-for="(value, key) in result.requests_header">
							<span>{{ key + ' : ' + value }} :</span>
						</div>
					</el-collapse-item>
					<el-collapse-item name="3">
						<template #title>
							<b>Request Payload</b>
						</template>
						<span>{{ result.requests_body }}</span>
					</el-collapse-item>
				</el-collapse>
			</div>
		</el-tab-pane>
		<el-tab-pane label="日志">
			<!-- <el-scrollbar style="width:calc((100vw - 230px) * 0.8" height="350px"> -->
				<el-scrollbar style="width:100%" height="350px">
				<div v-for="(item, index) in result.log_data">
					<el-tag style="margin-top: 3px;" v-if="item[0] === 'DEBUG'" type="info">{{ item[1] }}</el-tag>
					<el-tag style="margin-top: 3px;" v-else-if="item[0] === 'WARNING'" type="warning">{{ item[1] }}</el-tag>
					<el-tag style="margin-top: 3px;" v-else-if="item[0] === 'ERROR'" type="danger">{{ item[1] }}</el-tag>
					<el-tag style="margin-top: 3px;" v-else-if="item[0] === 'INFO'" type="success">{{ item[1] }}</el-tag>
					<pre v-else-if="item[0] === 'EXCEPT'" style="color: #d60000;">{{ item[1] }}</pre>
				</div>
			</el-scrollbar>
		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				<span v-if="result.state === '成功'" style="color: #00AA7F;">{{ 'Assert : ' + result.state }}</span>
				<span v-else-if="result.state === '失败'" style="color: #d18d17;">{{ 'Assert : ' + result.state }}</span>
				<span v-else style="color: #ff0000;">{{ result.state }}</span>
			</template>
		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				<span v-if="result.status_cede <= 300" style="color: #00AA7F;">{{ 'Status : ' + result.status_cede }}</span>
				<span v-else style="color: #ff5500;">{{ 'Status : ' + result.status_cede }}</span>
			</template>
		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				{{ 'Time : ' + result.run_time }}
			</template>
		</el-tab-pane>
	</el-tabs>
	<div style="margin-top: 10px;width: 100%;text-align: center;" v-if="result.state === '失败' && showbtn">
		<el-button @click="addBugDlg = true" type="success" plain size="small">提交bug</el-button>
	</div>
	<!-- 添加bug的弹框 -->
	<el-dialog title="提交bug" v-model="addBugDlg" width="40%">
		<el-form :model="bugForm">
			<el-form-item label="所属接口">
				<el-select size="small" v-model="bugForm.interface" placeholder="bug对应的接口" style="width: 100%;">
					<el-option :label="iter.name + ' ' + iter.url" :value="iter.id" v-for="iter in interfaces" :key="iter.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="bug描述"><el-input :autosize="{ minRows: 3, maxRows: 4 }" v-model="bugForm.desc" type="textarea" autocomplete="off"></el-input></el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="addBugDlg = false">取 消</el-button>
				<el-button type="success" @click="saveBug">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
import Editor from './CodeEdit.vue';
import { mapState } from 'vuex';
export default {
	props: {
		result: {
			default: {}
		},
		showbtn: {
			default: true
		}
	},
	computed: {
		...mapState(['pro', 'interfaces'])
	},
	components: {
		Editor
	},
	data() {
		return {
			activeNames: ['1', '2', '3'],
			// 提交bug的显示窗口
			addBugDlg: false,
			// 添加bug的表单
			bugForm: {
				interface: null,
				desc: '',
				info: '',
				status: '未处理'
			}
		};
	},
	methods: {
		async saveBug() {
			this.bugForm.project = this.pro.id;
			this.bugForm.info = this.result;
			const response = await this.$api.createBugs(this.bugForm);
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: 'bug提交成功',
					duration: 1000
				});
				this.addBugDlg = false;
			};
			console.log("日志 调用后端提交bug接口传参this.bugForm：", this.bugForm);

		}
	}
};
</script>

<style></style>
