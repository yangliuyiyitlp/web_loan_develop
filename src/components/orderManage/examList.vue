<template>
 <div class="allCustList">
 	<!--<TitCommon :title='title'></TitCommon>-->
 	<div class="custListWrap">
 		<search
 			ref='search'
 			:treeData = 'treeData'
 			:data = 'zTreeData'
 			:checkListName = 'checkListName'
 			@CustDistributionFn='CustDistributionFn'
 			@searchFn='searchFn'
 			:permission ='permission'>
 		</search>
 		<div class="table-wrap">
 			<table-list
 				:loadingTable = 'loadingTable'
 				:tableData='tableData'
 				@showDialogTableVisible = 'showDialogTableVisible'
 				@showOrderDetail = 'showOrderDetail'
 				>
 			</table-list>
 		</div>
 		<div class="pad20 alignCen">
 			<pagination
				:currentPage = 'currentPage'
				:total = 'total'
				:myPageSizes = 'pageSize'
				@handleSizeChange = 'handleSizeChange'
				@handleCurrentChange = 'handleCurrentChange'
 				>
 			</pagination>
 		</div>
 	</div>
 </div>
</template>

<script>
import api from "@/api/index"
import pageSize from "@/api/myPageSize"

//import TitCommon from '@/components/common/TitCommon'
import Pagination from '@/components/common/Pagination'
import TableList from '@/components/common/OrderAndCtrollTableList'
import Search from '@/components/common/OrderAndCustomerSearch'
export default {
  name: 'O_ExamList',
  data() {
  	return {
  		title: '审批中订单',
  		checkListName: ['挂起'],
  		currentPage:1,
  		total: 0,
  		pageNo: 1,
        pageSize: 10,
        serachPararms:{},
        rowFollowId: null,
//      visibleObj: {
//			dialogTableVisible: false,
//		},
//		dialogFollow: {
//			dialogFollowVisible: false,
//		},
        tableData: [],
        zTreeData: [],
        treeData: [],
        loadingTable: false,
//      multipleSelectionIdList: '',

  	}
 },
 computed: {
 	permission () {
 		return {
// 			  {name:"申请中",detailCode: '000001',id:"1"},
//		          {name:"审批中",detailCode: '000002',id:"2"},
//		          {name:"还款中",detailCode: '000003',id:"3"},
//		          {name:"已结清",detailCode: '000004',id:"4"},
////		          {name:"拒绝",detailCode: '000005',id:"5"}
 			showAllPararms: false,//'申请中','审批中','还款中','已结清'
			showOrderState: false, //是否要展示高级搜索的‘订单状态’的条件
			showOrderNode: true, //是否要展示高级搜索的‘订单环节’的条件
			onlyOrderNode: false, //true是申请中页面控制的订单环节，fasle是审批中页面控制的订单环节
			detailCode: '000002',//审批中
			showUp:true,
			showOnlyCheck: true,
			searchContent:'请输入姓名、手机号或身份证号码精确查询'
 		}
 	}
 },
 mounted() {
 	this.getDepartmentZtreeFn()
 	this.queryApplyOrderInfoFn()
// 	this.$refs.search.checkOrderNodeFn()
 },
 created() {
   if( pageSize.getMyPageSize(this.pageSize)){
     this.pageSize=pageSize.getMyPageSize(this.pageSize)
   }
 	// if (JSON.parse(localStorage.getItem('myPageSize'))) {
 	// 	this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).W_ExamList?JSON.parse(localStorage.getItem('myPageSize')).W_ExamList:10
 	// 	console.log(JSON.parse(localStorage.getItem('myPageSize')).W_ExamList)
 	// } else {
 	// 	let obj = {}
 	// 	localStorage.setItem('myPageSize',JSON.stringify(obj))
 	// }
 },
  methods: {
  	queryApplyOrderInfoFn() {
		
  		this.loadingTable = true
  		let s_time,e_time
  		if (this.serachPararms.applyDate) {
  			s_time = this.serachPararms.applyDate[0]
  			e_time = this.serachPararms.applyDate[1]
  		} else {
  			s_time = ''
  			e_time = ''
  		}
  		const pararms = {
  			currentModuleId: this.$route.query.menuId,
  			pageNo: this.pageNo,
  			pageSize: this.pageSize,
			queryParam: this.serachPararms.content,
			orderStatus: '2,6,7,8,9',//订单状态：1申请中,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,8满标以放款,9流标,10退件
//			custStatus: [1,2],//客户状态:1未实名,2已实名,3已成交[1,2]
			applyTimeBegin: s_time,
			applyTimeEnd: e_time,
			proTypeId:  this.serachPararms.productList,
			proId: this.serachPararms.productName,
			department: this.serachPararms.partName,
			empQueryParam: this.serachPararms.people,
//			orderNode: this.serachPararms.orderNode,//订单环节
//			orderState: this.serachPararms.orderState //订单状态
			nodeCode: this.serachPararms.orderNode,//订单环节
			hangStatus: this.serachPararms.hangStatus,
			provId: this.serachPararms.applyProvince,
			cityId: this.serachPararms.applyCity,
			oneSelf: this.serachPararms.onlyCheck,
        number:1
  		}
//		console.log(this.serachPararms,6666)
//		console.log(pararms,6666)
		api.queryApplyOrderInfo(pararms).then(res => {
			  this.total = 0
				this.tableData =[]
			this.loadingTable = false
			if(res.data.success) {
				this.total = res.data.total
				this.tableData = res.data.data
			} else {
				this.$notify({
		           title: '提示',
		           message: res.data.msg,
		           duration: 1500
		        });
			}
			console.log(res.data.data,6666)
		})
  	},
  	showDialogTableVisible(row,orShow) {
//		this.visibleObj.dialogTableVisible = orShow
  		console.log(row,orShow)
  	},
  	showOrderDetail(row,orShow) {
		var routeData = this.$router.resolve({
        	path: '/detail/orderDetail',
        	query: {
        		crmApplayId: row.applyId,
        		menuId: this.$route.query.menuId
        	}
      	});
      	window.open(routeData.href);
//		this.dialogFollow.dialogFollowVisible = orShow
		console.log(row,orShow,'/api/upload/upload')
//		this.rowFollowId = row.crmCustInfoId
//		this.$nextTick(function () {
////			this.$refs.childDialogFollow.$emit('showDialogFollow') // 方法1 子组件监听父组件发送的方法
// 			this.$refs.childDialogFollow.queryFollowList() // 方法2 父组件调用子组件方法
//
//		})
  	},

  	CustDistributionFn(data) {//分配客户
  	},
  	searchFn(data) {
  		this.pageNo = 1
  		this.currentPage = 1
		this.serachPararms = Object.assign(this.serachPararms,data)
		if(!this.serachPararms.checkListParams){
			this.serachPararms.checkListParams = ''
		}
		this.queryApplyOrderInfoFn()

//		console.log(this.serachPararms.checkListParams,'-=-=-=--')
		console.log(data)

  	},
  	handleSizeChange(val) {
		this.currentPage = 1
      this.pageNo = 1
      pageSize.setMyPageSize(val)

      // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
  		// myPageSize.W_ExamList = val
	 	// localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
		this.pageSize = val
		this.queryApplyOrderInfoFn()
//		console.log(val,777777777777)
	},
	handleCurrentChange(val) {
		this.pageNo = val
		this.currentPage = val
//		this.pageNo = val
		this.queryApplyOrderInfoFn()
//		console.log(val,88888888)
	},
	getDepartmentZtreeFn() {
		api.getDepartmentZtree({groupId:''}).then(res => {
			if(res.data.status == 1) {
				this.treeData = res.data.ztree
				this.zTreeData = this.toTree(res.data.ztree)
			} else {
				this.$notify({
		           title: '提示',
		           message: res.data.msg,
		           duration: 1500
		        });
			}
//			console.log(this.zTreeData,123)
		})
	},
	toTree(ary, data) {
		var _this = this
		var data = data ? data : (function(ary) {
			var tempAry = [];
			var idList = [];
			ary.forEach(function(item) {
				idList.push(item.id)
			});
			for(var i = 0, len = ary.length; i < len; i++) {
				if(ary[i].pId == undefined || (ary[i].pId != undefined && _this.debFn(ary[i].pId, idList))) {
					var obj = {
						title: ary[i].name,
						id: ary[i].id
					};
					tempAry.push(obj);
				}
			}
			return tempAry;
		}(ary));
		var temp = 0;
		if(data.constructor == Array) {
			for(var i = 0, len = data.length; i < len; i++) {
				for(var j = 0, lenA = ary.length; j < lenA; j++) {
					if(ary[j].pId == data[i].id) {
						var obj = {
							title: ary[j].name,
							id: ary[j].id
						};
						data[i].children = data[i].children || [];
						data[i].children.push(obj);
						temp++;
					}
				}
			}
		}
		if(temp > 0) {
			if(data.constructor == Array) {
				for(var n = 0, lenB = data.length; n < lenB; n++) {
					data[n].children = this.toTree(ary, data[n].children ? data[n].children : []);
					if(data[n].children.length == 0) {
						delete data[n].children;
					}
//							delete data[n].id;
				}
			}
		} else {
			for(var n = 0, lenB = data.length; n < lenB; n++) {
//						delete data[n].id;
			}
		}
		return data;

	},
	debFn(id, idList) {
		var flag = true;
		for(var ida in idList) {
			if(id == idList[ida]) {
				flag = false;
			}
		}
		return flag;
	},
  },
  components: {
//	TitCommon,
  	TableList,
	Search,
	Pagination,
//	DialogOrderList,
//	DialogFollow,
//	DialogFollow
  }

 }
</script>
<style lang="less" scoped>

</style>
