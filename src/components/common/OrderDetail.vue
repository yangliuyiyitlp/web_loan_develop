<template>
  <div>
    <div class="top">
    	<div class="iconHead">
    		<img src="../../assets/images/logo.png">
    	</div>
    </div>
    <div class="detail resetTable">
      <div class="sheet">
        <!--1待命,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,8满标以放款,9流标,10退件-->
        <p>
          订单编号：<span>{{orderBaseInfo.orderNumber}}</span>
         <!--<span v-if="orderBaseInfo.custName !=='-'">姓名：{{orderBaseInfo.custName}}</span>-->
            <span v-if="orderBaseInfo.custName !=='-'">姓名：{{orderBaseInfo.custName}}</span>
             <span v-if="orderBaseInfo.custIc !=='-'">身份证号：{{orderBaseInfo.custIc}}</span>
          申请时间：<span>{{orderBaseInfo.createTime}}</span>
          申请城市：<span>{{orderBaseInfo.provId}} {{orderBaseInfo.cityId}}</span>
          状态：
          <!--<span v-if="orderBaseInfo.status == 1">待命</span>-->
             <!--<span v-if="orderBaseInfo.status == 2">审批中</span>-->
             <!--<span v-if="orderBaseInfo.status == 3">还款中</span>-->
             <!--<span v-if="orderBaseInfo.status == 4">已结清</span>-->
             <!--<span v-if="orderBaseInfo.status == 5">拒绝</span>-->
             <!--<span v-if="orderBaseInfo.status == 6">线上筹资中</span>-->
             <!--<span v-if="orderBaseInfo.status == 7">满标</span>-->
             <!--<span v-if="orderBaseInfo.status == 8">满标以放款</span>-->
             <!--<span v-if="orderBaseInfo.status == 9">流标</span>-->
             <!--<span v-if="orderBaseInfo.status == 10">退件</span>-->
          <span v-if='orderBaseInfo.status == 1'>申请中</span>
          <span v-if='orderBaseInfo.status == 2 || orderBaseInfo.status== 6 || orderBaseInfo.status == 7 || orderBaseInfo.status == 8 || orderBaseInfo.status == 9'>审批中</span>
          <span v-if='orderBaseInfo.status == 3'>还款中</span>
          <span v-if='orderBaseInfo.status == 4'>已结清</span>
          <span v-if='(orderBaseInfo.status == 5 || orderBaseInfo.status == 10)'>拒绝</span>

          <a  href="javascript:void(0)" v-if="orderBaseInfo.status==3?0:1">当前环节：<span>{{orderBaseInfo.nodeName}}</span></a>
          订单归属业务员：<span>{{orderBaseInfo.empName}}</span>
          <span class="change-permission" v-if='changePermission'>
					<el-popover
            trigger="click"
            placement="bottom"
            width="160"
            v-model="visiblePer">
					  <div style="text-align: center;font-size: 16px;">
					    <el-button size="mini" @click='visiblePerFn' type="text"  style="font-size: 15px">变更订单归属业务员</el-button>
					  </div>
					  <i class="" ></i>
					  <i class="changePerIcon" slot="reference"></i>
					</el-popover>
    		</span>
        </p>
      </div>
      <div class="params">
        <p>意向借款金额：<span>{{orderBaseInfo.expectMomey}}元</span></p>
        <p>意向借款期限：<span>{{orderBaseInfo.expectDuetime}}期</span></p>
        <p>产品系列：<span>{{orderBaseInfo.cptName}}</span></p>
        <div v-if="status ==1?false:true">
          <p>产品名称：<span>{{orderBaseInfo.cpName}}</span></p> 
          <!-- 产品名称为空时 后面的产品明细也为空，单位也不现实 -->
          <p>产品期数：<span v-if='orderBaseInfo.cpName'>{{orderBaseInfo.periods}}期</span></p>
          <p>合同金额：<span v-if='orderBaseInfo.cpName'>{{orderBaseInfo.contractMoney}}元</span></p>
          <p>产品利率：<span v-if='orderBaseInfo.cpName'>{{orderBaseInfo.rate}}%/月</span></p>
          <!--还款方式((1月付息，到期还本 2.到期一次性还本付息 3.等额本息 4.分期等额 5.等额本金))"-->
          <p>还款方式：<span v-if="orderBaseInfo.payment == 1">月付息，到期还本</span>
            <span v-if="orderBaseInfo.payment == 2">到期一次性还本付息</span>
            <span v-if="orderBaseInfo.payment == 3">等额本息</span>
            <span v-if="orderBaseInfo.payment == 4">分期等额</span>
            <span v-if="orderBaseInfo.payment == 5">等额本金</span></p>
          <p>授信范围：<span v-if='orderBaseInfo.cpName'>{{orderBaseInfo.actualLowerLimit}}<span v-if="orderBaseInfo.actualUpperLimit">-</span>{{orderBaseInfo.actualUpperLimit}}元</span></p>
        </div>
      </div>
      <div class="steps" v-if="orderNodeList.length>=0?1:0">
         <!--<el-steps active=0 align-center  >-->
        <el-steps :active="+currentStep" align-center  >
          <el-step v-for ="(val,index) in orderNodeList" :title="val.nodeName" :description ="index==currentStep ? '' : val.outTime " :key="index" ><i :class="val.stepNum" slot="icon"></i></el-step>
          <!-- <el-step v-for ="(val,index) in orderNodeList" :title="val.nodeName" :description="val.outTime" :key="index" ><i :class="val.stepNum" slot="icon"></i></el-step> -->
        </el-steps>
      </div>
      <el-tabs type="border-card" style="margin-top:35px" @tab-click="tabClick" v-model="activeName">

        <el-tab-pane label="审核记录表"  name="1" v-if="status==2 || status==6 || status==7 || status==8 || status==9 || status==5">
          <el-table
            :data="examData"
            border
            style="width: 100%">
            <el-table-column align='center' type="index"  width="160" label="序号" >
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="taskName"
              label="环节">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="endTime"
              label="操作时间">
               <template  slot-scope="scope"><span>{{scope.row.endTime | formatTimes}}</span></template>
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="startTime"
              label="进入环节时间">
              <template  slot-scope="scope"><span>{{scope.row.startTime | formatTimes}}</span></template>
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="difTime"
              label="停留时长">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="nodeDesc"
              label="结果">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="createUser"
              label="操作人">
            </el-table-column>
          </el-table>
          <!-- <pagination
            :currentPage = 'currentPage'
            :total = 'total'
             :layout='layout'
            @handleSizeChange = 'handleSizeChange'
            @handleCurrentChange = 'handleCurrentChange'
          >
          </pagination> -->
        </el-tab-pane>
        <el-tab-pane label="还款计划" name="2" v-if="status==3">
          <p class="des">
            当期应还总金额：<span>{{OrderAmountt.totalAmount}}元</span>
            当期应还本金：<span>{{OrderAmountt.totalPrincipal}}元</span>
            当期应还利息：<span>{{OrderAmountt.totalInterest}}元</span>
            当期应还罚息：<span>{{OrderAmountt.totalAccrual}}元</span>
            当期应还分期服务费：<span>{{OrderAmountt.totalManagerFee}}元</span>
            提前结清总金额：<span>{{OrderAmountt.amount}}元</span>
          </p>
          <el-table
            :data="RepaymentPlan"
            border
            style="width: 100%">
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="periods"
              label="期数">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="repaymentTime"
              label="应还时间">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="shouldMoney"
              label="应还总金额">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="shouldCapiital"
              label="还款本金">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="shouldAccral"
              label="还款利息">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="manageMoney"
              label="分期服务费">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="overdueMoney"
              label="逾期费用">
            </el-table-column>
            <!--0  待还，1 结清，2 逾期-->
            <el-table-column prop="status" label="状态" align='center'>
              <template slot-scope="scope">
                <span v-if='scope.row.status == 0'>待还</span>
                <span v-if='scope.row.status == 1'>结清</span>
                <span v-if='scope.row.status == 2'>逾期</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            :currentPage = 'currentPage2'
            :total = 'total2'
              :layout='layout'
            @handleSizeChange = 'handleSizeChange2'
            @handleCurrentChange = 'handleCurrentChange2'
          >
          </pagination> -->
        </el-tab-pane>
        <el-tab-pane label="还款记录" name="3" v-if="status==3">
          <p class="des">
            当期应还总金额：<span>{{OrderAmountt.totalAmount}}元</span>
            当期应还本金：<span>{{OrderAmountt.totalPrincipal}}元</span>
            当期应还利息：<span>{{OrderAmountt.totalInterest}}元</span>
            当期应还罚息：<span>{{OrderAmountt.totalAccrual}}元</span>
            当期应还分期服务费：<span>{{OrderAmountt.totalManagerFee}}元</span>
            提前结清总金额：<span>{{OrderAmountt.amount}}元</span>
          </p>
          <el-table
            :data="PaymentHistory"
            border
            style="width: 100%">
            <el-table-column align='center' type="index"  width="160" label="序号" >
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="paymentTime"
              label="还款时间">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="shouldMoney"
              label="还款金额(元)">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              label="还款方式">
              <template  slot-scope="scope"><span>{{scope.row.paymentChannel}}</span></template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            :currentPage = 'currentPage3'
            :total = 'total3'
              :layout='layout'
            @handleSizeChange = 'handleSizeChange3'
            @handleCurrentChange = 'handleCurrentChange3'
          >
          </pagination> -->
        </el-tab-pane>
        <el-tab-pane label="基本信息" name="4" class="tabs" v-if="status==1 ||status==2 ||status==3 ||status==4 || status==6 || status==7 || status==8 || status==9 || status==10 ||status==5">
          <h3>基本信息</h3>
          <table>
            <tr>
              <td>性别</td>
              <td >{{userBaseInfo.icSex == 1?'男':userBaseInfo.icSex == 2?'女':''}}</td>
              <td>发证机关</td>
              <td>{{userBaseInfo.icIssUingAuthority}}</td>
            </tr>
            <tr>
              <td>民族</td>
              <td>{{userBaseInfo.icNation}}</td>
              <td>证件有效期</td>
              <td>{{userBaseInfo.icLimittime}}</td>
            </tr>
            <tr>
              <td>出生日期</td>
              <td>{{userBaseInfo.icBirth}}</td>
              <td>邮箱</td>
              <td>{{userBaseInfo.custEmail}}</td>
            </tr>
            <tr>
              <td>身份证地址</td>
              <td>
              	{{userBaseInfo.nativeProvince }}{{userBaseInfo.nativeCity}}{{userBaseInfo.nativeArea}}{{userBaseInfo.nativeAddress}}
              	<!--{{userBaseInfo.icAddress}}-->
              </td>
              <td>婚属</td>

              <td v-if = 'userBaseInfo.marital == 1'>已婚</td>
			  			<td v-if = 'userBaseInfo.marital == 2'>未婚</td>
			  			<td v-if = 'userBaseInfo.marital == 3'>离异</td>
			  			<td v-if = 'userBaseInfo.marital == 4'>丧偶</td>
			  			<td v-else></td>
            </tr>
            <tr>
              <td>身份证号码</td>
              <td>{{userBaseInfo.icNumber }}</td>
              <td>学历</td>
              <td v-if = 'userBaseInfo.hignestDegree == 1'>硕士及以上</td>
							<td v-if = 'userBaseInfo.hignestDegree == 2'>本科</td>
							<td v-if = 'userBaseInfo.hignestDegree == 3'>大专</td>
							<td v-if = 'userBaseInfo.hignestDegree == 4'>高中</td>
							<td v-if = 'userBaseInfo.hignestDegree == 5'>中专/技校</td>
							<td v-if = 'userBaseInfo.hignestDegree == 6'>初中及以下</td>
							<td v-else></td>
            </tr>
            <tr>
            <td>居住地址</td>
            <td>{{userBaseInfo.houseProvince }}{{userBaseInfo.houseCity }}{{userBaseInfo.houseArea }}{{userBaseInfo.houseAddress }}</td>
          </tr>
            <tr>
              <td>客户归属人</td>
              <td>{{userBaseInfo.empName }}</td>
              <td>归属团队</td>
              <td>{{userBaseInfo.deptName}}</td>
            </tr>

          </table>
          <div class="jobTypeClass" ><div>工作信息<span v-if="jobNature  ==1">工薪者</span><span  v-if="jobNature  ==2">企业经营者</span><span v-if="jobNature  ==3">自由职业者</span><span v-if="jobNature  ==4">学生</span><span v-if="jobNature  ==5">退休人员</span></div></div>
          <table v-if="jobNature ==1">
            <tr>
              <th colspan="4">单位信息</th>
            </tr>
            <tr>
              <td>工作单位</td>
              <td>{{userBaseInfo.companyName}}</td>
              <td>单位地址</td>
              <td>{{userBaseInfo.companyProv}}{{userBaseInfo.companyCity }}{{userBaseInfo.companyArea }}{{userBaseInfo.companyAddress }}</td>

            </tr>
            <tr>
              <th colspan="4">单位联系方式</th>
            </tr>
            <tr>
              <td>座机</td>
              <td>{{userBaseInfo.fixedTelephone}}</td>
              <td>手机</td>
              <td>{{userBaseInfo.companyMobile }}</td>
            </tr>
          </table>
          <table v-if="jobNature ==2">
            <tr>
              <th colspan="4">公司信息</th>
            </tr>
            <tr>
              <td>公司名称</td>
              <td>{{userBaseInfo.companyName}}</td>
              <td>公司地址</td>
              <td>{{userBaseInfo.companyProv}}{{userBaseInfo.companyCity }}{{userBaseInfo.companyArea }}{{userBaseInfo.companyAddress }}</td>
            </tr>
            <tr>
              <th colspan="4">公司联系方式</th>
            </tr>
            <tr>
              <td>座机</td>
              <td>{{userBaseInfo.fixedTelephone}}</td>
              <td>手机</td>
              <td>{{userBaseInfo.companyMobile }}</td>
            </tr>
          </table>
          <table v-if="jobNature ==3">
            <tr>
              <td width="60">收入来源</td>
              <td>{{userBaseInfo.revenueSources}}</td>
              <td width="60">月收入</td>
              <td >{{userBaseInfo.averageMonthlyIncome}} 元</td>
            </tr>
          </table>
          <table v-if="jobNature  ==4 || jobNature  ==5"></table>
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="5" v-if="status==1 ||status==2 ||status==3 ||status==4 || status==6 || status==7 || status==8 || status==9 || status==10 ||status==5" >
          <el-table
            :data="linkInfo"
            border
            style="width: 100%">
            <el-table-column align='center' type="index"  width="160" label=" ">
              <template slot-scope="scope">
                <span> 第{{scope.row.relationTop}}联系人</span>
              </template>
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="relation"
              label="关系">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="phone"
              label="联系电话">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column
              align='center'
              :show-overflow-tooltip="true"
              prop="linkmanIsKnow"
              label="是否允许知晓该借款">
              <template slot-scope="scope">
                <span v-if="scope.row.linkmanIsKnow ==0">是</span>
                <span v-if="scope.row.linkmanIsKnow ==1">否</span>
                <span v-if="scope.row.linkmanIsKnow ==null"></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="账户信息" name="6" class="tabs" v-if="status==1 ||status==2 ||status==3 ||status==4 || status==6 || status==7 || status==8 || status==9 || status==10 ||status==5">
          <table >
            <tr>
              <th colspan="2">江西银行账号信息</th>
            </tr>
            <tr>
              <td width="100">电子账号</td>
              <td>{{accoutInfo.bankAccount}}</td>
            </tr>
            <tr>
              <td width="100">账户余额</td>
              <td>
                <span v-if="!accoutInfo.bankAccount">--</span>
                <span v-if="accoutInfo.bankAccount">
                <span v-if="!eye">{{accountMoney}}</span>
                <span v-if="eye">*****</span>
                	元<i class="el-icon-view" @click="eyeToggle()" v-if="!eye"></i>
                <i  @click="eyeToggle()" v-if="eye">
                	<img class='eyeClosed' src="../../assets/images/icon/eye_closed.png" alt="">
                </i>
             </span>
              </td>
            </tr>
          </table>
          <table >
            <tr>
              <th colspan="2">绑定银行卡</th>
            </tr>
            <tr>
              <td width="100">开户银行</td>
              <td>{{accoutInfo.bankName}}</td>
            </tr>
            <tr>
              <td width="100">银行卡号</td>
              <td>{{accoutInfo.cradNumber}}</td>
            </tr>
            <tr>
              <td width="100">银行预留手机号</td>
              <td>{{accoutInfo.bindCardMobile}}</td>
            </tr>
          </table>
        </el-tab-pane>

      </el-tabs>
      <!--客户分配组织架构弹框--START-->
      <el-dialog title="变更订单归属员" center width='800px' :visible.sync="CustDistributionDialog" :close-on-click-modal ='false'>
        <!--<el-row  type="flex" style='margin-top: -25px;'>-->
          <!--<el-col :span="11" >-->
            <!--<h3 class="titsheet">组织架构</h3>-->
            <!--<div class="mrtop20">-->
              <!--<el-input-->
                <!--clearable-->
                <!--placeholder="根据名称模糊查询"-->
                <!--v-model="ser_department"-->
              <!--&gt;-->
                <!--<el-button slot="append" icon="el-icon-search" @click='search_tree()'></el-button>-->
              <!--</el-input>-->
            <!--</div>-->
            <!--<div class="v-tree-wrap" style="border: 1px solid #dcdfe6;margin-top: 10px;border-radius: 5px;    height: 220px;overflow: auto;">-->
              <!--<v-tree ref='tree' :data='zTreeData' :multiple='false'  :halfcheck='true' @node-click='handleNodeClickCustDis'/>-->
            <!--</div>-->
          <!--</el-col>-->
          <!--<el-col :span="1" >-->
          <!--</el-col>-->
          <!--<el-col :span="12" >-->
            <!--<h3 class="titsheet">员工信息</h3>-->
            <div>
              <el-input placeholder="根据员工工号、姓名模糊查询"  v-model="ser_people" clearable>
                <el-button slot="append" icon="el-icon-search" @click='search_employee()'></el-button>
              </el-input>
            </div>
            <div  style="margin-top: 10px">
              <el-table
                v-loading="loadingTableShow"
                highlight-current-row
                @current-change="handleCurrentSelect"
                :data="tableData_s"
                border
                style="width: 100%">
                <el-table-column
                  v-if="0"
                  align='center'
                  prop="id"
                  label="id">
                </el-table-column>
                <el-table-column
                  align='center'
                  prop="realName"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  align='center'
                  prop="deptName"
                  label="部门">
                </el-table-column>
                <el-table-column
                  align='center'
                  prop="compName"
                  label="公司">
                </el-table-column>
                <el-table-column
                  align='center'
                  prop="username"
                  label="工号">
                </el-table-column>
              </el-table>
              <div style="width: 100%;overflow:auto">
                <pagination
                  :layout='layout'
                  :currentPage = 'currentPage_s'
                  :total = 'total_s'
                  @handleCurrentChange = 'handleCurrentChange_s'
                >
                </pagination>
              </div>
            </div>

          <!--</el-col>-->

        <!--</el-row>-->
        <div class="text-rt">
          <el-button  type="info" @click='CustDistributionDialogFn'>取消</el-button>
          <el-button type="primary" @click='saveDisCust' :loading="orSaveDisCust">保存</el-button>
        </div>
      </el-dialog>
      <!--客户分配组织架构弹框--END-->
    </div>
  </div>
