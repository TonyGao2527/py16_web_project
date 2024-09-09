<template>
	<div class="edit_box">
		<!-- api信息 -->
		<el-divider content-position="left"><b>Api信息</b></el-divider>
		<el-row>
			<el-col :span="18">
				<el-input v-model="url" placeholder="请输入接口地址" class="input-with-select">
					<template #prepend>
						<el-select v-model="method" placeholder="Select" style="width: 115px">
							<el-option label="GET" value="get" />
							<el-option label="POST" value="post" />
							<el-option label="DELETE" value="delete" />
							<el-option label="PUT" value="put" />
							<el-option label="PATCH" value="patch" />
							<el-option label="OPTION" value="option" />
						</el-select>
					</template>
				</el-input>
			</el-col>
			<!-- 运行测试用例 -->
			<el-col :span="6" style="text-align: right;">
				<el-button type="success" icon="Promotion" @click="runCase" >Run</el-button>
			</el-col>
		</el-row>

		<!-- 用例请求信息 -->
		<el-divider content-position="left"><b>用例信息</b></el-divider>
		<el-row>
			<el-col :span="12">
				<el-input v-model="name" placeholder="用例名称" class="input-with-select">
					<template #prepend>
						用例名称
					</template>
				</el-input>
			</el-col>
			<el-col :span="12" style="text-align: right;">
				<el-button type="danger" icon="Delete" @click="deleteCase" plain>删除</el-button>
				<el-button type="success" icon="DocumentCopy" @click="copyCase" plain>复制</el-button>
				<el-button type="success" icon="CircleCheck"  @click="saveCase">保存</el-button>
			</el-col>
		</el-row>

		<!-- 请求信息 -->
		<el-divider content-position="left"><b>请求信息</b></el-divider>
		<el-tabs v-model="activeTab" type="border-card" style="min-height: 350px;">
			<el-tab-pane name="head" label="请求头(headers)"><CodeEdit height="280px" v-model="headers"></CodeEdit></el-tab-pane>
			<el-tab-pane name="params" label="查询参数(params)"><CodeEdit height="280px" v-model="params"></CodeEdit></el-tab-pane>
			<el-tab-pane name="body" label="请求体(body)">
				<el-radio-group v-model="bodyType" class="ml-4">
					<el-radio label="json" size="large">application/json</el-radio>
					<el-radio label="form" size="large">x-www-form-urlencode</el-radio>
					<el-radio label="file" size="large">form-data</el-radio>
				</el-radio-group>
				<!-- 根据选中参数的类型显示对应的内容 -->
				<div>
					<CodeEdit v-if="bodyType === 'json'" height="280px" v-model="jsonParams" lang="json"></CodeEdit>
					<CodeEdit v-else-if="bodyType === 'form'" height="280px" v-model="dataParams" lang="json"></CodeEdit>
					<div v-else class="file_box">
						<el-row>
							<el-col :span="16">
								<el-row :gutter="5" v-for="item in editFiles" style="margin-bottom: 10px;">
									<!-- 参数名 -->
									<el-col :span="7"><el-input v-model="item[0]" placeholder="参数名" /></el-col>
									<!-- 参数类型：文件还是文本值 -->
									<el-col :span="4">
										<el-select v-model="item[1]" class="m-2" placeholder="Select">
											<el-option label="text" value="text" />
											<el-option label="file" value="file" />
										</el-select>
									</el-col>
									<!-- 参数的内容(值) -->
									<!-- 判断是否为文件上传 -->
									<el-col v-if="item[1] == 'file'" :span="7">
										<el-select v-model="item[2]" class="m-2" placeholder="Select" style="width: 100%;">
											<el-option v-for="f in fileList" :label="f.info[0]" :value="f.info" />
										</el-select>
									</el-col>
									<el-col v-else :span="7"><el-input v-model="item[2]" placeholder="参数值" /></el-col>
									<!-- 删除按钮 -->
									<el-col :span="6" style="text-align: center;">
										<el-button  @click="editFiles.splice(index, 1)" icon="Delete" type="danger" plain></el-button>
									</el-col>
								</el-row>
								<!-- 添加一行参数输入框 -->
								<el-button @click="editFiles.push(['', 'text', ''])" icon="Plus" type="success" plain size="small" style="margin-top: 10px;"></el-button>
							</el-col>
							<el-col :span="8">
								<!-- 上传文件 -->
								<el-upload
									class="upload-demo"
									:action="$api.uploadFile.url"
									:headers="$api.uploadFile.headers"
									method="post"
									name="file"
									:on-success="uploadSuccess"
								>
									<el-button plain type="success">上传文件</el-button>
								</el-upload>
								<!-- 文件列表吧 -->
								<el-table :data="fileList" :height="250">
									<el-table-column label="已有文件" width="180">
										<template #default="scope">
											{{ scope.row.info[0] }}
										</template>
									</el-table-column>

									<el-table-column label="类型" width="180">
										<template #default="scope">
											{{ scope.row.info[2] }}
										</template>
									</el-table-column>
								</el-table>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="前置脚本">
				<el-row  :gutter="10">
					<el-col :span="18"><CodeEdit height="280px" v-model="setup_script" lang="python" theme="monokai"></CodeEdit></el-col>
					<el-col :span="6">
						<el-divider content-position="center">脚本模板</el-divider>
						<div class="add_script_box"><el-button @click="add_setup_script('gv')" type="success" plain>预设全局变量</el-button></div>
						<div class="add_script_box"><el-button @click="add_setup_script('env')" style="margin-top: 10px;" type="success" plain>预设局部变量</el-button></div>
						<div class="add_script_box"><el-button @click="add_setup_script('func')" style="margin-top: 10px;" type="success" plain>调用全局函数</el-button></div>
						<div class="add_script_box"><el-button @click="add_setup_script('sql')" style="margin-top: 10px;" type="success" plain>执行sql查询</el-button></div>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="后置脚本">	
				<el-row :gutter="10">
					<el-col :span="18"><CodeEdit height="280px" v-model="teardown_script" lang="python" theme="monokai"></CodeEdit></el-col>
					<el-col :span="6">
						<el-divider>脚本模板</el-divider>
						<el-scrollbar height="250px">
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('getBody')">获取响应体</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('JSextract')">jsonpath提取数据</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('REextract')">正则提取数据</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('ENV')">设置全局变量</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('env')">设置局部变量</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('func')">调用全局函数</el-button></div>
							<div class="add_script_box"><el-button type="success" plain @click="addTearDownCodeMod('sql')">执行sql查询</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('http')">断言HTTP状态码</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('eq')">断言相对</el-button></div>
							<div class="add_script_box"><el-button type="success"  plain @click="addTearDownCodeMod('contain')">断言包含</el-button></div>
						</el-scrollbar>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
		<div class="result_test" v-if='runResult'>
				<el-divider content-position="left"><b>响应信息</b></el-divider>
				<CaseResult :result='runResult' ></CaseResult>
		</div>
	
	</div>
