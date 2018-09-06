<template>
	<div class="control-wrap">
		<!--<TitCommon :title='title'></TitCommon>-->
		<div class="borBot1px padTopBot20">
			<div >
				<el-form :inline="true" class="demo-form-inline">
				    <el-form-item >
				    	<el-input @clear = 'clearFn' style="width:320px" v-model.trim="queryPararms" placeholder='请输入姓名、手机号或身份证号码精确查询' clearable></el-input>
				    </el-form-item>
				    <el-form-item>
				    	<el-button type="primary" icon="el-icon-search" @click='searchFn'>查询</el-button>
				    </el-form-item>
			    </el-form>
		  	</div>
		</div>
		<div class="padTop20 table-wrap resetTable">
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
			      	width="80">
			    </el-table-column>
			    <el-table-column
			    	:show-overflow-tooltip="true"
					align='center'
			      	prop="applicationTime"
			      	label="申请时间">
			    </el-table-column>
			    <el-table-column
			    	width='120px'
			    	:show-overflow-tooltip="true"
					align='center'
			      	prop="systemResidenceTime"
			      	label="系统停留时间">
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
			      	prop="custName"
			      	label="客户姓名">
			    </el-table-column>
			    <el-table-column
			    	:show-overflow-tooltip="true"
					align='center'
			      	prop="custIc"
			      	label="身份证号">
			    </el-table-column>
			    <el-table-column
			    	:show-overflow-tooltip="true"
					align='center'
			      	prop="custMobile"
			      	label="手机号码">
			    </el-table-column>
			    <el-table-column
			    	:show-overflow-tooltip="true"
					align='center'
			      	prop="orderStatus"
			      	label="订单状态">
            <template slot-scope="scope">
              <!--1申请中,2审批中,3还款中,4已结清,5拒绝,    (6线上筹 资中,7满标,8满标以放款,9流标,) 审批中 10退件 （拒绝）-->
              <span 	@click="openDialogOrder(scope.row)" v-if='scope.row.orderStatus == 1 && (scope.row.hangStatus != 1 && scope.row.hangStatus != 2)'>申请中</span>
              <span
                @click="openDialogOrder(scope.row)"
                v-if='(scope.row.orderStatus == 1) && (scope.row.hangStatus == 1 || scope.row.hangStatus == 2)'>
	    		申请中<i class="cursorTip">(挂)</i>
	    	</span>
              <span
                v-if='(scope.row.orderStatus == 2 || scope.row.orderStatus == 6 || scope.row.orderStatus == 7 || scope.row.orderStatus == 8 || scope.row.orderStatus == 9) && (scope.row.hangStatus != 1 && scope.row.hangStatus != 2)'
              >
	    		审批中
	    	</span>
              <span
                @click="openDialogOrder(scope.row)"
                v-if='(scope.row.orderStatus == 2 || scope.row.orderStatus == 6 || scope.row.orderStatus == 7 || scope.row.orderStatus == 8 || scope.row.orderStatus == 9) && (scope.row.hangStatus == 1 || scope.row.hangStatus == 2)'>
	    		审批中<i class="cursorTip">(挂)</i>
	    	</span>

              <span v-if='scope.row.orderStatus == 3'>还款中</span>
              <span v-if='scope.row.orderStatus == 4'>已结清</span>
              <span
                v-if='(scope.row.orderStatus == 5 || scope.row.orderStatus == 10)'
               class="cursorTip"
                @click="openDialogOrder(scope.row)">
	    		拒绝
	    	</span>
            </template>
			    </el-table-column>
			    <el-table-column
			    	:show-overflow-tooltip="true"
					align='center'
				    prop="segment"
				    label="环节">
			    </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align='center'
          prop="hangTime"
          label="挂起时间">
        </el-table-column>
			    <el-table-column
			    	fixed="right"
			    	:show-overflow-tooltip="true"
					align='center'
				    prop=""
				    label="订单详情">
			      <template slot-scope="scope">
			        <el-button  type="text" size="small" class='fs12' @click='goOrderDetail(scope.row)' v-if='scope.row.orderStatus != 4'>查看</el-button>
			        <el-button  type="text" size="small" v-else disabled>查看</el-button>
			      </template>
			    </el-table-column>
			    <el-table-column
			    	fixed="right"
			    	:show-overflow-tooltip="true"
					align='center'
				    prop=""
				    label="操作">
			      <template slot-scope="scope" v-if='scope.row.btnStatus == 1'>
			      	<!--1申请中,2审批中,3还款中,4已结清,5拒绝,    (6线上筹 资中,7满标,8满标以放款,9流标,) 审批中 10退件 （拒绝）-->
			        <el-button class='fs12' type="text" size="small" @click='reviveFn(scope.row)'

			        	>
			        	复活
			        </el-button>

			      </template>
			    </el-table-column>

		  </el-table>
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
		<el-dialog title="复活" width='400px' center :visible.sync="dialogFormVisible" :close-on-click-modal ='false'>
			<el-form :model="form" ref="form" :rules="form_rules">
			    <el-form-item label="订单编号" :label-width="formLabelWidth">
			       <p>{{orderNumber}}</p>
			    </el-form-item>
			    <el-form-item label="复活原因" :label-width="formLabelWidth" prop="reason2" class='reasons'>
			      	<el-form-item>
				        <el-select v-model="form.reason1" placeholder="请选择" @change='changeReason' clearable>
					        <el-option  v-for = '(val,index) in options1' :label="val.name" :value="val.code" :key='index'></el-option>
					    </el-select>
				    </el-form-item>
			       <el-form-item>
				        <el-select v-model="form.reason2" placeholder="请选择" clearable >
					        <el-option v-for = '(val,index) in options2' :label="val.name" :value="val.detailCode" :key='index'></el-option>
					    </el-select>
				    </el-form-item>
			    </el-form-item>
			    <el-form-item label="备注说明" :label-width="formLabelWidth" prop="remark">
			       <el-input type="textarea" v-model="form.remark" :maxlength='200'></el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <div class='text-rt'>
			    	<el-button @click="dialogFormVisible = false">取 消</el-button>
			      <el-button type="primary"  @click = 'submitForm("form")' :loading='saveFollow'>确 定</el-button>
			    </div>
			</div>
		</el-dialog>
    <el-dialog title="拒单原因" width='400px' center :visible.sync="dialogRefused" top='20%' :close-on-click-modal ='false'>
      <div class="" style='margin-top: -25px;'>
        <el-row>
          <el-row>
            <el-col :span="5" >订单编号：</el-col>
            <el-col :span="19" >{{orderNumber}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >拒单原因：</el-col>
            <el-col :span="19" >{{objRefresed.refusalReason}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >操作人：</el-col>
            <el-col :span="19" >{{objRefresed.creator}} </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >操作日期：</el-col>
            <el-col :span="19" >{{objRefresed.createTime}}</el-col>
          </el-row>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog title="挂起原因" width='400px' center :visible.sync="dialogApply"  top='20%' :close-on-click-modal ='false'>
      <div class="" style='margin-top: -25px;'>
        <el-row>
          <el-row>
            <el-col :span="5" >订单编号：</el-col>
            <el-col :span="19" >{{hangUpObj.orderNum}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >挂起原因：</el-col>
            <el-col :span="19" >{{hangUpObj.hangReason}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >环节：</el-col>
            <el-col :span="19" >{{hangUpObj.nodeName}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="5" >操作人：</el-col>
            <el-col :span="19" >{{hangUpObj.creator}} </el-col>
          </el-row>
        </el-row>
      </div>
    </el-dialog>
	</div>
</template>
<script>
import api from "@/api/index"
import pageSize from "@/api/myPageSize"

//import TitCommon from '@/components/common/TitCommon'
import Pagination from '@/components/common/Pagination'
export default {
	name:'CT_CtrallList',
	data() {
        // var validateCon = (rule, value, callback) => {
			// console.log(value,'-----------------')
	     //    if (!value.value ) {
	     //      callback(new Error('请选择复活原因'));
	     //    } else {
        //
	     //      callback();
	     //    }
        // };
        // var validateCon2 = (rule, value, callback) => {
        // 	console.log(value,'++++++++')
	     //    if (!value.value) {
	     //    	console.log(value,'++++++++')
	     //     return callback(new Error('请选择复活原因'));
	     //    } else {
        //
	     //      callback();
	     //    }
        // };
		return {
			title: '订单管理',
			queryPararms: '', // 18225877595
			tableData: [],
			loadingTable: false,
			pageNo: 1,
			pageSize: 10,
			total: 0,
			currentPage: 1,
			saveFollow: false,
			dialogFormVisible:false,
			crmApplayId: null,
			form: {
				crmApplayId:'',
				reason1: '',
				reason2: '',
				remark: ''
			},
			formLabelWidth: '80px',
			form_rules:{
	        	// reason1: [
		        //     {   required: true, message: '请选择复活原因', trigger: 'change' },
		        //     { validator: validateCon, trigger: 'blur,change' }
		        // ],
		        reason2: [
		            {   required: true, message: '请选择复活原因', trigger: 'blur' },
		             // { validator: validateCon2, trigger: 'blur' }
		        ],
        remark:[
		        	{required:true, message: '请填写备注内容', trigger: 'blur' }
		        ]
	        },
	        options1: [],
	        options2: [],
	        orderNumber: null,
      dialogRefused:false,
      dialogApply:false,
      dialogApplyControl:false,
      objRefresed:{},
      hangUpObj:{}
		}
	},
	created() {

    if( pageSize.getMyPageSize(this.pageSize)){
      this.pageSize=pageSize.getMyPageSize(this.pageSize)
    }
	 	// if (JSON.parse(localStorage.getItem('myPageSize'))) {
	 	// 	this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).W_ControlOrder?JSON.parse(localStorage.getItem('myPageSize')).W_ControlOrder:10
	 	// 	console.log(JSON.parse(localStorage.getItem('myPageSize')).W_ControlOrder)
	 	// } else {
	 	// 	let obj = {}
	 	// 	localStorage.setItem('myPageSize',JSON.stringify(obj))
	 	// }
	},
	methods: {
    openDialogOrder(row) {
      this.orderNumber = row.orderNumber
      if(row.orderStatus == 5 || row.orderStatus == 10) {
        this.dialogRefused = true
        this.queryRefusalReasonFn(row.applyId)
      }
      //申请中的挂
      let orApll = row.orderStatus == 1  && (row.hangStatus == 1 || row.hangStatus == 2)
      //审批中的挂
      let orApll_s = row.orderStatus == 2  && (row.hangStatus == 1 || row.hangStatus == 2)
      if (orApll || orApll_s) {
        this.dialogApply = true
        this.hangupReasonFn(row.applyId)
      }
    },
    queryRefusalReasonFn(crmApplayId) {
      // let pararms = {
      //   crmApplayId: crmApplayId
      // }
      this.objRefresed = {}
      api.queryRefusalReason({crmApplayId}).then(res => {
        if(res.data.success) {
          if (res.data.data) {
            this.objRefresed = res.data.data
          }
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
    hangupReasonFn(crmApplayId) {
      // let pararms = {
      //   crmApplayId: crmApplayId
      // }
      this.hangUpObj = {orderNum:''}
      // this.controlHangUpObj = {}
      api.hangupReasonFn({crmApplayId}).then(res => {
        if(res.data.success) {
          this.hangUpObj = Object.assign(this.hangUpObj, res.data.data)
          // this.controlHangUpObj = Object.assign(this.controlHangUpObj, res.data.data)
        } else {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 1500
          });
        }

      })
    },
    queryStatus(){//复活一级原因
      api.queryPageDictionary({name:'复活原因'}).then(res=>{
        if(res.data.success && res.data.data){
        this.options1 = res.data.data
          this.options1.forEach((val,idx)=>{
            val.name = val.name.substring(5)
          })
        } else {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 1500
          });
        }
      })
    },
    queryDictionary(code){ // 复活二级原因
      this.options2 =[]
      api.queryAllDetailOrder({code:code,status:1}).then(res=>{
        if(res.data.success){
          for (var i=0; i < res.data.data.length;i++) {
            this.options2.push(res.data.data[i])
          }
        } else {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 1500
          });
        }
      })
    },
		// changeTest(val) {
		// 	console.log(val,'////////')
		// },
		changeReason(val) {
      this.form.reason2 =''
      this.options2 = []
      if (!val) return
      this.queryDictionary(val)
			// this.form.reason2 = null
			// console.log(val,666)
			// if (val.value == 1) {
			// 	this.options2 = [{name: '请选择',value: null},{name: '员工操作失误',value: 11}]
			// } else if (val.value == 2) {
			// 	this.options2 = [{name: '请选择',value: null},{name: '三方数据库异常导致审批失误',value: 21},{name: '审批导致',value: 22}]
			// } else if (val.value == 3) {
			// 	this.options2 = [{name: '请选择',value: null},{name: '因系统异常或崩溃导致订单超过有效期',value: 31}]
			// } else {
			// 	this.options2 = [{name: '请选择',value: null}]
			// }
			// console.log(this.form)
		},
		// _changeReason(value) {
  			// this.$forceUpdate()
		// },
		clearFn() {
			console.log(1213)
		},
		goOrderDetail(row) {
			var routeData = this.$router.resolve({
	        	path: '/detail/orderDetail',
	        	query: {
	        		crmApplayId: row.crmApplayId,
	        		menuId: this.$route.query.menuId
	            // orderStatus:row.orderStatus
	        	}
	      	});
	      	window.open(routeData.href);
		},
		submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	          //   this.$confirm('复活的订单环节将初始至审批环节信息审核，确认复活吗？', '提示', {
		       //    confirmButtonText: '确定',
		       //    cancelButtonText: '取消',
		       //    type: 'warning',
		       //    closeOnClickModal: false
		       //  }).then(() => {
		        	this.reviveOrderFn()
		     //    }).catch(() => {
		     //      this.$message({
		     //        type: 'info',
		     //        message: '已取消复活'
		     //      });
		     //    });
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	      },
		reviveFn(row) {
      if(row.orderStatus == 5 || row.orderStatus == 10){ //判断是否拒单
        this.$confirm('确认复活吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          this.dialogFormVisible = true
          this.options2 = []
          this.queryStatus()
          this.orderNumber = row.orderNumber
          this.crmApplayId = row.crmApplayId
          this.$nextTick(()=>{
            this.$refs.form.resetFields();
          })
          this.form = Object.assign({},{
			    	crmApplayId:'',
            reason1: '',
            reason2: '',
            remark: ''
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消复活'
          });
        });
      }

		},
		reviveOrderFn(){
			api.reviveOrderFn({
        crmApplayId:this.crmApplayId,
        oneLevelCode:this.form.reason1,
        twoLevelCode:this.form.reason2,
        remark:this.form.remark,
	    	}).then(res=>{
	    		this.dialogFormVisible = false
	 			if(res.data.code == 1){
	 				this.queryAllControlOrderFn()
	 				this.$message.success(res.data.msg);
	 			}else{
	 				this.$message.error(res.data.msg)
	 			}
	 		})
		},
		searchFn() {
			this.tableData = []
		    if(!this.queryPararms){
//		        this.$notify({
//		          title: '提示',
//		          message: '请输入查询条件',
//		          duration: 1500
//		        });
		        return false;
		    }
			this.pageNo = 1
        	this.currentPage = 1
			this.queryAllControlOrderFn()
		},
		queryAllControlOrderFn() {
				

			this.loadingTable = true
			let pararms = {
				queryParam: this.queryPararms,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				currentModuleId: this.$route.query.menuId,
				number: 2,//判断哪个页面(1:审批中订单 2:全部订单)
			}

			api.queryAllControlOrder(pararms).then(res => {
				this.total =0
				this.tableData = []
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
				console.log(res)
			})
		},
		handleSizeChange(val) {
			this.currentPage = 1
      pageSize.setMyPageSize(val)
			// let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
	  		// myPageSize.W_ControlOrder = val
		 	// localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
			this.pageNo = 1
			this.pageSize = val
			this.queryAllControlOrderFn()
	//		console.log(val,777777777777)
		},
		handleCurrentChange(val) {
			this.pageNo = val
      this.currentPage = val
			this.queryAllControlOrderFn()
	//		console.log(val,88888888)
		},
	},
	watch: {
//		queryPararms(val) {
//			if (!val) {
//				this.tableData = []
//			}
//		}
	},
	components: {
//		TitCommon,
//		Search,
		Pagination,
  	}
}
</script>
<style lang="less" scoped>
	.control-wrap {
		.padTopBot20 {
			padding: 8px 0 0;
		}


	}
  .cursorTip{
    color:red;
    cursor:pointer;
  }
</style>