</template>
<script>
import api from "@/api/index.js";
import TitCommon from "@/components/common/TitCommon";
import TableList from "@/components/custManage/TableList";
import Pagination from "@/components/common/Pagination";
export default {
  name: "allList",
  data() {
    return {
      activeName: "",
      tableData_s: [],
      total_s: 0,
      pageSize_s: 10,
      pageNo_s: 1,
      loadingTableShow: false,
      orSaveDisCust: false,
      zTreeData: [],
      // layout: "total, prev, pager, next",
       layout:"total, prev, pager, next, jumper",
      currentPage_s: 1,
      ser_department: "", //搜索的部门
      ser_people: "",
      deptId: "",
      CustDistributionDialog: false,
      visiblePer: false,
      orderBaseInfo: {},
      userBaseInfo: {},
      accoutInfo: {},
      linkInfo: [],
      PaymentHistory: [], //还款记录列表
      RepaymentPlan: [], //还款计划列表
      buttonLoading: false,
      // apply_state:true,
      eye: true,
      money: "2500",
      status: "",
      examData: [],
      planData: [],
      recordData: [],
      tableData: [],
      jobNature: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      currentPage: 1,
      pageSize2: 10,
      pageNo2: 1,
      total2: 0,
      currentPage2: 1,
      pageSize3: 10,
      pageNo3: 1,
      total3: 0,
      currentPage3: 1,
      orderNodeList: [],
      orderList: [],
      OrderAmountt: {},
      currentStep: "",
      accountMoney: null,
      changePermission: false,
      employeeId: "",
      isTabClick1: true,
      isTabClick2: true,
      isTabClick3: true,
      isTabClick4: true,
      isTabClick5: true,
      isTabClick6: true
    };
  },
  components: {
    Pagination
  },
  beforeCreate() {
    let pararms = {
      menuId: this.$route.query.menuId
    };
    //			var s=new Date()
    this.$store.dispatch("SET_POWER_BTN_ARR", pararms).then(res => {
      //注意：assigningCustomers，frozenCustomer，updateOrderAttachEmp写死的，前端不可以轻易变更
      //assigningCustomers:分配客户权限, "frozenCustomer：冻结按钮权限,//updateOrderAttachEmp:变更业务员权限按钮
      //				var d=new Date()
      if (res) {
        const flag = res.indexOf("updateOrderAttachEmp");
        if (flag > -1) {
          this.changePermission = true;
        } else {
          this.changePermission = false;
        }
      }
      //			console.log(d-s)
      //			console.log(this.permission,'=====4544545=========')
      //			console.log(flag,'=====4544545=========')
    });
  },
  mounted() {
    // this.addViewTags()
    this.queryBaseOrderInfo();
    // this.getDepartmentZtreeFn()
    // this.queryNodeListInfo()  后请求
  },
  methods: {
    //    async addViewTags() {
    //      this.queryBaseOrderInfo()
    //      await   this.queryNodeListInfo()
    //    },
    queryAccountBalanceFn() {
      //账户余额
      api
        .queryAccountBalance({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          if (res.data.success) {
            this.accountMoney = res.data.data;
          } else {
            this.$notify({
              title: "提示",
              message: "获取失败，请重新获取",
              duration: 1500
            });
          }
        });
    },
    queryNodeListInfo() {
      // 查询订单节点信息
      api
        .queryNodeListInfo({
          crmApplayId: this.$route.query.crmApplayId,
          orderStatus: this.status
          // orderStatus:this.$route.query.orderStatus
        })
        .then(res => {
          console.log(666666, this.status);
          if (res.data.code == 1 && res.data.data != null) {
            console.log(8989, res);
            this.orderNodeList = res.data.data.orderNodeList;
            this.orderList = res.data.data.nodeList;
            let currentNode = this.orderList.find(function(item) {
              return item.status == "0";
            });
            if (this.orderList.length <= 0) {
              this.currentStep = 0;
            } else {
              this.orderNodeList.forEach((item, index) => {
                if (currentNode && item.nodeCode == currentNode.nodeCode) {
                  this.currentStep = index;
                }
              });
            }

            for (let i = 0; i < this.orderNodeList.length; i++) {
              for (let j = 0; j < this.orderList.length; j++) {
                if (
                  this.orderNodeList[i].nodeCode == this.orderList[j].nodeCode
                ) {
                  this.orderNodeList[i].outTime = this.orderList[j].outTime;
                }
              }
            }
          } else {
            this.$notify({
              title: "提示",
              message: res.data.msg,
              duration: 1500
            });
          }
        });
    },
    queryExamData() {
      //审批记录
      api
        .queryExamDataList({
          // pageSize: this.pageSize,
          // pageNo: this.pageNo,
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          this.total = 0;
          this.examData = [];
          if (res.data.success ) {
            this.total = res.data.total;
            this.examData = res.data.data;
          } else if(res.data.msg=='暂无信息！'){
             this.total = 0
            this.examData = []
          }
          // else{
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    queryRepaymentPlan() {
      //还款计划
      api
        .queryRepaymentPlan({
          // pageSize: this.pageSize2,
          // pageNo: this.pageNo2,
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          this.total2 = 0;
          this.RepaymentPlan = [];
          if (res.data.success) {
            this.total2 = res.data.total;
            this.RepaymentPlan = res.data.data;
          }  else if(res.data.msg=='暂无信息！'){
             this.total2 = 0
            this.RepaymentPlan =[]
          }
          // else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    queryPaymentHistory() {
      //还款记录
      api
        .queryPaymentHistory({
          // pageSize: this.pageSize3,
          // pageNo: this.pageNo3,
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          this.total3 = 0;
          this.PaymentHistory = [];
          if (res.data.success) {
            this.total3 = res.data.total;
            this.PaymentHistory = res.data.data;
          }   else if(res.data.msg=='暂无信息！'){
             this.total3 = 0
            this.PaymentHistory = []
          }
          // else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    queryQueryOrderAmountt() {
      api
        .queryQueryOrderAmountt({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          if (res.data.success) {
            this.OrderAmountt = res.data.data;
          } else {
            this.$notify({
              title: "提示",
              message: res.data.msg,
              duration: 1500
            });
          }
        });
    },
    queryBaseOrderInfo() {
      api
        .queryBaseOrderInfo({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          console.log(res.data.data, 888888888888);
          if (res.data.success) {
            if (res.data.code == 1 && res.data.data != null) {
              this.orderBaseInfo = Object.assign(
                this.orderBaseInfo,
                res.data.data
              );
              this.status = res.data.data.status;
              this.queryNodeListInfo();
              console.log(55555555, res.data);
              if (this.status == 3) {
                this.activeName = "2";
                this.queryRepaymentPlan(); //还款计划a
                this.queryQueryOrderAmountt();
                this.isTabClick2 = false;
              } else if (
                this.status == 2 ||
                this.status == 6 ||
                this.status == 7 ||
                this.status == 8 ||
                this.status == 9 ||
                this.status == 5
              ) {
                this.activeName = "1";
                this.queryExamData(); //审批记录 2,6,7,8,9
                this.isTabClick1 = false;
              } else {
                this.activeName = "4";
                this.queryEssentialInfo(); //基本信息
                this.isTabClick4 = false;
              }
              // this.crmCustInfoId_s = res.data.data.crmCustInfoId
            } else {
              this.$notify({
                title: "提示",
                message: res.data.msg,
                duration: 1500
              });
            }
          } else {
            this.$notify({
              title: "提示",
              message: res.data.msg,
              duration: 1500
            });
          }
        });
    },
    queryEssentialInfo() {
      // 基本信息
      api
        .queryEssentialInfo({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          if (res.data.success) {
            this.userBaseInfo = res.data.data;
            this.jobNature = res.data.data.jobNature;
          }   else if(res.data.msg=='暂无信息！'){
            this.userBaseInfo = {}
            this.jobNature = ''
          } 
          // else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    queryLinkManInfo() {
      //联系人信息
      api
        .queryLinkManInfo({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          if (res.data.success) {
            this.linkInfo = res.data.data;
          }   else if(res.data.msg=='暂无信息！'){
            this.linkInfo = []
          }  
          // else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    queryAccountInfo() {
      //账户信息
      api
        .queryAccountInfo({
          crmApplayId: this.$route.query.crmApplayId
        })
        .then(res => {
          if (res.data.success) {
            this.accoutInfo = res.data.data;
          }    else if(res.data.msg=='暂无信息！'){
            this.accoutInfo = {}
          } 
          // else {
          //   this.$notify({
          //     title: "提示",
          //     message: res.data.msg,
          //     duration: 1500
          //   });
          // }
        });
    },
    tabClick(tab, even) {
      console.log(tab, even);
      if (tab.name == "4" && this.isTabClick4) {
        //基本信息
        this.queryEssentialInfo();
        this.isTabClick4 = false;
        this.isTabClick1 = true;
        this.isTabClick2 = true;
        this.isTabClick3 = true;
        this.isTabClick5 = true;
        this.isTabClick6 = true;
      } else if (tab.name == "5" && this.isTabClick5) {
        //联系人信息
        this.queryLinkManInfo();
        this.isTabClick5 = false;
        this.isTabClick1 = true;
        this.isTabClick2 = true;
        this.isTabClick3 = true;
        this.isTabClick4 = true;
        this.isTabClick6 = true;
      } else if (tab.name == "6" && this.isTabClick6) {
        // 账户信息
        this.queryAccountInfo();
        this.isTabClick6 = false;
          this.isTabClick1 = true;
        this.isTabClick2 = true;
        this.isTabClick3 = true;
        this.isTabClick5 = true;
        this.isTabClick4= true;
      } else if (tab.name == "1" && this.isTabClick1) {
        // 审批记录
        this.queryExamData();
        this.isTabClick1 = false;
          this.isTabClick4 = true;
        this.isTabClick2 = true;
        this.isTabClick3 = true;
        this.isTabClick5 = true;
        this.isTabClick6 = true;
      } else if (tab.name == "2" && this.isTabClick2) {
        // 还款计划
        this.queryRepaymentPlan();
        this.queryQueryOrderAmountt();
        this.isTabClick2 = false;
          this.isTabClick1 = true;
        this.isTabClick4 = true;
        this.isTabClick3 = true;
        this.isTabClick5 = true;
        this.isTabClick6 = true;
      } else if (tab.name == "3" && this.isTabClick3) {
        //还款记录
        this.queryPaymentHistory();
        this.isTabClick3 = false;
          this.isTabClick1 = true;
        this.isTabClick2 = true;
        this.isTabClick4 = true;
        this.isTabClick5 = true;
        this.isTabClick6 = true;
      }
    },
    // indexMethod(index){
    //   var a = `第${index+1}联系人`
    //   return a;
    // },
    eyeToggle() {
      if (this.eye == false) {
        this.eye = true;
      } else {
        this.eye = false;
        this.queryAccountBalanceFn();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.currentPage = 1;
      this.queryExamData();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.currentPage = val;
      this.queryExamData();
    },
    handleSizeChange2(val) {
      this.pageSize2 = val;
      this.pageNo2 = 1;
      this.currentPage2 = 1;
      this.queryRepaymentPlan();
    },
    handleCurrentChange2(val) {
      this.pageNo2 = val;
      this.currentPage2 = val;
      this.queryRepaymentPlan();
    },
    handleSizeChange3(val) {
      this.pageSize3 = val;
      this.pageNo3 = 1;
      this.currentPage3 = 1;
      this.queryPaymentHistory();
    },
    handleCurrentChange3(val) {
      this.pageNo3 = val;
      this.currentPage3 = val;
      this.queryPaymentHistory();
    },
    //       search_tree() {
    //         this.$refs.tree.searchNodes(this.ser_department)
    // //  		console.log(this.treeData)
    //       },
    saveDisCust() {
      this.$confirm("此操作将是保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
         closeOnClickModal: false
      })
        .then(() => {
          console.log(111212);

          this.cuntomerDistributionFn();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存"
          });
        });
    },
    CustDistributionDialogFn() {
      //取消保存：变更业务归属人
      this.employeeId = "";
      this.CustDistributionDialog = false;
    },
    cuntomerDistributionFn() {
      //变更业务归属人
      //      console.log(bbb);
      if (!this.employeeId) {
        this.$notify({
          title: "提示",
          message: "请先选择需要变更的人员信息",
          duration: 1500
        });
        return;
      }
      this.orSaveDisCust = true;
      let parsrms = {
        crmApplayId: this.$route.query.crmApplayId,
        employeeId: this.employeeId
      };

      console.log(parsrms);
      api.cuntomerChangeSalesman(parsrms).then(res => {
        this.orSaveDisCust = false;
        this.employeeId = "";
        if (res.data.success) {
          this.CustDistributionDialog = false;
          this.queryBaseOrderInfo();
        } else {
          this.CustDistributionDialog = true;
        }
        this.$notify({
          title: "提示",
          message: res.data.msg,
          duration: 1500
        });
      });
    },
    visiblePerFn() {
      this.CustDistributionDialog = true;
      this.pageNo_s = 1;
      this.currentPage_s = 1;
      this.ser_people = "";
      this.queryCustDistributionByDeptIdFn();
    },
    handleSizeChange_s(val) {
      this.currentPage_s = 1;
      this.pageNo_s = 1;
      this.pageSize_s = val;
      this.queryCustDistributionByDeptIdFn();
      console.log(val, 777777777777);
    },
    handleCurrentChange_s(val) {
      this.pageNo_s = val;
      this.currentPage_s = val;
      this.queryCustDistributionByDeptIdFn();
      console.log(val, 88888888);
    },
    //       handleNodeClick(data) {
    //         console.log(data,'ssssddddd')
    //         this.search.partName = data.title
    //         this.showTree = false
    // //	        console.log(data,6664444455555);
    //       },
    // handleNodeClickCustDis(data){
    //   this.ser_department = data.name
    //   console.log(data.id,6664444455555);
    //   this.deptId = data.id
    //   this.queryCustDistributionByDeptIdFn()
    // },
    handleCurrentSelect(val) {
      if (val) {
        console.log(88888888888888, val);
        this.employeeId = val.id;
      }
      console.log(val, 65656655);
    },

    search_employee() {
      this.currentPage_s = 1;
      this.pageNo_s = 1;
      this.queryCustDistributionByDeptIdFn();
    },
    queryCustDistributionByDeptIdFn() {
      // this.tableData_s= []
      let pararms = {
        pageNo: this.pageNo_s,
        pageSize: this.pageSize_s,
        // deptId: this.deptId,
        username: this.ser_people
      };
      this.loadingTableShow = true;
      api.queryCustDistributionByDeptId(pararms).then(res => {
        console.log(res, "-=-=-=-=6666");
        this.total_s = 0;
        this.tableData_s = [];
        this.loadingTableShow = false;
        if (res.data.success) {
          this.total_s = res.data.total;
          this.tableData_s = res.data.data;

          console.log(res.data.data);
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
      //	    	console.log(data)
    }
    //       getDepartmentZtreeFn() {
    //         api.getDepartmentZtree({groupId:''}).then(res => {
    //           if(res.data.status == 1) {
    // //					this.treeData = res.data.ztree
    //             this.zTreeData = this.toTree(res.data.ztree)
    //           } else {
    //             this.$notify({
    //               title: '提示',
    //               message: res.data.msg,
    //               duration: 1500
    //             });
    //           }
    //           //			console.log(this.zTreeData,123)
    //         })
    //       },
    //       toTree(ary, data) {
    //         var _this = this
    //         var data = data ? data : (function(ary) {
    //           var tempAry = [];
    //           var idList = [];
    //           ary.forEach(function(item) {
    //             idList.push(item.id)
    //           });
    //           for(var i = 0, len = ary.length; i < len; i++) {
    //             if(ary[i].pId == undefined || (ary[i].pId != undefined && _this.debFn(ary[i].pId, idList))) {
    //               var obj = {
    //                 title: ary[i].name,
    //                 id: ary[i].id
    //               };
    //               tempAry.push(obj);
    //             }
    //           }
    //           return tempAry;
    //         }(ary));
    //         var temp = 0;
    //         if(data.constructor == Array) {
    //           for(var i = 0, len = data.length; i < len; i++) {
    //             for(var j = 0, lenA = ary.length; j < lenA; j++) {
    //               if(ary[j].pId == data[i].id) {
    //                 var obj = {
    //                   title: ary[j].name,
    //                   id: ary[j].id
    //                 };
    //                 data[i].children = data[i].children || [];
    //                 data[i].children.push(obj);
    //                 temp++;
    //               }
    //             }
    //           }
    //         }
    //         if(temp > 0) {
    //           if(data.constructor == Array) {
    //             for(var n = 0, lenB = data.length; n < lenB; n++) {
    //               data[n].children = this.toTree(ary, data[n].children ? data[n].children : []);
    //               if(data[n].children.length == 0) {
    //                 delete data[n].children;
    //               }
    //               //							delete data[n].id;
    //             }
    //           }
    //         } else {
    //           for(var n = 0, lenB = data.length; n < lenB; n++) {
    //             //						delete data[n].id;
    //           }
    //         }
    //         return data;
    //
    //       },
    //       debFn(id, idList) {
    //         var flag = true;
    //         for(var ida in idList) {
    //           if(id == idList[ida]) {
    //             flag = false;
    //           }
    //         }
    //         return flag;
    //       },
  }
};
</script>
<style lang="less">
.el-step__title.is-process {
  font-weight: 500;
}
.el-step.is-center .el-step__description {
  padding-left: 0%;
  padding-right: 0%;
  color: #c2c2c2;
  width: 100%;
}
.steps {
  .is-finish .el-step__icon.is-text {
    border: 1px solid #02abff;
    background-color: #02abff;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .el-step__icon.is-text {
    border: 1px solid #dbe1e8;
    background-color: #fff;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .is-process .el-step__icon.is-text {
    border: 1px solid #ff9f23;
    background-color: #ff9f23;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .el-step__title.is-finish {
    color: #02abff;
  }
  .el-step__title.is-process {
    color: #ff9f23;
  }
  .step1,
  .step2,
  .step3,
  .step4,
  .step5,
  .step6,
  .step7,
  .step8,
  .step9,
  .step10,
  .step11,
  .step12,
  .step13,
  .step14,
  .step15,
  .step16,
  .step17,
  .step18 {
    width: 22px;
    height: 23px;
  }
  .step1 {
    background: url("../../assets/images/icons_s1.png") no-repeat -3px -150px;
  }
  .is-finish .is-text .step1,
  .is-process .is-text .step1 {
    background: url("../../assets/images/icons_s1.png") no-repeat -4px -189px;
  }
  .step2 {
    background: url("../../assets/images/icons_s1.png") no-repeat -42px -150px;
  }
  .is-finish .is-text .step2,
  .is-process .is-text .step2 {
    background: url("../../assets/images/icons_s1.png") no-repeat -42px -189px;
  }
  .step3 {
    background: url("../../assets/images/icons_s1.png") no-repeat -81px -151px;
  }
  .is-finish .is-text .step3,
  .is-process .is-text .step3 {
    background: url("../../assets/images/icons_s1.png") no-repeat -80px -189px;
  }
  .step4 {
    background: url("../../assets/images/icons_s1.png") no-repeat -119px -151px;
  }
  .is-finish .is-text .step4,
  .is-process .is-text .step4 {
    background: url("../../assets/images/icons_s1.png") no-repeat -119px -189px;
  }
  .step5 {
    background: url("../../assets/images/icons_s1.png") no-repeat -157px -151px;
  }
  .is-finish .is-text .step5,
  .is-process .is-text .step5 {
    background: url("../../assets/images/icons_s1.png") no-repeat -159px -189px;
  }
  .step6 {
    background: url("../../assets/images/icons_s1.png") no-repeat -195px -150px;
  }
  .is-finish .is-text .step6,
  .is-process .is-text .step6 {
    background: url("../../assets/images/icons_s1.png") no-repeat -195px -189px;
  }
  .step7 {
    background: url("../../assets/images/icons_s1.png") no-repeat -233px -150px;
  }
  .is-finish .is-text .step7,
  .is-process .is-text .step7 {
    background: url("../../assets/images/icons_s1.png") no-repeat -233px -189px;
  }
  .step8 {
    background: url("../../assets/images/icons_s1.png") no-repeat -272px -150px;
  }
  .is-finish .is-text .step8,
  .is-process .is-text .step8 {
    background: url("../../assets/images/icons_s1.png") no-repeat -272px -190px;
  }
  .step9 {
    background: url("../../assets/images/icons_s1.png") no-repeat -310px -150px;
  }
  .is-finish .is-text .step9,
  .is-process .is-text .step9 {
    background: url("../../assets/images/icons_s1.png") no-repeat -310px -189px;
  }
  .step10 {
    background: url("../../assets/images/icons_s1.png") no-repeat -349px -152px;
  }
  .is-finish .is-text .step10,
  .is-process .is-text .step10 {
    background: url("../../assets/images/icons_s1.png") no-repeat -349px -190px;
  }
  .step11 {
    background: url("../../assets/images/icons_s1.png") no-repeat -3px -4px;
  }
  .is-finish .is-text .step11,
  .is-process .is-text .step11 {
    background: url("../../assets/images/icons_s1.png") no-repeat -4px -42px;
  }
  .step12 {
    background: url("../../assets/images/icons_s1.png") no-repeat -42px -5px;
  }
  .is-finish .is-text .step12,
  .is-process .is-text .step12 {
    background: url("../../assets/images/icons_s1.png") no-repeat -42px -42px;
  }
  .step13 {
    background: url("../../assets/images/icons_s1.png") no-repeat -80px -5px;
  }
  .is-finish .is-text .step13,
  .is-process .is-text .step13 {
    background: url("../../assets/images/icons_s1.png") no-repeat -80px -42px;
  }
  .step14 {
    background: url("../../assets/images/icons_s1.png") no-repeat -119px -4px;
  }
  .is-finish .is-text .step14,
  .is-process .is-text .step14 {
    background: url("../../assets/images/icons_s1.png") no-repeat -119px -42px;
  }
  .step15 {
    background: url("../../assets/images/icons_s1.png") no-repeat -158px -5px;
  }
  .is-finish .is-text .step15,
  .is-process .is-text .step15 {
    background: url("../../assets/images/icons_s1.png") no-repeat -158px -43px;
  }
  .step16 {
    background: url("../../assets/images/icons_s1.png") no-repeat -197px -5px;
  }
  .is-finish .is-text .step16,
  .is-process .is-text .step16 {
    background: url("../../assets/images/icons_s1.png") no-repeat -197px -42px;
  }
  .step17 {
    background: url("../../assets/images/icons_s1.png") no-repeat -235px -5px;
  }
  .is-finish .is-text .step17,
  .is-process .is-text .step17 {
    background: url("../../assets/images/icons_s1.png") no-repeat -235px -42px;
  }
  .step18 {
    background: url("../../assets/images/icons_s1.png") no-repeat -271px -5px;
  }
  .is-finish .is-text .step18,
  .is-process .is-text .step18 {
    background: url("../../assets/images/icons_s1.png") no-repeat -273px -43px;
  }
}
.el-step.is-horizontal .el-step__line {
  top: 18px;
}
.eyeClosed {
  cursor: pointer;
  width: 12px;
  height: 12px;
}
.jobTypeClass {
  margin: 10px 0;
  border-bottom: #ccc dotted 1px;
  padding-bottom: 10px;
  div {
    display: inline-block;
  }
  span {
    color: #409eff;
    font-size: 12px;
    margin: 0 15px;
  }
}
.top {
  width: 100%;
  height: 64px;
  background: #31afff;
  padding-top: 1px;
  margin-bottom: 20px;
  img {
    width: 100%;
  }
  .iconHead {
    width: 173px;
    height: 48px;
    margin-top: 6px;
    margin-left: 20px;
  }
}
.detail {
  width: 1300px;
  margin: 20px auto;
  .sheet {
    background: #f7f7f7;
    border-radius: 10px;
    padding: 20px 15px;
    font-size: 12px;
    span {
      margin-right: 20px;
    }
    a {
      cursor: default;
      color: #000;
    }
    .change-permission {
      float: right;
      margin-right: -30px;
      cursor: pointer;
    }
    .changePerIcon {
      display: inline-block;
      background: url("../../assets/images/changePer.png") no-repeat 0 0;
      width: 20px;
      height: 22px;
      background-size: 100%;
      margin-top: -2px;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
  .params {
    border-radius: 8px;
    border: #ddd solid 1px;
    padding: 20px;
    margin: 20px;
    overflow: hidden;
    font-size: 13px;
    p {
      float: left;
      margin: 15px 0;
      width: 200px;
      span {
      }
    }
    div {
      p:last-child {
        width: 400px;
      }
    }
  }
  .tabs {
    h3 {
      margin: 10px 0;
      border-bottom: #ccc dotted 1px;
      padding-bottom: 10px;
    }
    table {
      font-size: 12px;
      width: 100%;
      margin-bottom: 20px;
      td {
        padding: 10px;
        &:nth-child(even) {
          color: #666;
        }
      }
      th {
        padding: 10px;
        background: #f7f7f7;
        text-align: left;
      }
    }
  }
  .el-icon-view {
    padding-left: 10px;
    cursor: pointer;
  }
  .steps {
    font-size: 12px;
    .el-step__title {
      font-size: 12px;
    }
  }
  .des {
    font-size: 12px;
    color: #666;
    margin: 5px 0 20px;
    padding-left: 5px;
    span {
      color: #222;
      padding-right: 20px;
    }
  }
}
</style>
