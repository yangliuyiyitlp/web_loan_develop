<template>
  <div class="order-list-wrap ">
    <el-dialog
      :close-on-click-modal ='false'
      width='60%'
      title=""
      :visible.sync="dialogFollow.dialogFollowVisible"
    >
      <div class="title">跟进记录</div>
      <p class="mrtop20" v-if="dialogFollow.myOrderList">
        <el-button type="primary" @click='followWrap'>新增跟进</el-button>
      </p>
      <div class="wrap-list table-wraps">
        <el-table
          border
          :data="arrData">
          <el-table-column
            label="序号"
            type="index"
            align='center'
            width="80">
          </el-table-column>
          <el-table-column prop="followNode" label="跟进环节" align='center'>
            <template slot-scope="scope">
              <span v-if='scope.row.followNode == 1'>贷前</span>
              <span v-if='scope.row.followNode == 2'>监测</span>
              <span v-if='scope.row.followNode == 3'>贷后</span>
              <span v-if='scope.row.followNode == 4'>ERP贷后</span>
              <span v-if='scope.row.followNode == 5'>实名升级</span>
              <span v-if='scope.row.followNode == 6'>信息申请</span>
              <span v-if='scope.row.followNode == 7'>视频面审</span>
              <span v-if='scope.row.followNode == 8'>开户</span>
            </template>
          </el-table-column>
          <el-table-column prop="followType" label="跟进形式" align='center'>
            <template slot-scope="scope"  >
              <span v-if="scope.row.followNode == 2">
                <span  v-if='scope.row.monitorType == 1'>常规监测</span>
              <span v-if='scope.row.monitorType == 2'>上门回访</span>
              </span>

              <span  v-if="scope.row.followNode == 1 || scope.row.followNode == 3 || scope.row.followNode == 4 || scope.row.followNode == 5 || scope.row.followNode == 6 || scope.row.followNode == 7 || scope.row.followNode == 8">
                <!-- <span v-if='scope.row.followType == 1'>电话</span> -->
                <!-- <span v-if='scope.row.followType == 2'>外访</span> -->
                <!-- <span v-if='scope.row.followType == 3'>活动</span> -->
                 <span>{{scope.row.followType}}</span>
              </span>
            </template>

          </el-table-column>

          <el-table-column prop="followTime" label="跟进时间" align='center'>
          </el-table-column>
          <el-table-column prop="followContent" label="跟进内容" align='center'>
            <template slot-scope="scope">
              <span class="btn-color" @click="showDifferDialog(scope.row,scope.row.followNode)">查看</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作日期" align='center'>
          </el-table-column>
          <el-table-column prop="realName" label="操作人" align='center'>
          </el-table-column>
        </el-table>
        <div class="pagWrap">
          <pagination
            :currentPage = 'currentPage'
            :total = 'total'
            :layout='layout'
            @handleSizeChange = 'handleSizeChange'
            @handleCurrentChange = 'handleCurrentChange'
          >
          </pagination>
        </div>
      </div>
    </el-dialog>
    <div class="follow-wrap">
      <!--①新增跟进弹框--START-->
      <el-dialog title="新增跟进" width='400px'  center :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="form" ref="form" :rules="form_rules"   class="customerDialogForm">
          <el-form-item label="注册手机号：" :label-width="formLabelWidth" prop="custMobile">
            {{form.custMobile}}
           <el-button type='text' v-loading='callPhoLoading'> <i class="el-icon-phone-outline" @click="callPho"></i></el-button> 
          </el-form-item>
          <el-form-item label="跟进环节：" :label-width="formLabelWidth" prop="followNode">
             <span v-if='form.followNode == 5'>实名升级</span>
             <span v-if='form.followNode == 6'>信息申请</span>
             <span v-if='form.followNode == 7'>视频面审</span>
             <span v-if='form.followNode == 8'>开户</span>
          </el-form-item>
          <el-form-item label="跟进日期：" :label-width="formLabelWidth" prop="followTime">
            <el-date-picker
              v-model="form.followTime"
              :picker-options="follow_pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="跟进形式：" :label-width="formLabelWidth" prop="followType">
            <el-select v-model="form.followType" placeholder="请选择">
              <el-option label="电话" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="跟进结果：" :label-width="formLabelWidth" prop="followupResult">
            <el-select v-model="form.followupResult" value-key="id" placeholder="请选择">
              <el-option
                v-for="item in followupResultList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进内容：" :label-width="formLabelWidth" prop="followContent">
            <el-input type="textarea" v-model.trim="form.followContent" :maxlength='200' :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <div class='text-rt'>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm_follow(form)" :loading='saveFollow'>确 定</el-button>
          </div>
        </div>
      </el-dialog>

      <!--①新增跟进弹框--START-->

      <!--主叫号码-->
      <el-dialog title="主叫号码" width='400px'  center :visible.sync="dialogCallVisible" :close-on-click-modal="false" @close ='callFormClose(callForm)'>
        <el-form :model="callForm" ref="callForm" :rules="form_rules"   class="customerDialogForm">

          <el-form-item label="固定话机ID：(拨#00查询)：" label-width="200px" prop="callerid">
            <el-input type="text" v-model.trim="callForm.callerid" :maxlength='50'  @input='checkNumMin'></el-input>
          </el-form-item>
          <el-form-item label="主叫号码(选填)：" label-width="200px" >
            <el-input type="text" v-model.trim="callForm.caller" :maxlength='50'  @input='checkNum'></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <div class='text-rt'>
            <el-button @click="dialogCallVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm_call(callForm)" :loading='saveFollow'>确定</el-button>
          </div>
        </div>
      </el-dialog>
      <!--新增跟进弹框--END-->

      <!--①开户记录--START-->
      <el-dialog title="开户记录" width='900px'  center :visible.sync="dialogFollow.dialogOpenRecord" :close-on-click-modal="false">
        <div class="wrap-list table-wraps">
          <el-table
            border
            :data="openRecordData">

            <el-table-column prop="openAccountTime" label="开户时间" align='center'  :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="openResult" label="开户结果" align='center'>
            </el-table-column>

            <el-table-column prop="reason" label="失败原因" align='center'>
              <template slot-scope="scope">
                <span v-if="(scope.row.openResult == '失败')" class="btn-color btncursor" @click="showRejectInfo(scope.row)">查看</span>
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" label="绑定银行卡号" align='center'  :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="mobile" label="银行预留手机号" align='center'>
            </el-table-column>
            <el-table-column prop="bankName" label="绑定银行" align='center'>
            </el-table-column>
          </el-table>
          <div class="pagWrap">
            <pagination
              :currentPage = 'currentPage1'
              :total = 'total1'
              :layout='layout'
              @handleSizeChange = 'handleSizeChange1'
              @handleCurrentChange = 'handleCurrentChange1'
            >
            </pagination>
          </div>
        </div>
      </el-dialog>
      <!--开户记录--END-->

      <!--失败原因start-->
      <el-dialog title="失败原因" width='360px' center :visible.sync="DialogShowRejectInfo" :close-on-click-modal="false">
        <a href="javascript:void(0)" class="wordWrap">{{reason}}</a>
      </el-dialog>
      <!--失败原因end-->


      <!--贷前弹框--START-->
      <el-dialog title="查看跟进内容" width='360px' center :visible.sync="dialogLoan" :close-on-click-modal="false">
	      <div v-loading="loadingDialog">
	      	<span>{{observeObj.followContent}}</span>
	      	<div class ='miniList' v-if="dialogFollow.dialogButton" @click="dialogLoan = false">
	      		<el-button type="info" class="cancel" >取消</el-button>
	      		<el-button type="primary" class="modify">确定</el-button>
	      	</div>	      	
	      </div>  
      </el-dialog>
      <!--贷前弹框--END-->
      <!--//监测弹框--START-->
      <el-dialog title="查看跟进" width='700px' center :visible.sync="dialogObserve" >
        <div v-loading="loadingDialog">
					<p class="observe">
						监测时间：{{observeObj.followTime}}
						<!--monitorType (integer, optional): 监测方式 ：1.常规监测 2.上门回访-->
						<span class="rt">监测方式：{{observeObj.monitorType == 1? '常规监测' : '上门回访'}}</span>
					</p>
					<div class="padTop20 borBot1px dialogLoanEnd" style='margin-top: -25px;'><br>
						<el-row>
							<el-col :span="5">是否失联：</el-col>
							<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
							<el-col :span="19">
								<span class="common-space">{{observeObj.disappearStatus == 0? '否' : '是'}}</span>
								<span class="common-space">{{observeObj.disappearRemark}}</span>
							</el-col>
						</el-row><br>
						<el-row>
							<el-col :span="5">是否异常：</el-col>
							<el-col :span="19">
								<span class="common-space">{{observeObj.expectionStatus == 0? '否' : '是'}}</span>
								<span class="common-space">{{observeObj.expectionRemark}}</span>
							</el-col>
						</el-row><br>
						<div v-if="observeObj.monitorType == 2">
							<el-row>
								<el-col :span="5">上门回访家庭地址：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.homeProvinceId}}</span>
									<span class="common-space">{{observeObj.homeCityId}}</span>
									<span class="common-space">{{observeObj.homeDistrictId}}{{observeObj.homeAddress}}</span>
								</el-col>
							</el-row><br>
							<el-row>
								<el-col :span="5">地址是否变化：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.homeChangeStatus == 0? '否' : '是'}}</span>
									<span class="common-space">{{observeObj.homeChangeRemark}}</span>
								</el-col>
							</el-row><br>
							<el-row>
								<el-col :span="5">地址是否异常：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.comExceptionStatus == 0? '否' : '是'}}</span>
									<span class="common-space">{{observeObj.comExceptionRemark}}</span>
								</el-col>
							</el-row><br>
							<el-row>
								<el-col :span="5">上门回访公司地址：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.comProvinceId}}</span>
									<span class="common-space">{{observeObj.comCityId}}</span>
									<span class="common-space">{{observeObj.comDistrictId}}</span>
									<span class="common-space">{{observeObj.comAddress}}</span>
								</el-col>
							</el-row><br>
							<el-row>
								<el-col :span="5">地址是否变化：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.comChangeStatus == 0? '否' : '是'}}</span>
									<span class="common-space">{{observeObj.comChangeRemark}}</span>
								</el-col>
							</el-row><br>
							<el-row>
								<el-col :span="5">地址是否异常：</el-col>
								<el-col :span="19">
									<span class="common-space">{{observeObj.comExceptionStatus == 0? '否' : '是'}}</span>
									<span class="common-space">{{observeObj.comExceptionRemark}}</span>
								</el-col>
							</el-row>
							<br>
						</div>
				
						<el-row>
							<el-col :span="5">其他异常情况：</el-col>
							<el-col :span="19">
								<span class="common-space">{{observeObj.otherExceptionStatus == 0? '否' : '是'}}</span>
								<span class="common-space">{{observeObj.comExceptionRemark}}</span>
							</el-col>
						</el-row>
					</div>
					<div class="padTop20 dialogLoanEnd">
						<el-row style='margin-top: -25px;'>
							<div>
								<br>
								<el-row>
									<el-col :span="5">结论：</el-col>
									<!--1.正常 2.移交电催 3.移交外访 4.移交总部-->
									<el-col :span="19">
										<span v-if='observeObj.monitorResult == 1'>正常</span>
										<span v-if='observeObj.monitorResult == 2'>移交电催</span>
										<span v-if='observeObj.monitorResult == 3'>移交外访</span>
										<span v-if='observeObj.monitorResult == 4'>移交总部</span>
									</el-col>
								</el-row><br>
								<el-row>
									<el-col :span="5">回访意见：</el-col>
									<el-col :span="19">{{observeObj.visitOpinion}}</el-col>
								</el-row>
							</div>
						</el-row>
					</div>
				</div>
      </el-dialog>
      <!--监测弹框--END-->

      <!--贷后弹框--START-->
      <el-dialog title="查看跟进内容" width='800px' center :visible.sync="dialogLoanEnd" :close-on-click-modal="false">
        <div class="dialogLoanEnd" style='margin-top: -25px;' v-loading="loadingDialog">
          <el-row>
          	<div class="clearfix">
	            <el-col :span="8">
	              <el-col :span="7" >催收对象：</el-col>
	              <el-col :span="17" >{{observeObj.receivingRelation}}</el-col>
	            </el-col>
	            <el-col :span="8">
	              <el-col :span="7" >姓名：</el-col>
	              <el-col :span="17" >{{observeObj.receivingName }}</el-col>
	            </el-col>
	            <el-col :span="8">
	              <el-col :span="7" >联系电话：</el-col>
	              <el-col :span="17" >{{observeObj.receivingMobile}}</el-col>
	            </el-col>
            </div>
            
            <div class="clearfix">
            	<el-col :span="8">
	              <el-col :span="7" >电话状态：</el-col>
	              <el-col :span="17" >{{observeObj.contactMobileStatus}}</el-col>
	            </el-col>
	            <el-col :span="8">
	              <el-col :span="7" >工作状态：</el-col>
	              <el-col :span="17" >{{observeObj.contactJobStatus}}</el-col>
	            </el-col>
	            <el-col :span="8">
	              <el-col :span="9" >债务人状态：</el-col>
	              <el-col :span="16" >{{observeObj.contactObligorStatus}}</el-col>
	            </el-col>
            </div>  
           
            <div class="clearfix">
            	<el-col :span="8">
	              <el-col :span="7" >催收反馈：</el-col>
	              <el-col :span="17" >
	              	<!--feedbackOptions: [
	              		
										{
											name: '承诺还款',
											value: 1
										},
										{
											name: '协助跟进',
											value: 2
										},
										{
											name: '未知',
											value: 3
										},
										{
											name: '拒绝还款',
											value: 4},
									],-->
									<!--注意： 此处是根据DialogFollow.vue的feedbackOptions来对应取值的-->
	                <span v-if='observeObj.collectionFeedback == 1'>承诺还款</span>
	                <span v-if='observeObj.collectionFeedback == 2'>协助跟进</span>
	                <span v-if='observeObj.collectionFeedback == 3'>未知</span>
	                <span v-if='observeObj.collectionFeedback == 4'>拒绝还款</span>
	              </el-col>	
              </el-col>
	            <el-col :span="8">
	              <el-col :span="7" >还款日期：</el-col>
	              <el-col :span="17" >{{observeObj.repaymentDate}}</el-col>
	            </el-col>
	            <el-col :span="8">
	              <el-col :span="7" >还款金额：</el-col>
	              <el-col :span="17" >{{observeObj.repaymentAmount}}元</el-col>
	            </el-col>  
            </div>       
            <div class="clearfix">
              <div class="followW72">跟进情况：</div>
              <div class="followWW90">{{observeObj.followContent}}</div>              
            </div>
            <div class="clearfix">
              <el-col :span="8" >预约跟进：</el-col>
              <el-col :span="16" >{{observeObj.reminderTime}}</el-col>
            </div>
            <div class="clearfix">
              <el-col :span="3" >预约提醒：</el-col>
              <el-col :span="21" >{{observeObj.reminderContent}}</el-col>
            </div>
          </el-row>
        </div>
      </el-dialog>
      <!--贷后弹框--END-->
      <!--erp贷后弹框--START-->
      <el-dialog title="查看跟进内容" width='700px' center :visible.sync="dialogErp" :close-on-click-modal="false">
        <div class="padTop20" style='margin-top: -25px;' v-loading="loadingDialog">
          <el-row>          
            <div class="ft wid50">
			  				<el-col :span="6" >跟进时间：</el-col>
				  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
				  			<el-col :span="18" >{{observeObj.followTime}}</el-col>
			  			</div>
			  			<div class="ft wid50">
			  				<el-col :span="6" >跟进类型：</el-col>
				  			<!--1.电话 2.外访 3.活动-->
				  			<el-col :span="18" >
				  				{{observeObj.followType}}
				  			</el-col>
			  			</div>
          </el-row>
          <el-row>
            <el-col :span="3" >跟进人员：</el-col>
            <!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
            <el-col :span="21" >{{realName}}</el-col>
          </el-row>
          <el-row>
              <div class="ft wid50">
				  			<el-col :span="6" >来源：</el-col>
				  			<!--贷后 2信贷 3贷后RECEIVABLE_TYPE-->
				  			<el-col :span="18" v-if = 'observeObj.receivableType ==1'>客户提醒</el-col>
				  			<el-col :span="18" v-else-if ='observeObj.receivableType == null'></el-col>
				  			<el-col :span="18" v-else>催收管理</el-col>
				  		</div>
			  			<div class="ft wid50">
				  			<el-col :span="6" >系统来源：</el-col>
				  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
				  			<el-col :span="18" v-if='observeObj.systemType == 1'>贷后</el-col>
				  			<el-col :span="18" v-if='observeObj.systemType == 2'>信贷</el-col>
			  			</div>
          </el-row>
          <el-row>            
             <div class="ft wid50">
				  			<el-col :span="6" >客户状态：</el-col>
				  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
				  			<el-col :span="18" >{{observeObj.customerType}}</el-col>				  		
				  		</div>
				  		<div class="ft wid50">
				  			<el-col :span="8" >本人联系状态：</el-col>
				  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
				  			<!--<el-col :span="16" >{{observeObj.contactType ==0?'异常':'正常'}}</el-col>-->
				  			<el-col :span="16">{{observeObj.contactType}}</el-col>
				  		</div>
          </el-row>
          <el-row>
            <el-col :span="3" >跟进内容：</el-col>
            <!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
            <el-col :span="21" >
              {{followObj.followContent}}
              <!--<p><a :href="observeObj.followFileUrl" target="_blank">附件下载</a></p>-->
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <!--erp贷后弹框--END-->

      <!--实名升级 信息申请 视频面审 开户--START-->
      <el-dialog title="查看跟进内容" width='500px' center :visible.sync="dialogInfo" :close-on-click-modal="false">
        <div class="padTop20" style='margin-top: -25px;' v-loading="loadingDialog">

          <el-row>
            <el-col :span="4" >跟进结果：</el-col>
            <el-col :span="20" >{{observeObj.followupResultMsg}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" >跟进内容：</el-col>
            <el-col :span="20" >{{observeObj.followContent}}</el-col>
          </el-row>
        </div>
      </el-dialog>
      <!--实名升级 信息申请 视频面审 开户--END-->
    </div>
  </div>
</template>

<script>
  //	import CommonTable from '@/components/custManage/dialog/CommonTable'
  import api from "@/api/index"
  import { baseURL } from '@/api/config.js'
  import Pagination from '@/components/common/Pagination'
  export default {
    props: {
      dialogFollow: {
        type: Object,
        default: function () {
          return {
            dialogFollowVisible: false,
            dialogButton:false,
            myOrderList:false,
          dialogOpenRecord:false
          }
        }
      },
      rowFollowId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
      	loadingDialog: false,
        layout:"total, prev, pager, next, jumper",
        followObj: [],
        follow_pickerOptions:{
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        followupResultList:[],
        currentPage:1,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        currentPage1:1,
        total1: 0,
        pageNo1: 1,
        pageSize1: 10,
        dialogFormVisible: false,
        dialogLoan: false,
        dialogObserve: false,
        observeObj: {},
        dialogLoanEnd: false,
        dialogErp: false,
        dialogInfo:false,
        formLabelWidth: '100px',
        saveFollow: false,
        DialogShowRejectInfo:false,
        dialogCallVisible:false,
        form: {

        },
        form_rules:{
          followTime:[
            {required:true, message: '请选择跟进日期', trigger: 'blur,change' }
          ],
          followType:[
            {required:true, message: '请选择跟进形式', trigger: 'change' }
          ],
          followupResult:[
            {required:true, message: '请选择跟进结果', trigger: 'change' }
          ],
          followContent:[
            {required:true, message: '请填写跟进内容', trigger: 'blur' }
          ],
          callerid:[
            {required:true, message: '请输入话机ID', trigger: 'change' }
          ]
        },
        arrData: [],
        openRecordData:[],
        callForm:{callerid:'',caller:''},
//      beforeLoan_followCont:'',
        reason:'',
        crmApplayId:'',
        fixeNumber:'', //固话 -旧
        realName: '',
        callPhoLoading:false
      }
    },

    methods: {
      // queryFollowupResultList(){
      //   api.queryPageDictionary({name:'跟进结果'}).then(res=>{
      //     if(res.data.success && res.data.data[0]){
      //       let code= res.data.data[0].code
      //       this.queryDictionary(code)
      //     } else {
      //       this.$notify({
      //         title: '提示',
      //         message: res.data.msg,
      //         duration: 1500
      //       });
      //     }
      //   })
      //
      // },
      replceNumVal(keys,value) {
        this.$nextTick(()=>{
          this.callForm[keys] = value.replace(/[^0-9$]/g,'')
        },20)
      },
      checkNumMin(value) {
        this.replceNumVal('callerid',value)
      },
      checkNum(value) {
        this.replceNumVal('caller',value)
      },
      callPho(){//点击电话图标    判断是否绑定固定
        this.dialogCallVisible = true
        this.callPhoLoading = true
        api.validateTask({crmApplayId:this.crmApplayId}).then(res=>{
            this.callPhoLoading =false
             this.saveFollow = false
            if(res.data.success && res.data.data){
              this.callForm.callerid=  res.data.data.smaTaskId  // 绑定的固话id
              this.callForm.caller=  res.data.data.caller  // 绑定的主叫号码
              this.fixeNumber = res.data.data.smaTaskId  || ''  //  绑定的固话id
          
            } else {
              this.$notify({
                title: '提示',
                message: res.data.msg,
                duration: 1500
              });
            }
        })
      },
      callFormClose(callForm){
        this.$refs['callForm'].resetFields();
      },
      confirm_call(){ // 确认呼叫
      this.saveFollow = true
        this.$refs['callForm'].validate((valid) => {
          if (valid) {
            let params={
              crmApplayId:this.crmApplayId,
              fixeNumber:this.fixeNumber,   //固定id  旧
              callerid:this.callForm.callerid, //固话 id -新
              caller:this.callForm.caller, //主叫号码 新
              callee:this.form.custMobile, //被叫号码
            }
            api.callFixedTel(params).then(res=>{
               this.saveFollow =false
              if(res.data.success){
                // 呼叫成功
                this.dialogCallVisible = false
            
              }
              this.$notify({
                title: '提示',
                message: res.data.msg,
                duration: 1500
              });
            }).catch((err)=>{
              this.$notify({
                title: '提示',
                message: err.data.msg,
                duration: 1500
              });
            })
          } else {
            return false;
          }
        });

      },
      queryDictionary(code){
        api.queryAllDetailOrder({code:'000008'}).then(res=>{
          if(res.data.success){
            this.followupResultList=res.data.data
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      followWrap() {
        this.dialogFormVisible = true
        this.$nextTick(()=>{
          this.$refs['form'].resetFields()
        })
        //获取手机号和环节
        this.form = {}
        this.queryDictionary()
        this.queryNodeFollow()
      },
      queryNodeFollow(){
          api.queryNodeFollow({
          crmApplayId:this.crmApplayId,
        }).then((res)=>{
        if(res.data.success){
          this.form=res.data.data
          }else{
           this.$notify({
                title: '提示',
                message: res.data.msg,
                duration: 1500
              });}
        })
      },
      showDifferDialog(row,followNode) {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
        console.log(row,followNode)
//      this.observeObj = row
        this.observeObj = {}
        this.realName = ''
        if(followNode == '1') {
          this.dialogLoan = true //贷前，
//        this.beforeLoan_followCont = row.followContent
        } else if (followNode == '2') {//监测				////
          this.dialogObserve = true
        } else if (followNode == '3'){//贷后
          this.dialogLoanEnd = true //贷后
        } else if (followNode == '4'){//4.ERP贷后
          this.dialogErp = true
          this.realName = row.realName
//        this.beforeLoan_followCont = row.followContent
        } else if (followNode == '5'||followNode == '6'||followNode == '7'||followNode == '8'){//实名升级 信息申请 视频面审 开户
          this.dialogInfo = true
        }
//					this.dialogErp = true
        console.log(row)
        this.queryFollowInfoFn(row.id)
      },
		queryFollowInfoFn(followId) {
			this.loadingDialog = true
			api.queryFollowInfo({
	  				followId:followId
	  			}).then((res) => {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
						this.loadingDialog = false
//	  				console.log(res.data.data,8888 )
	  				if(res.data.success){
		  				this.observeObj = res.data.data
//		  				console.log(this.observeObj.followContent,"this.observeObj")
		  				if (this.observeObj.followFileUrl) {
		          	let downLoad = baseURL + '/api/followUp/viewPhonto?src=' + this.observeObj.followFileUrl
		          	this.observeObj.followFileUrl = downLoad	
		          }
		  			} else {
		  				this.$notify({
				           title: '提示',
				           message: res.data.msg,
				           duration: 1500
				        })
	  				}
	  		})
		},
      handleSizeChange(val) {
        this.pageSize = val
        this.pageNo = 1
        this.currentPage = 1
        this.queryFollowList()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.currentPage = val
        this.queryFollowList()
      },

      handleSizeChange1(val) {
        this.pageSize1 = val
        this.pageNo1 = 1
        this.currentPage1 = 1
        this.queryOpenRecord()
      },
      handleCurrentChange1(val) {
        this.pageNo1 = val
        this.currentPage1 = val
        this.queryOpenRecord()
      },
      queryOpenRecord(row){ // 开户记录列表
        api.CustomerAccountOpenRecord({
          pageNo:this.pageNo1,
          pageSize:this.pageSize1,
          custId:row.custId ,
          // custId:'ab921437ddac4b01831ea73a9092ee6d',
          custInfoId:row.custInfoId
          // custInfoId:'2c908a885a8df581015a93861f2c04e4'
        }).then((res)=>{
          this.openRecordData = res.data.data
          this.total1=res.data.total
        })
        console.log(9999,row);
      },
      showRejectInfo(row){ // 失敗原因
      this.DialogShowRejectInfo = true
        this.reason = row.reason
        // api.followupResult({followId: row.id}).then(res => {
        // 	this.followObj = res.data.data
        // })
      },
      queryFollowList(crmApplayId){
        this.crmApplayId =crmApplayId
        console.log('父组件调用子组件成功')
        api.queryFollowList({
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          crmCustId:this.rowFollowId
        }).then((res) => {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
          this.arrData = res.data.data
          this.total = res.data.total
          console.log(this.arrData ,this.total )
        })
      },
      confirm_follow(form){
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.saveFollow = true
            api.saveFollowInfo({
              crmCustInfoId:this.rowFollowId,
              custMobile:this.form.custMobile,
              followNode:this.form.followNode,
              followTime:this.form.followTime,
              followType:this.form.followType,
              followupResult:this.form.followupResult.detailCode,
              followContent:this.form.followContent,
              crmApplayId:this.crmApplayId,
              nodeCode:this.form.nodeCode,
              nodeName:this.form.nodeName,
              followupResultMsg:this.form.followupResult.name
            }).then((res) => {
              this.saveFollow = false
              this.dialogFormVisible = false
              this.queryFollowList(this.crmApplayId)
              this.$notify({
                title: '提示',
                message: res.data.msg,
                duration: 1500
              });
            })
          }else{
            return false
          }
        })

      }
    },
    mounted(){
//	  	console.log(this.$route,'mounted')
    },
    watch: {
//	  	rowFollowId(newVal) {
//	  		if(newVal){
//	  			//this.queryFollowList()
//	  		}
////	  		console.log(newVal,'-----')
//	  	}
    },
    components: {
//	  	CommonTable
      Pagination
    }
  }
</script>
<style scoped lang="less">
  .wordWrap{
    width:310px;
    white-space:pre-wrap;
    word-break:break-all;
  }
  .el-icon-phone-outline{
    width: 20px;
    height: 20px;
    background-color: #31AFFF;
    text-align: center;
    line-height: 20px;
    border-radius: 3px;
    cursor: pointer;
  }
  .el-icon-phone-outline:before{
    color:#FFF;
  }
  .order-list-wrap {
  	
    .dialogLoanEnd .el-row div {
      /*height:30px;*/
     line-height: 1.5;
    }    
    .followW72 {
    	width: 72px;
    	float: left;
    }
    .followWW90 {
    	width: 90%;
    	float: left;
    }
    .miniList{
      bottom:0px;
      height:40px;
      .cancel{
        position: absolute;
        width:50%;
        left:0;
        bottom:0;
        border-radius: 0;
      }
      .modify{
        position: absolute;
        width:50%;
        right:0;
        bottom:0;
        border-radius: 0;
      }
    }
    .pagWrap {
      margin-top: 10px;
      text-align: right;
    }
    .title {
      margin-top: -40px;
      font-size: 16px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
    .follow-wrap {

      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .text-rt {
        margin-top: -40px;
      }
    }
    .wrap-list {
      padding-top: 5px;
    }
    .observe {
      margin-top: -25px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ccc;
    }
  }
  .common-space {
  	display: inline-block;
  	margin-right: 6px;
  }
  .common-space:last-child {
  	margin-right: 0;
  }
</style>
