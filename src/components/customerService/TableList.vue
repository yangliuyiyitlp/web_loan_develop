<template>
 <div class="tableList resetTable_s">
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
      	prop="applicationTime"
      	label="申请时间">
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
      label="归属人">
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
      width="100"
      :show-overflow-tooltip="true"
      align='center'
      prop="custIc"
      label="身份证号">
    </el-table-column>
    <el-table-column
      width="100"
      :show-overflow-tooltip="true"
      align='center'
      prop="custMobile"
      label="手机号码">
    </el-table-column>
    <el-table-column
      v-if="parameter.operatorList"
      :show-overflow-tooltip="true"
      align='center'
      prop="distributionStatus"
      label="状态">
      <template slot-scope="scope">
       <span v-if="scope.row.distributionStatus==1">处理中</span>
        <span v-else>未分配</span>
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
      prop="followupResult"
      label="跟进结果">
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align='center'
      prop="hangTime"
      label="挂起时间">
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align='center'
      width="140px"
      prop="hangLongTime"
      label="挂起时长">
      <template slot-scope="scope">
        <el-button  @click="showResult(scope.row)" type="text" class='followColor fs12'>{{scope.row.hangLongTime}}</el-button >
      </template>
    </el-table-column>
    <el-table-column
      v-if="parameter.operatorList"
      :show-overflow-tooltip="true"
      align='center'
      prop="hangleCustomer"
      label="处理客服">
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align='center'
      fixed="right"
      prop=""
      label="订单详情">
      <template slot-scope="scope">
        <el-button  @click="viewList(scope.row)" type="text" class='followColor fs12'>查看</el-button >
      </template>
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      align='center'
      fixed="right"
      prop=""
      label="开户记录">
      <template slot-scope="scope">
        <el-button  @click="viewOpenRecord(scope.row)" type="text" class='followColor fs12'>查看</el-button >
      </template>
    </el-table-column>
    <el-table-column
      v-if="!parameter.operatorList"
      fixed="right"
      :show-overflow-tooltip="true"
      align='center'
      label="操作">
      <template slot-scope="scope">
        <el-button  @click="followList(scope.row)" type="text" class='followColor fs12'>跟进</el-button >
      </template>
    </el-table-column>
    <el-table-column
      v-if="parameter.operatorList"
      fixed="right"
      :show-overflow-tooltip="true"
      align='center'
      label="操作">
      <template slot-scope="scope">
        <el-button  @click="followNote(scope.row)" type="text" class='followColor fs12'>跟进记录</el-button >
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      :show-overflow-tooltip="true"
      align='center'
      label="录音文件">
      <template slot-scope="scope">
        <el-button  @click="audioShow(scope.row)" type="text" class='followColor fs12'>查看</el-button >
      </template>
    </el-table-column>
  </el-table>
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

export default {
  	name: 'tableList',
  	props: {
      parameter:{
        type: Object,
        default:function () {
          return{
            operatorList:true,
          }
        }
      },
      loadingTable:{
        type: Boolean,
        default:false
      },
      tableData:{
        type: Array,
        default:function () {
          return []
        }
      }
  	},
	data() {
	  	return {

        dialogApply:false,
        hangUpObj:{}
	  	}
	},
    methods: {
      audioShow(row){// 查看录音文件
        this.$emit('dialogAudio',row,true)
      },
      showResult(row){
        this.dialogApply = true
        let pararms = {
          crmApplayId: row.crmApplayId
        }
        this.hangUpObj = {}
        api.hangupReasonFn(pararms).then(res => {
          if(res.data.success) {
//          this.hangUpObj = Object.assign(this.hangUpObj, res.data.data)
this.hangUpObj = res.data.data
            console.log('this.hangUpObj' ,this.hangUpObj)
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }

        })
      },
      followNote(row){ // 跟进记录
        this.$emit('showDialogFollow',row,true)
      },
      viewList(row){ // 查看审批中列表
        var routeData = this.$router.resolve({
          path: '/detail/orderDetail',
          query: {
            crmApplayId: row.crmApplayId,
            menuId: this.$route.query.menuId
          }
        });
//      console.log(row)
//      debugger
        window.open(routeData.href);
      },
      viewOpenRecord(row){//开户记录
        this.$emit('showOpenRecord',row,true)
      },
      followList(row){// 跟进
        this.$emit('showDialogFollow',row,true)
      }
    },


 }
</script>
<style scoped lang="less">

</style>
