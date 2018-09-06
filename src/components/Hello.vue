<template>
	<div class="hello">
		<el-table 
			v-loading="loadingTable" 
			stripe 
			:data="tableData" 
			border 
			:row-key="getRowKeys" 
			style="width: 100%" 
			@selection-change="handleSelectionChange"
			
			>
			<el-table-column :selectable="selectable" :reserve-selection="true" type="selection" width="55">
			</el-table-column>

			<el-table-column align='center' label="序号" type="index" width="60">
			</el-table-column>
			<el-table-column 
				:filters="[{text: '撒大声地', value: '1'}, {text: '地方', value: '2'}, {text: '对方付费的', value: '3'}, {text: '是多少大V', value: '4'}]"
        :filter-method="filterHandler"
				:show-overflow-tooltip="true" align='center' prop="custName" label="姓名">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="custMobile" width="92" label="注册手机号">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="custIc" width="100" label="身份证号">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="provName" label="省份">
			</el-table-column>、
			<el-table-column :show-overflow-tooltip="true" align='center' prop="cityName" label="城市">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="pushType" label="注册类型">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="compName" label="门店">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="deptName" label="业务团队">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="empName" label="归属人">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="custStatus" label="状态">
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" align='center' prop="registrationTime" label="注册时间">
			</el-table-column>
			<el-table-column width='65px' :show-overflow-tooltip="true" align='center' prop="orderNumber" label="订单数">
				<template slot-scope="scope">
					<el-button class='followColor' @click="showDialogTableVisible(scope.row)" type="text" size="small" v-if='scope.row.orderNumber != 0'>
						{{scope.row.orderNumber}}
					</el-button>
					<span v-if='scope.row.orderNumber == 0'>{{scope.row.orderNumber}}</span>
				</template>
			</el-table-column>
			<el-table-column width='120px' fixed="right" :show-overflow-tooltip="true" align='center' prop="address" label="操作">
				<template slot-scope="scope">
					<el-button class='followColor' @click="showDialogFollow(scope.row)" type="text" size="small">跟进</el-button>
					<el-button class='followColor' type="text" size="small" @click="intoDetail(scope.row)">客户详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pad20 alignCen">
			<pagination :currentPage='currentPage' :total='total' :myPageSizes='pageSize' @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange'>
			</pagination>
		</div>
	</div>
</template>

<script>
import api from "@/api/index";
import pageSize from "@/api/myPageSize";
import TitCommon from "@/components/common/TitCommon";
import Pagination from "@/components/common/Pagination";
import Search from "@/components/custManage/Search";
import TableList from "@/components/custManage/TableList";
import DialogOrderList from "@/components/custManage/dialog/DialogOrderList";
import DialogFollow from "@/components/custManage/dialog/DialogFollow";

