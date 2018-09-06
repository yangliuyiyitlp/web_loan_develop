<template>
 <div class="OverdueM1TableList resetTable">
 	<div class="table-wrap">
 		<el-table
 		 	v-loading="loadingTable"
	 		stripe
		    :data="tableData"
		    border
		    style="width: 100%"
		    >
		    <el-table-column
		    	align='center'
		    	label="序号"
		        type="index"
		      	width="60">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      	prop="compName"
		      	label="门店">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="deptName"
		      label="业务团队">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="empName"
		      label="归属人"
		      width="120">
		    </el-table-column>
		    <el-table-column
		    	width='100'
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="custName"
		      label="借款人姓名">
		    </el-table-column>
		    <el-table-column
          width="100"
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="custMobile"
		      label="手机号码">
		    </el-table-column>、
		    <el-table-column
          width="100"
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="custIc"
		      label="身份证号">
		    </el-table-column>
		    <el-table-column
		    	v-if = 'voerdueStatus'
		    	:show-overflow-tooltip="true"
				align='center'
		      	prop="overdueStatus"
		      	label="逾期状态">
		    </el-table-column>
       <!--todo 催收机构-->
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop=""
		      label="催收机构">
		      <template slot-scope="scope">
		        
		        <el-popover
						  placement="bottom"
						  title=""
						  width="200"
						  trigger="click"						  
						  :content="contentCollectors">
						  <!--@show = 'showOpenGetCollectors(scope.row)'-->
						  <el-button 
						  	slot="reference"
						  	type="text" 
						  	size="small" 						  	
						  	@click='openGetCollectors(scope.row)'
						  	class='followColor'>
						  	查看
						  </el-button>
						</el-popover>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="cptName"
		      label="产品系列">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="cpName"
		      label="产品名称">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="provName"
		      label="省份">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
				align='center'
		      prop="cityName"
		      label="城市">
		    </el-table-column>
		    <el-table-column
		    	width='110'
		    	:show-overflow-tooltip="true"
				align='center'
			    prop="contractMoney"
			    label="合同金额(元)">
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
					align='center'
		      prop="loanTime"
		      label="放款日期">
		      <template slot-scope="scope">
		        {{scope.row.loanTime | substrFormatTime}}
		      </template>
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
					align='center'
		      prop="expireTime"
		      label="到期日期">
		    </el-table-column>
		    <el-table-column
		    	width='100'
		    	:show-overflow-tooltip="true"
					align='center'
		      prop="currentRepaymentTime"
		      label="本期还款日">
		      	<template slot-scope="scope">
		        {{scope.row.currentRepaymentTime | substrFormatTime}}
		      </template>
		    </el-table-column>
		    <el-table-column
		    	:show-overflow-tooltip="true"
					align='center'
		      prop="overdueDay"
		      label="逾期天数">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		    	:show-overflow-tooltip="true"
				align='center'
			    prop="address"
			    label="操作">
		      <template slot-scope="scope">
		        <el-button  type="text" size="small" @click='goFollow(scope.row)' class='followColor'>跟进</el-button>
		      </template>
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		    	:show-overflow-tooltip="true"
				align='center'
			    prop="address"
			    label="订单详情">
		      <template slot-scope="scope">
		        <el-button  type="text" size="small" @click='goOrderDetail(scope.row)'  class='followColor'>查看</el-button>
		      </template>
		    </el-table-column>
	  </el-table>
 	</div>
 </div>
</template>

<script>
import api from "@/api/index"
//import Pagination from '@/components/common/Pagination'
//import DialogFollow from '@/components/loanManage/dialog/DialogFollow'
export default {
  	name: 'tableList',
  	props: {
		 	voerdueStatus: {
		 		type: Boolean,
		 		default: true
		 	},
		 	tableData: {
		 		type: Array,
		 		default: []
		 	},
		 	loadingTable: {
		 		type: Boolean,
		 		default: false
		 	}
		},
  	data() {
	  	return {
				contentCollectors: ''
	  	}
  	},
  	created() {

	},
  	mounted() {
			
  	},
  	methods: {
  		goFollow(row){
  			this.$emit('goFollow',row,true)
  		},
  		goOrderDetail(row){
  			this.$emit('goOrderDetail',row)
  		},
  		getCollectorsFn(orderPrdNumber){
  			let pararms = {
					// orderNumber:"A25954"
					orderNumber: orderPrdNumber
  			}
  		
  			api.getCollectors(pararms).then(res => {  // 不展示提醒框
					// if (res.data.responseCode == '1') {
							this.contentCollectors = ''
						this.contentCollectors = res.data.data || "暂无数据"
					// } else {
					// 	this.$notify({
					// 		title: '提示',
					// 		message: res.data.responseMsg,
					// 		duration: 1500
					// 	});
					// }
  				// console.log(res)
  			})
  		},
			openGetCollectors(val) {
				let orderPrdNumber =val.orderPrdNumber
				this.getCollectorsFn(orderPrdNumber)
				console.log(val,"val")
			},
//		showOpenGetCollectors(val) {
//			this.getCollectorsFn()
//			console.log(val,"val")  			
//		}
  	},
  	filters: {
  		substrFormatTime(val) {
  			if (!val) return ''
  			return val.split(' ')[0]
  		}
  	}
//	components: {
//		Pagination,
//		DialogFollow
//	}

 }
</script>
<style lang="less" scoped>

</style>
