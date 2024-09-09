<template>
	<!-- 项目主页面 -->
	<div class="home">
		<!-- 左侧菜单 -->
		<div class="left_box">
			<el-scrollbar height="100vh"><LeftMenu></LeftMenu></el-scrollbar>
		</div>
		<!-- 右侧 -->
		<div class="right_box">
			<!-- 顶部标签栏 -->

			<div class="top_box"><TopTag></TopTag></div>

			<!-- 主体内容展示的区域 -->
			<div class="main_box">
				<el-scrollbar height="calc(100vh - 66px)"><router-view></router-view></el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
import TopTag from '../components/TopTags.vue';
import LeftMenu from '../components/LeftMenu.vue';
import { mapActions } from 'vuex';

export default {
	components: {
		LeftMenu,
		TopTag
	},
	methods: {
		...mapActions(['getAllInterFaces', 'getAllEnvs', 'getAllScent', 'getAllPlan'])
	},
	created() {
		this.getAllInterFaces()
		this.getAllEnvs()
		this.getAllScent()
		this.getAllPlan()
	}
};
</script>

<style scoped>
.home {
	background: #00aa7f;
	height: 100vh;
	display: flex;
}
/* 左侧菜单区域 */
.left_box {
	width: 200px;
	border-right: solid 1px #fff;
	height: 100vh;
}
/* 右侧区域 */
.right_box {
	flex: 1;
	margin: 2px;
}
/* 右侧顶部菜单条 */
.top_box {
	height: 60px;
	background: #fff;
	margin-bottom: 2px;
}
/* 主体内容展示区域 */
.main_box {
	height: calc(100vh - 66px);
	background: #fff;
	border-radius: 5px;
}
</style>
