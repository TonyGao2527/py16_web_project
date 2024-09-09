import * as echarts from 'echarts';

export default {
	musenChart(chartDom,datas) {
		// 上课定义的图表函数
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '40',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				data: datas
			}]
		};
		option && myChart.setOption(option);
	},
	LemonChart2(chartDom,lable,value) {
		// 上课定义的图表函数
		var myChart = echarts.init(chartDom);
		var option;
		option = {
		  xAxis: {
		    type: 'category',
		    data: lable
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series: [
		    {
		      data: value,
		      type: 'bar'
		    }
		  ]
		};
		option && myChart.setOption(option);
	},


}
