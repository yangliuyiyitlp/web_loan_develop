<template>
  <div class="order-list-wrap ">
		<el-dialog
			:close-on-click-modal ='false'
			width='60%'
			title=""
			:visible.sync="dialogFollow.dialogFollowVisible"
		>
			  <div class="title">跟进记录</div>
			  <p class="mrtop20">
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
	                <!--<span v-if='scope.row.followType == 1'>电话</span>
	                <span v-if='scope.row.followType == 2'>外访</span>
	                <span v-if='scope.row.followType == 3'>活动</span>-->
	                <span>{{scope.row.followType}}</span>
	                
	              </span>
              </template>

            </el-table-column>

					    <el-table-column prop="followTime" label="跟进时间" align='center'>
					    </el-table-column>
					    <el-table-column prop="followContent" label="跟进内容" align='center'>
					    	<template slot-scope="scope">
						        <a class="btn-color" @click="showDifferDialog(scope.row,scope.row.followNode)">查看</a>
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
			<!--①新增跟进’贷前‘弹框--START-->
			<el-dialog title="新增跟进" width='360px'  center :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			  <el-form :model="form" ref="form" :rules="form_rules">
			    <el-form-item label="跟进日期" :label-width="formLabelWidth" prop="date">
			       <el-date-picker
					      v-model="form.date"
					      :picker-options="follow_pickerOptions"
					      type="date"
      					value-format="yyyy-MM-dd"
					      placeholder="选择日期">
					    </el-date-picker>
			    </el-form-item>
			    <el-form-item label="跟进形式" :label-width="formLabelWidth" prop="format">
			      <el-select v-model="form.format" placeholder="请选择">
			        <el-option :label="item.name" :value="item.detailCode" v-for = 'item in followForm' :key='item.price'></el-option>
			        <!--<el-option label="外访" value="2"></el-option>
			        <el-option label="活动" value="3"></el-option>-->
			      </el-select>
			    </el-form-item>
			    <el-form-item label="跟进内容" :label-width="formLabelWidth" prop="content">
			       <el-input type="textarea" v-model.trim="form.content" :maxlength='200' :autosize="{ minRows: 4}"></el-input>
			    </el-form-item>
			  </el-form>

			  <div slot="footer" class="dialog-footer">
			    <div class='text-rt'>
			    	<el-button @click="dialogFormVisible = false">取 消</el-button>
			      <el-button type="primary" @click="confirm_follow(form)" :loading='saveFollow'>确 定</el-button>
			    </div>
			  </div>
			</el-dialog>
			<!--新增跟进弹框--END-->

      <!--增跟进’放款监测--END-->
			<!--贷前弹框--START-->
			<el-dialog title="查看跟进内容" width='360px' center :visible.sync="dialogLoan" :close-on-click-modal="false">
			  <a href="javascript:void(0)" class="wordWrap">{{observeObj.followContent}}</a>
        <div class ='miniList' v-if="dialogFollow.dialogButton" @click="dialogLoan = false"><el-button type="info" class="cancel" >取消</el-button><el-button type="primary" class="modify">确定</el-button></div>
			</el-dialog>
			<!--贷前弹框--END-->
			<!--//监测弹框--START-->
      <el-dialog title="查看跟进" width='700px' center :visible.sync="dialogObserve">
        <p class="observe">
          监测时间：{{observeObj.followTime}}
          <!--monitorType (integer, optional): 监测方式 ：1.常规监测 2.上门回访-->
          <span class="rt">监测方式：{{observeObj.monitorType == 1? '常规监测' : '上门回访'}}</span>
        </p>
        <div class="padTop20 borBot1px dialogLoanEnd" style='margin-top: -25px;'><br>
          <el-row>
            <el-col :span="5" >是否失联：</el-col>
            <!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
            <el-col :span="19" >{{observeObj.disappearStatus == 0? '否' : '是'}}{{observeObj.disappearRemark}}</el-col>
          </el-row><br>
          <el-row>
            <el-col :span="5" >是否异常：</el-col>
            <el-col :span="19" >
              {{observeObj.expectionStatus == 0? '否' : '是'}}{{observeObj.expectionRemark}}
            </el-col>
          </el-row><br>
          <div v-if="observeObj.monitorType == 2">
            <el-row >
              <el-col :span="5" >上门回访家庭地址：</el-col>
              <el-col :span="19" >
                {{observeObj.homeProvinceId}} {{observeObj.homeCityId}} {{observeObj.homeDistrictId}}{{observeObj.homeAddress}}
              </el-col>
            </el-row><br>
            <el-row >
              <el-col :span="5" >地址是否变化：</el-col>
              <el-col :span="19" >
                {{observeObj.homeChangeStatus == 0? '否' : '是'}}{{observeObj.homeChangeRemark}}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="5" >地址是否异常：</el-col>
              <el-col :span="19" >{{observeObj.comExceptionStatus == 0? '否' : '是'}}{{observeObj.comExceptionRemark}}</el-col>
            </el-row><br>
            <el-row>
              <el-col :span="5" >上门回访公司地址：</el-col>
              <el-col :span="19" >
                {{observeObj.comProvinceId}}{{observeObj.comCityId}}{{observeObj.comDistrictId}}{{observeObj.comAddress}}
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="5" >地址是否变化：</el-col>
              <el-col :span="19" >
                {{observeObj.comChangeStatus == 0? '否' : '是'}}{{observeObj.comChangeRemark}}
              </el-col>
            </el-row><br>
            <el-row>
              <el-col :span="5" >地址是否异常：</el-col>
              <el-col :span="19" >
                {{observeObj.comExceptionStatus == 0? '否' : '是'}}{{observeObj.comExceptionRemark}}
              </el-col>
            </el-row>
            <br>
          </div>

          <el-row>
            <el-col :span="5" >其他异常情况：</el-col>
            <el-col :span="19" >{{observeObj.otherExceptionStatus == 0? '否' : '是'}}{{observeObj.comExceptionRemark}}</el-col>
          </el-row>
        </div>
        <div class="padTop20 dialogLoanEnd">
          <el-row  style='margin-top: -25px;'>
            <div>
              <br>
              <el-row>
                <el-col :span="5" >结论：</el-col>
                <!--1.正常 2.移交电催 3.移交外访 4.移交总部-->
                <el-col :span="19" >
                  <span v-if='observeObj.monitorResult == 1'>正常</span>
                  <span v-if='observeObj.monitorResult == 2'>移交电催</span>
                  <span v-if='observeObj.monitorResult == 3'>移交外访</span>
                  <span v-if='observeObj.monitorResult == 4'>移交总部</span>
                </el-col>
              </el-row><br>
              <el-row>
                <el-col :span="5" >回访意见：</el-col>
                <el-col :span="19" >{{observeObj.visitOpinion}}</el-col>
              </el-row>
            </div>
          </el-row>
        </div>
      </el-dialog>
			<!--监测弹框--END-->

			<!--贷后弹框--START-->
			<el-dialog title="查看跟进内容" width='700px' center :visible.sync="dialogLoanEnd" :close-on-click-modal="false">
			  <div class="dialogLoanEnd" style='margin-top: -25px;'>
			  	<el-row>
			  		<div>
			  			<el-col :span="3" >催收对象：</el-col>
			  			<el-col :span="21" >{{observeObj.receivingRelation}}</el-col>
			  		</div>
						<div>
							<el-col :span="3" >姓名：</el-col>
							<el-col :span="21" >{{observeObj.receivingName }}</el-col>
						</div>
						<div>
							<el-col :span="3" >电话/地址：</el-col>
							<el-col :span="21" >{{observeObj.receivingMobile}}</el-col>
						</div>
						<div>
							<el-col :span="4" >催收反馈：</el-col>
							<el-col :span="4" >
                <span>{{observeObj.collectionFeedback}}</span>
							</el-col>
              <el-col :span="4" >还款日期：</el-col>
              <el-col :span="4" >
                <span>{{observeObj.repaymentDate}}</span>
              </el-col>
              <el-col :span="4" >还款金额：</el-col>
              <el-col :span="4" >
                <span>{{observeObj.repaymentAmount}}元</span>
              </el-col>
						</div>
						<div>
							<el-col :span="3" >跟进情况：</el-col>
							<el-col :span="21" >{{observeObj.followContent}}</el-col>
						</div>
						<div>
							<el-col :span="3" >预约跟进：</el-col>
							<el-col :span="21" >{{observeObj.reminderTime}}</el-col>
						</div>
						<div>
							<el-col :span="3" >预约提醒：</el-col>
							<el-col :span="21" >{{observeObj.reminderContent}}</el-col>
						</div>
					</el-row>
				</div>
			</el-dialog>
			<!--贷后弹框--END-->
			<!--erp贷后弹框--START-->
			<el-dialog title="查看跟进" width='700px' center :visible.sync="dialogErp" :close-on-click-modal="false">
			  <div class="padTop20" style='margin-top: -25px;'>
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
			  				{{observeObj.followContent}}
			  				<!--<p><a class="blueColor" :href="observeObj.followFileUrl" target="_blank" :download="downloadName">附件下载</a></p>-->
			  			</el-col>
			  		</el-row>
				</div>
			</el-dialog>
			<!--erp贷后弹框--END-->
      <!--实名升级 /  信息申请 /  视频面审 /  开户 弹框 start-->
      <el-dialog title="查看跟进内容" width='500px' center :visible.sync="dialogInfo" :close-on-click-modal="false">
        <div class="padTop20" style='margin-top: -25px;'>

          <el-row>
            <el-col :span="4" >跟进结果：</el-col>
            <el-col :span="20" >{{observeObj.followupResult}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" >跟进内容：</el-col>
            <el-col :span="20" >{{observeObj.followContent}}</el-col>
          </el-row>
        </div>
      </el-dialog>
      <!--实名升级 /  信息申请 /  视频面审 /  开户 弹框 end-->
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
            dialogButton:false
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
          layout:"total, prev, pager, next, jumper",
		    	follow_pickerOptions:{
		          disabledDate(time) {
		            return time.getTime() >= Date.now();
		        }
	        },
	        followForm:[],
		    	currentPage:1,
		  		total: 0,
		  		pageNo: 1,
	        pageSize: 10,
	        dialogFormVisible: false,
	        dialogLoan: false,
	        dialogObserve: false,
	        observeObj: {},
	        dialogLoanEnd: false,
	        dialogErp: false,
	        formLabelWidth: '80px',
	        saveFollow: false,
        dialogInfo:false,
        realName: '',
        downloadName: '',
	        form: {
	          format: '',
	          date: '',
	          content: ''
	        },
	        form_rules:{
	        	date:[
	        		{required:true, message: '请选择跟进日期', trigger: 'blur,change' }
	        	],
					format:[
		        		{required:true, message: '请选择跟进形式', trigger: 'change' }
		        	],
		        content:[
		        	{required:true, message: '请填写跟进内容', trigger: 'blur' }
		        ]
	        },
	        arrData: [],
	        beforeLoan_followCont:''
	    }
	  },

	  methods: {
	  	queryPageDictionaryDetailFn(){
	  		let pararms = {
	  			pageNo:1,
	  			pageSize: 100,
					code:"000021",
					status:1
	  		}
	  		api.queryPageDictionaryDetail(pararms).then(res => {
	  			if (res.data.success) {
	  				this.followForm = res.data.data
	  			} else {
	  				this.$notify({
		          title: '提示',
		          message: res.data.msg,
		          duration: 1500
		        })
	  			}
	  			console.log(res,"res")
	  		})
	  	},
	  	followWrap() {
	  		this.dialogFormVisible = true
	  		this.$nextTick(()=>{
	  			this.$refs['form'].resetFields()
	  		})
	  		this.form = {
          format: '',
          date: '',
          content: ''
        }
	  	},
	  	showDifferDialog(row,followNode) {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
	  			console.log(row,followNode)
//	  			this.observeObj = row
					this.realName = ''		
	  			this.observeObj = {}
					if(followNode == '1') {
						this.dialogLoan = true //贷前，
						this.beforeLoan_followCont = row.followContent
					} else if (followNode == '2') {//监测				////
						this.dialogObserve = true
					} else if (followNode == '3'){//贷后
						this.dialogLoanEnd = true //贷后
					} else if (followNode == '4'){//4.ERP贷后
						this.dialogErp = true
						this.realName = row.realName
						this.beforeLoan_followCont = row.followContent
					}else if (followNode == '5'||followNode == '6'||followNode == '7'||followNode == '8'){//实名升级 信息申请 视频面审 开户
            this.dialogInfo = true
          }
//					this.dialogErp = true
					console.log(row)
					 this.queryFollowInfoFn(row.id);
	  	},
			queryFollowInfoFn(followId) {
//	      this.loadingDialog = true;
				this.downLoadName = ''
	      api.queryFollowInfo({
	          followId: followId
	       }).then(res => {
	          //followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
	          this.observeObj = res.data.data;
	          if (this.observeObj.followFileUrl) {
	          	const str = this.observeObj.followFileUrl
	          	let downLoad = baseURL + '/api/followUp/viewPhonto?src=' + this.observeObj.followFileUrl
	          	this.observeObj.followFileUrl = downLoad
	          	let num = str.lastIndexOf("/")
	          	let num2 = str.lastIndexOf(".")
	          	this.downLoadName = str.substr(num+1,num2)
	          	console.log(this.downLoadName, 8888);
	          }
//	          this.loadingDialog = false;
	          
	        });
	    },
	    downfile(url) {
	    	console.log(url	, 8888);
	    		window.location.href=url;
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
		queryFollowList(){
//			console.log('父组件调用子组件成功')
		
			api.queryFollowList({
  				pageNo:this.pageNo,
  				pageSize:this.pageSize,
  				crmCustId:this.rowFollowId
  			}).then((res) => {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
  					this.arrData = []
			  this.total = 0
//				console.log(this.arrData ,this.total )
					if(res.data.success) {
		        this.arrData = res.data.data
  				  this.total = res.data.total
					}
//					else {
//						this.$notify({
//				           title: '提示',
//				           message: res.data.msg,
//				           duration: 1500
//				        });
//					}
	  		})
		},
		confirm_follow(form){
			this.$refs['form'].validate((valid) => {
				if(valid){
					this.saveFollow = true
					api.saveFollowInfo({
						crmCustInfoId:this.rowFollowId,
						followNode:'1',
						followTime:this.form.date,
						followType:this.form.format,
						followContent:this.form.content
					}).then((res) => {
						this.saveFollow = false
						this.dialogFormVisible = false
						this.queryFollowList()
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
	  	this.queryPageDictionaryDetailFn()
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
	.order-list-wrap {
    .dialogLoanEnd .el-row div{
      height:30px;
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
</style>