</template>

<script>
import CodeEdit from './CodeEdit.vue';
import { ElMessage,ElMessageBox  } from 'element-plus';
import { mapActions,mapState} from 'vuex';
import  CaseResult from './caseResult.vue'
export default {
	components: {
		CodeEdit,
		CaseResult
	},
	props: ['editCase'],
	data() {
		return {
			// 后台所有测试用的文件
			fileList: [],
			// 默认激活的标签页
			activeTab: 'body',
			// 请求体参数的类型
			bodyType: 'json',
			caseInfo: null,
			// 用例运行结果：
			runResult:null,
			// 页面内容输入绑定的数据
			url: '',
			method: 'get',
			name: '',
			headers: '{}',
			params: '{}',
			setup_script: '',
			teardown_script: '',
			jsonParams: '',
			dataParams: '',
			// 文件上传的参数
			editFiles: []
		};
	},
	computed:{
		...mapState(['envId'])
	},
	methods: {
		...mapActions(['getAllInterFaces']),
		// 获取用例详细信息
		async getCaseDesc() {
			const response = await this.$api.getCaseInfo(this.editCase.id);
			if (response.status === 200) {
				this.caseInfo = response.data;
				this.initEditData();
			}
		},
		// 删除用例
		deleteCase() {
			ElMessageBox.confirm('确定要删除该用例吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.delTeststep(this.caseInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						this.getAllInterFaces();
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
		// 保存用例
		async saveCase() {
			// 获取编辑后的数据
			const params = this.resetEditData();
			// 发送请求
			const response = await this.$api.updateTeststep(this.caseInfo.id, params);
			if (response.status === 200) {
				ElMessage({
					type: 'success',
					message: '保存成功',
					duration: 1000
				});
				this.getAllInterFaces()
			}
		},
		// 复制用例
		async copyCase() {
			const params = this.resetEditData();
		
			params.title = params.title + '_copy';
			// 发送请求
			const response = await this.$api.createTeststep(params);
			if (response.status === 201) {
				ElMessage({
					type: 'success',
					message: '复制成功',
					duration: 1000
				});
				this.getAllInterFaces();
			}
		},
		// 运行用例
		async runCase(){
			const runData = this.resetEditData();
			runData.interface = {
				url: this.caseInfo.interface.url,
				method: this.caseInfo.interface.method
			};
			const params = {
				data: runData,
				env: this.envId
			};
			const response = await this.$api.runTest(params);
			if (response.status === 200) {
				this.runResult = response.data;
				ElMessage({
					type: 'success',
					message: '执行完毕',
					duration: 1000
				});
			}
		},
		initEditData() {
			// 将后端返回的用例数据转换成前端编辑所需格式，赋值到对应的表单绑定的属性上
			const datas = { ...this.caseInfo };
			this.method = datas.interface.method;
			this.url = datas.interface.url;
			this.name = datas.title;
			this.headers = JSON.stringify(datas.headers || {}, null, 2);
			this.params = JSON.stringify(datas.request.params || {}, null, 2);
			this.setup_script = datas.setup_script;
			this.teardown_script = datas.teardown_script;
			this.jsonParams = JSON.stringify(datas.request.json || {}, null, 2);
			this.dataParams = JSON.stringify(datas.request.data || {}, null, 2);
			datas.file.forEach(item => {
				if (item[1].length === 3) {
					this.editFiles.push([item[0], 'file', item[1]]);
				} else {
					this.editFiles.push([item[0], 'text', item[1]]);
				}
			});
		},
		resetEditData() {
			// 备注：修改和保存用例数据时，需要调用该方法，来转换数据的格式
			// 将编辑完的数据，转换为后端所需的格式，赋值到caseInfo中
			let caseData = { ...this.caseInfo };
			caseData.interface = this.caseInfo.interface.id;
			caseData.title = this.name;
			caseData.headers = JSON.parse(this.headers);
			caseData.setup_script = this.setup_script;
			caseData.teardown_script = this.teardown_script;
			caseData.request={}
			caseData.request.params = JSON.parse(this.params);
			if(this.bodyType==='json'){
				caseData.request.json = JSON.parse(this.jsonParams);
			}else if(this.bodyType==='data'){
				caseData.request.data = JSON.parse(this.dataParams);
			}else{
				const files = [];
				this.editFiles.file.forEach(item => {
					files.push([item[0], item[2]]);
				});
				caseData.file = files;
			}	
			return  caseData
		},
		// 生成前置脚本
		add_setup_script(type) {
			if (type === 'gv') {
				this.setup_script += '# 设置全局变量 \ntest.save_global_variable("变量名","变量值")\n';
			} else if (type === 'env') {
				this.setup_script +='\n# 设置局部变量  \ntest.save_env_variable("变量名","变量值")';
			}else if (type === 'func') {
				this.setup_script +='\n# 调用全局工具函数random_mobile随机生成一个手机号码  \nmobile = global_func.random_mobile()';
			}else if (type === 'sql') {
				this.setup_script +='# ----执行sql语句(需要在环境中配置数据库连接信息)----\n# db.连接名.execute_all(sql语句)\nsql = "SELECT count(*) as count FROM futureloan.member"\n res = db.aliyun.execute_all(sql)\n';
			}
		},
		// 生成后置脚本的方法
		addTearDownCodeMod(tp) {
			switch (tp) {
				case 'getBody':
					this.teardown_script += '\n# Demo:获取响应体(json)  \nbody = response.json()';
					this.teardown_script += '\n# Demo2:获取响应体(字符串)  \nbody = response.text';
					break;
				case 'JSextract':
					this.teardown_script += '\n# Demo:jsonpath提取response中的msg字段  \nmsg = test.json_extract(response.json(),"$..msg")';
					break;
				case 'REextract':
					this.teardown_script += '\n# Demo:正则提取响应体中的数据  \nres = test.re_extract(response.text,"正则表达式",)';
					break;
				case 'ENV':
					this.teardown_script += '\n# 设置全局变量 \ntest.save_global_variable("变量名","变量值")';
					break;
				case 'env':
					this.teardown_script += '\n# 设置局部变量  \ntest.save_env_variable("变量名","变量值")';
					break;
				case 'func':
					this.teardown_script += '\n# 调用全局工具函数random_mobile随机生成一个手机号码  \nmobile = global_func.random_mobile()';
					break;
				case 'sql':
					this.teardown_script +=
						'\n# ----执行sql语句(需要在环境中配置数据库连接信息)----\n# db.连接名.execute_all(sql语句) \nsql = "SELECT count(*) as count FROM futureloan.member"\nres = db.aliyun.execute_all(sql)';
					break;
				case 'http':
					this.teardown_script += '\n# 断言http状态码 \n# Demo:断言http状态码是否为200  \ntest.assertion("相等",200,response.status_code)';
					break;
				case 'eq':
					this.teardown_script += '\n# 断言相等 \ntest.assertion("相等","预期结果","实际结果")';
					break;
				case 'contain':
					this.teardown_script += '\n# 断言包含:预期结果中的内容在实际结果中是否存在 \ntest.assertion("包含","预期结果","实际结果")';
					break;
			}
		},
		async getAllFile() {
			const response = await this.$api.getFiles();
			this.fileList = response.data;
		},
		// 文件上传成功之后执行的方法
		uploadSuccess() {
			// 获取后台所有的文件
			this.getAllFile();
			// 提示登录成功
			ElMessage({
				message: '文件上传成功',
				type: 'success'
			});
		}
	},
	created() {
		if (this.editCase) {
			this.getCaseDesc();
		}
		this.getAllFile();
	},
	watch: {
		editCase(val) {
			if (this.editCase) {
				this.getCaseDesc();
			}
		}
	}
};
</script>

<style scoped>
.edit_box {
	padding: 10px;
}

.add_script_box {
	margin-top: 5px;
	text-align: left;
}
.result_test{
	width: calc((100vw - 230px) * 0.83)
}
</style>