export default {
  name: "U_AllUserList",
  data() {
    return {
      cName: "",
      title: "全部客户",
      currentPage: 1,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      serachPararms: {
        checkListParams: []
      },
      rowFollowId: null,
      visibleObj: {
        dialogTableVisible: false
      },
      dialogFollow: {
        dialogFollowVisible: false
      },
      tableData: [],
      zTreeData: [],
      treeData: [],
      loadingTable: false,
      multipleSelectionIdList: "",
      getRowKeys(row) {
        if (row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8") return;
        return row.bgCustInfoId;
        console.log(row);
      },
      multipleSelection: [],
      select_order_number: "",
      select_orderId: [],
      selectable(row) {
        //禁用条件：禁用第二条
        if (row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8")
          return false;
        return true;
      }
    };
  },

  created() {
    this.cName = this.$route.meta.conpenentName;
    console.log(this.$route, "this.$routethis.$routethis.$route");
    if (pageSize.getMyPageSize(this.pageSize)) {
      this.pageSize = pageSize.getMyPageSize(this.pageSize);
    }
  },
  computed: {
    permission() {
      return {
        showAllPararms: true, //是否要展示'全部，未实名，已实名，已成交'条件
        //			showDistribution: false,//是否要展示‘客户分配’按钮
        showRealName: true,
        showRegType: true //是否要展示高级搜索的‘注册类型’的条件
      };
    }
  },
  mounted() {
    this.queryCustInfoData();
  },
  methods: {
    filterHandler(value, row, column) {
      console.log(value);
      console.log(row);
      console.log(column);
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      this.select_order_number = this.multipleSelection.length;
      this.select_orderId = [];
      if (rows) {
        rows.forEach(row => {
          if (row) {
            console.log(row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8");
            if (row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8") return;
            this.select_orderId.push(row.bgCustInfoId);
          }
        });
      }
      console.log(this.select_orderId, " this.select_orderId");
    },
    queryCustInfoData() {
      this.loadingTable = true;
      this.tableData = [];
      const pararms = {
        currentModuleId: this.$route.query.menuId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        queryParam: this.serachPararms.content,
        custStatus: this.serachPararms.checkListParams, //客户状态:1未实名,2已实名,3已成交[1,2]
        //			custStatus: [1,2],//客户状态:1未实名,2已实名,3已成交[1,2]
        pushType: this.serachPararms.regType, //注册类型:1 自由注册 2 业务员推广 3 邀请好友
        oneSelf: this.serachPararms.onlyCheck,
        department: this.serachPararms.partName,
        empQueryParam: this.serachPararms.people,
        provId: this.serachPararms.applyProvince,
        cityId: this.serachPararms.applyCity
      };
      let startDate = new Date();
      console.log("startDate", startDate);
      api.queryCustInfoData(pararms).then(res => {
        this.total = 0;
        this.tableData = [];
        this.loadingTable = false;
        if (res.data.success) {
          let endDate = new Date();
          console.log("endDate", (endDate - startDate) / 1000);
          this.total = res.data.total;
          this.tableData = res.data.data;
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    showDialogTableVisible(row, orShow) {
      this.visibleObj.dialogTableVisible = true;
      this.crmCustInfoId = row.crmCustInfoId;
      this.$nextTick(function() {
        this.$refs.dialogOrderList.queryOrderList(row.crmCustInfoId);
        console.log(this.$refs.dialogOrderList);
      });
    },
    showDialogFollow(row, orShow) {
      this.dialogFollow.dialogFollowVisible = orShow;
      console.log(row, orShow, "/api/upload/upload");
      this.rowFollowId = row.crmCustInfoId;
      this.$nextTick(function() {
        this.$refs.childDialogFollow.queryFollowList(); // 方法2 父组件调用子组件方法
      });
    },

    CustDistributionFn(data) {
      //分配客户
    },
    searchFn(data) {
      this.pageNo = 1;
      this.currentPage = 1;
      this.serachPararms = Object.assign(this.serachPararms, data);
      //		let arrCheckList = this.serachPararms.checkList
      if (!this.serachPararms.checkListParams) {
        this.serachPararms.checkListParams = "";
      }
      console.log("currentPage", this.currentPage);
      this.queryCustInfoData();
    },
    intoDetail(row) {
      //		this.$store.dispatch('SET_MENU_ID', this.$route.query.menuId)
      var routeData = this.$router.resolve({
        path: "/detail/custDetail",
        query: {
          bgCustomerId: row.bgCustomerId,
          bgCustInfoId: row.bgCustInfoId,
          crmCustInfoId: row.crmCustInfoId,
          menuId: this.$route.query.menuId
        }
      });
      //    	console.log(routeData.route)
      window.open(routeData.href);

      //		console.log(row)
    },
    handleSizeChange(val) {
      pageSize.setMyPageSize(val);
			this.queryCustInfoData()
		},
		methods: {
			filterHandler(value,row,column) {
				console.log(value)
				console.log(row)
				console.log(column)
			},
			handleSelectionChange(rows) {
				this.multipleSelection = rows;
				this.select_order_number = this.multipleSelection.length;
				this.select_orderId = [];
				if(rows) {
					rows.forEach(row => {
						if(row) {
							console.log(row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8")
							if(row.bgCustInfoId == "f2d20ea343f34614a67fabe19c6705d8") return
							this.select_orderId.push(row.bgCustInfoId);
						}
					});
				}
				console.log(this.select_orderId, " this.select_orderId")
			},
			queryCustInfoData() {
				this.loadingTable = true
				this.tableData = []
				const pararms = {
					currentModuleId: this.$route.query.menuId,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					queryParam: this.serachPararms.content,
					custStatus: this.serachPararms.checkListParams, //客户状态:1未实名,2已实名,3已成交[1,2]
					//			custStatus: [1,2],//客户状态:1未实名,2已实名,3已成交[1,2]
					pushType: this.serachPararms.regType, //注册类型:1 自由注册 2 业务员推广 3 邀请好友
					oneSelf: this.serachPararms.onlyCheck,
					department: this.serachPararms.partName,
					empQueryParam: this.serachPararms.people,
					provId: this.serachPararms.applyProvince,
					cityId: this.serachPararms.applyCity
				}
				let startDate = new Date()
				console.log('startDate', startDate);
				api.queryCustInfoData(pararms).then(res => {
					this.loadingTable = false
					if(res.data.success) {
						let endDate = new Date()
						console.log('endDate', (endDate - startDate) / 1000);
						this.total = res.data.total
						this.tableData = res.data.data
					} else {
						this.$notify({
							title: '提示',
							message: res.data.msg,
							duration: 1500
						});
					}
				})
			},
			showDialogTableVisible(row, orShow) {
				this.visibleObj.dialogTableVisible = true
				this.crmCustInfoId = row.crmCustInfoId
				this.$nextTick(function() {
					this.$refs.dialogOrderList.queryOrderList(row.crmCustInfoId)
					console.log(this.$refs.dialogOrderList)
				})
      // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
      // myPageSize.W_AllUserList = val
      // localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
      this.pageSize = val;
      this.currentPage = 1;
      this.pageNo = 1;
      this.queryCustInfoData();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.currentPage = val;
      this.queryCustInfoData();
      //		console.log(val,88888888)
    }
  },
  components: {
    TitCommon,
    Search,
    TableList,
    Pagination,
    DialogOrderList,
    DialogFollow
  }
}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>