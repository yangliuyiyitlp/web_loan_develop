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
			  		 v-loading="loadingTable"
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
                <!-- <span v-if='scope.row.followType == 1'>电话</span>
                <span v-if='scope.row.followType == 2'>外访</span>
                <span v-if='scope.row.followType == 3'>活动</span> -->
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
							@handleSizeChange = 'handleSizeChange'
							@handleCurrentChange = 'handleCurrentChange'
			 				>
	 					</pagination>
	 				</div>
			  </div>
		</el-dialog>
		<div class="follow-wrap">
			<!--①新增跟进’贷前‘弹框--START-->
			<el-dialog title="新增跟进" width='800px' center :visible.sync="dialogFormVisible" :close-on-click-modal ='false'>
			  <el-form :model="form" ref="form" :rules="form_rules">
          <el-form-item label="监测时间：" :label-width="formLabelWidth" class="miniHeader" prop="followTime">
            <el-date-picker
            v-model="form.followTime"
            :picker-options="follow_pickerOptions"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
			    <el-form-item label="监测方式：" :label-width="formLabelWidth" class="miniHeader"  prop="monitorType" >
			      <el-select v-model="form.monitorType" placeholder="请选择"  @change="changeType">
			        <el-option label="常规监测" value="1"></el-option>
			        <el-option label="上门回访" value="2"></el-option>
			      </el-select>
			    </el-form-item>
          <el-form-item> </el-form-item>
          <el-form-item>
            <div class=" borBot1px dialogLoanEnd"></div>
          </el-form-item>
          <el-form-item label="是否失联：" :label-width="formLabelWidth" prop="disappearStatus">
            <el-radio-group v-model.trim="form.disappearStatus">
              <el-radio  :label="0" >否</el-radio>
              <el-radio  :label="1" >是</el-radio>
            </el-radio-group>
            <el-input v-model="form.disappearRemark" maxlength="50" class="miniInput" :id="isDisappearRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isDisappearRemark"  >{{remarksInfo.isDisappearRemark}}</a>
          </el-form-item>
          <el-form-item label="是否异常：" :label-width="formLabelWidth" prop="expectionStatus">
            <el-radio-group v-model.trim="form.expectionStatus">
              <el-radio  :label="0" >否</el-radio>
              <el-radio  :label="1" >是</el-radio>
            </el-radio-group>
            <el-input v-model="form.expectionRemark" maxlength="50" class="miniInput" :id="isExpectionRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isExpectionRemark">{{remarksInfo.isExpectionRemark}}</a>
          </el-form-item>
          <el-form-item v-if="isStyle">
            <el-checkbox-group v-model="isFamily" class="formType">
              <el-checkbox  name="type" @change="isFamilyChange(isFamily)"><a href="#" class="addressTip">*</a>上门回访家庭地址：</el-checkbox>
            </el-checkbox-group>
            <el-select v-model="form.homeProvinceId" class="proviceCity" placeholder="请选择" @change='changeFamilyProvince' clearable :disabled="!isFamily">
            <el-option v-for = '(val,ind) in applyProvince' :label='val.provinceName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-select v-model="form.homeCityId" class="proviceCity" placeholder="请选择" @change='changeFamilyCity' clearable :disabled="!isFamily">
            <el-option v-for = '(val,ind) in applyCity' :label='val.cityName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-select v-model="form.homeDistrictId" class="proviceCity" placeholder="请选择" clearable :disabled="!isFamily">
            <el-option v-for = '(val,ind) in applyArea' :label='val.districtName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-input v-model.trim="form.homeAddress" class="proviceInput" :disabled="!isFamily"></el-input>
            <a href="#" class="dialogTip" v-if="isHomeAddress">请填写全回访家庭地址</a>
          </el-form-item>


          <el-form-item  v-if="isStyle" label="地址是否变化：" :label-width="formLabelWidth" prop="homeChangeStatus" >
            <el-radio-group v-model="form.homeChangeStatus" >
              <el-radio  :label="0" :disabled="!isFamily">否</el-radio>
              <el-radio  :label="1" :disabled="!isFamily">是</el-radio>
            </el-radio-group>
            <el-input v-model.trim="form.homeChangeRemark" class="miniInput" :disabled="!isFamily" :id="isHomeChangeRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isHomeChangeRemark">{{remarksInfo.isHomeChangeRemark}}</a>
          </el-form-item>


          <el-form-item  v-if="isStyle" label="地址是否异常：" :label-width="formLabelWidth" prop="homeExceptionStatus">
            <el-radio-group v-model="form.homeExceptionStatus" >
              <el-radio  :label="0" :disabled="!isFamily">否</el-radio>
              <el-radio  :label="1" :disabled="!isFamily">是</el-radio>
            </el-radio-group>
            <el-input v-model.trim="form.homeExceptionRemark" class="miniInput" :disabled="!isFamily" :id="isHomeExceptionRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isHomeExceptionRemark">{{remarksInfo.isHomeExceptionRemark}}</a>
          </el-form-item>


          <el-form-item v-if="isStyle" >
            <el-checkbox-group v-model="isCompany" class="formType">
              <el-checkbox  name="type" @change="isCompanyChange(isCompany)"><a href="#" class="addressTip">*</a>上门回访公司地址：</el-checkbox>
            </el-checkbox-group>
            <el-select v-model="form.comProvinceId" class="proviceCity" placeholder="请选择" clearable @change='changeCompanyProvince' :disabled="!isCompany" >
              <el-option v-for = '(val,ind) in applyProvince' :label='val.provinceName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-select v-model="form.comCityId" class="proviceCity" placeholder="请选择" clearable @change='changeCompanyCity' :disabled="!isCompany">
              <el-option v-for = '(val,ind) in companyCity' :label='val.cityName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-select v-model="form.comDistrictId" class="proviceCity" placeholder="请选择" clearable :disabled="!isCompany" @change='changeProviceCity'>
              <el-option v-for = '(val,ind) in companyArea' :label='val.districtName' :value="val.id" :key='ind'></el-option>
            </el-select>
            <el-input v-model.trim="form.comAddress" class="proviceInput" :disabled="!isCompany"></el-input>
            <a href="#" class="dialogTip" v-if="isComAddress">请填写全回访公司地址</a>
          </el-form-item>

          <el-form-item  v-if="isStyle"  label="地址是否变化：" :label-width="formLabelWidth" prop="comChangeStatus">
            <el-radio-group v-model="form.comChangeStatus" >
              <el-radio  :label="0" :disabled="!isCompany">否</el-radio>
              <el-radio  :label="1" :disabled="!isCompany">是</el-radio>
            </el-radio-group>
            <el-input v-model.trim="form.comChangeRemark" class="miniInput" :disabled="!isCompany" :id="isComChangeRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isComChangeRemark">{{remarksInfo.isComChangeRemark}}</a>
          </el-form-item>

          <el-form-item  v-if="isStyle"  label="地址是否异常：" :label-width="formLabelWidth" prop="comExceptionStatus" >
            <el-radio-group v-model="form.comExceptionStatus" >
              <el-radio  :label="0" :disabled="!isCompany">否</el-radio>
              <el-radio  :label="1" :disabled="!isCompany">是</el-radio>
            </el-radio-group>
            <el-input v-model.trim="form.comExceptionRemark" class="miniInput" :disabled="!isCompany" :id="isComExceptionRemark ? 'classTip':'classDefault'"></el-input>
            <a href="#" class="dialogTip" v-if="isComExceptionRemark">{{remarksInfo.isComExceptionRemark}}</a>
          </el-form-item>

            <el-form-item   label="其他异常信息：" :label-width="formLabelWidth" prop="otherExceptionStatus">
              <el-radio-group v-model="form.otherExceptionStatus">
                <el-radio  :label="0" >否</el-radio>
                <el-radio  :label="1" >是</el-radio>
              </el-radio-group>
              <el-input v-model.trim="form.otherExceptionRemark" maxlength="50" class="miniInput" :id="isOtherExceptionRemark ? 'classTip':'classDefault'"></el-input>
              <a href="#" class="dialogTip" v-if="isOtherExceptionRemark">{{remarksInfo.isOtherExceptionRemark}}</a>
            </el-form-item>
          <el-form-item>
          <div class=" borBot1px dialogLoanEnd"></div>
          </el-form-item>
          <el-form-item label="结论：" :label-width="formLabelWidth" prop="monitorResult">
            <el-radio-group v-model="form.monitorResult">
              <el-radio  :label="1" >正常</el-radio>
              <el-radio  :label="2" >移交电催</el-radio>
              <el-radio  :label="3" >移交外访</el-radio>
              <el-radio  :label="4" >移交总部</el-radio>
              <!--<el-radio v-for="(value,index) in checkListName" :label="value.radio" :key="index">{{value.name}}</el-radio>-->
            </el-radio-group>
          </el-form-item>
			    <el-form-item label="回访意见：" :label-width="formLabelWidth" prop="visitOpinion">
			       <el-input type="textarea" v-model.trim="form.visitOpinion" class="miniTextarea"></el-input>
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
			<el-dialog title="查看跟进" width='360px' center :visible.sync="dialogLoan">
			  <p>{{observeObj.followContent}}</p>
			</el-dialog>
			<!--贷前弹框--END-->
			<!--//监测弹框--START-->
			<el-dialog title="查看跟进" width='700px' center :visible.sync="dialogObserve" >
			  <div v-loading='loadingDialog'>
			  	<p class="observe">
				  	监测时间：{{observeObj.followTime}}
				  	<!--monitorType (integer, optional): 监测方式 ：1.常规监测 2.上门回访-->
				  	<span class="rt">监测方式：{{observeObj.monitorType == 1? '常规监测' : '上门回访'}}</span>
				  </p>
				  <div class="padTop20 borBot1px dialogLoanEnd" style='margin-top: -25px;' ><br>
				  		<el-row>
				  			<el-col :span="5" >是否失联：</el-col>
				  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
				  			<el-col :span="19" >{{observeObj.disappearStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.disappearRemark}}</el-col>
				  		</el-row><br>
							<el-row>
								<el-col :span="5" >是否异常：</el-col>
								<el-col :span="19" >
									{{observeObj.expectionStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.expectionRemark}}
								</el-col>
							</el-row><br>
	            <div v-show="observeObj.monitorType == 2">
	              <el-row >
	                <el-col :span="5" >上门回访家庭地址：</el-col>
	                <el-col :span="19" >
	                  {{observeObj.homeProvinceId}}&nbsp;{{observeObj.homeCityId}}&nbsp;{{observeObj.homeDistrictId}}&nbsp;{{observeObj.homeAddress}}
	                </el-col>
	              </el-row><br>
	              <el-row >
	                <el-col :span="5" >地址是否变化：</el-col>
	                <el-col :span="19" >
	                  {{observeObj.homeChangeStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.homeChangeRemark}}</el-col>
	              </el-row><br>
	              <el-row>
	                <el-col :span="5" >地址是否异常：</el-col>
	                <el-col :span="19" >{{observeObj.homeExceptionStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.homeExceptionRemark}}</el-col>
	              </el-row><br>
	              <el-row>
	                <el-col :span="5" >上门回访公司地址：</el-col>
	                <el-col :span="19" >
	                  {{observeObj.comProvinceId}}&nbsp;{{observeObj.comCityId}}&nbsp;{{observeObj.comDistrictId}}&nbsp;{{observeObj.comAddress}}
	                </el-col>
	              </el-row><br>
	              <el-row>
	                <el-col :span="5" >地址是否变化：</el-col>
	                <el-col :span="19" >
	                  {{observeObj.comChangeStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.comChangeRemark}}
	                </el-col>
	              </el-row><br>
	              <el-row>
	                <el-col :span="5" >地址是否异常：</el-col>
	                <el-col :span="19" >
	                  {{observeObj.comExceptionStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.comExceptionRemark}}
	                </el-col>
	              </el-row>
	              <br>
	            </div>

	            <el-row>
	              <el-col :span="5" >其他异常情况：</el-col>
	              <el-col :span="19" >{{observeObj.otherExceptionStatus == 0? '否' : '是'}}&nbsp; &nbsp;&nbsp;{{observeObj.otherExceptionRemark}}</el-col>
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
			  </div>
			</el-dialog>
			<!--监测弹框--END-->

			<!--贷后弹框--START-->
			<el-dialog title="查看跟进" width='800px' center :visible.sync="dialogLoanEnd">
			  <div class="dialogLoanEnd" style='margin-top: -25px;'>
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
	              <el-col :span="15" >{{observeObj.contactObligorStatus}}</el-col>
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
	            <el-col :span="8" v-if="observeObj.collectionFeedback == 1">
	              <el-col :span="7" >还款日期：</el-col>
	              <el-col :span="17" >{{observeObj.repaymentDate}}</el-col>
	            </el-col>
	            <el-col :span="8" v-if="observeObj.collectionFeedback == 1">
	              <el-col :span="7" >还款金额：</el-col>
	              <el-col :span="17" >{{observeObj.repaymentAmount}}</el-col>
	            </el-col>  
            </div>  						
						<div class="clearfix">
              <div class="followW72">跟进情况：</div>
              <div class="followWW90">{{observeObj.followContent}}</div>              
            </div>
            <div class="clearfix">
              <el-col class="followW72">预约跟进：</el-col>
              <el-col class="followWW90">{{observeObj.reminderTime}}</el-col>
            </div>
            <div class="clearfix">
              <el-col class="followW72">预约提醒：</el-col>
              <el-col class="followWW90">{{observeObj.reminderContent}}</el-col>
            </div>
					</el-row>
				</div>
			</el-dialog>
			<!--贷后弹框--END-->
			<!--erp贷后弹框--START-->
			<el-dialog title="查看跟进" width='700px' center :visible.sync="dialogErp">
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
			  			<el-col :span="3" >备注：</el-col>
			  			<!--disappearStatus (integer, optional): 是否失联0.否 1.是 ,-->
			  			<el-col :span="21" >
                {{observeObj.followContent}}
			  				<!--<p><a :href="observeObj.followFileUrl" target="_blank">附件下载</a></p>-->
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
	        	dialogFollowVisible: false
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
		    	follow_pickerOptions:{
		          disabledDate(time) {
		            return time.getTime() >= Date.now();
		        }
	        },
          isStyle:false,
          isCompany:false,
          isFamily:false,
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
	        formLabelWidth: '150px',
	        saveFollow: false,
        isDisappearRemark:false,
        isExpectionRemark:false,
        isHomeChangeRemark:false,
        isHomeExceptionRemark:false,
        isComChangeRemark:false,
        isComExceptionRemark:false,
        isOtherExceptionRemark:false,
        isHomeAddress:false,
        isComAddress:false,
        dialogInfo:false,
        remarksInfo:{},
        form_rules:{
          followTime:[
            {required:true, message: '请选择跟进日期', trigger: 'blur,change' }
          ],
          monitorType:[
            {required:true, message: '请选择监测方式', trigger: 'blur,change' }
          ],
          disappearStatus:[
            {required:true, message: '请选择是否失联', trigger: 'blur,change' }
          ],
          expectionStatus:[
            {required:true, message: '请选择是否异常', trigger: 'blur,change' }
          ],
          otherExceptionStatus:[
            {required:true, message: '请选择其他异常信息', trigger: 'blur,change' }
          ],
          monitorResult:[
            {required:true, message: '请选择结论', trigger: 'blur,change' }
          ],
          visitOpinion:[
            {required:true, max:200, message: '请输入回访意见', trigger: 'blur,change' }
          ],
          homeChangeStatus:[
        {required:true, message: '请选择地址是否变化', trigger: 'blur,change' }
         ],
          homeExceptionStatus:[
            {required:true, message: '请选择地址是否异常', trigger: 'blur,change' }
          ],
          comChangeStatus:[
            {required:true, message: '请选择地址是否变化', trigger: 'blur,change' }
          ],
          comExceptionStatus:[
            {required:true, message: '请选择地址是否异常', trigger: 'blur,change' }
          ]
        },
	        form: {
            followTime: '', //监测时间
            monitorType:"",//监测方式
            disappearStatus:"",//是否失联
            disappearRemark:"",//失联备注
            expectionStatus:"",//是否异常
            expectionRemark:"",//异常备注
            otherExceptionStatus:"",//其他异常
            otherExceptionRemark:"",//其他异常
            monitorResult:"",//结论
            visitOpinion:"",//回访意见
            homeProvinceId: '',
            homeCityId: '',
            homeDistrictId: '',
            homeAddress: '',
            homeChangeStatus: '',
            homeChangeRemark: '',
            homeExceptionStatus: '',
            homeExceptionRemark: '',
            comProvinceId: '',
            comCityId: '',
            comDistrictId: '',
            comAddress: '',
            comChangeStatus: '',
            comChangeRemark: '',
            comExceptionStatus: '',
            comExceptionRemark: ''
	        },
        applyProvince: [],
        applyCity: [],
        applyArea:[],
        companyCity:[],
        companyArea:[],
	        arrData: [],
	        loadingTable: false,
	        beforeLoan_followCont:'',
	        realName:''
	    }
	  },

	  methods: {
      isFamilyChange(val){ // 上门回访家庭地址取消选择
      if(!val){
        this.form.homeProvinceId =''
        this.form.homeCityId =''
        this.form.homeDistrictId =''
        this.form.homeAddress =''
        this.form.homeChangeStatus = 0
        this.form.homeChangeRemark = ''
        this.form.homeExceptionStatus = 0
        this.form.homeExceptionRemark = ''
      }
      },
      isCompanyChange(val){ // 上门回访公司地址取消选择
        if(!val){
          this.form.comProvinceId =''
          this.form.comCityId =''
          this.form.comDistrictId =''
          this.form.comAddress =''
          this.form.comChangeStatus = 0
          this.form.comChangeRemark = ''
          this.form.comExceptionStatus = 0
          this.form.comExceptionRemark = ''
        }
      },
      changeType(val){
        console.log(val);
        if(val == "1"){
          this.isStyle = false
          this.applyCity = []
	        this.applyArea = []
	        this.companyCity = []
	        this.companyArea = []
	        this.isFamily = false
	        this.isCompany = false	         
	        let _form = {
	          followTime: this.getNowFormatDate(),
//	          monitorType:'',
	          disappearStatus:0,
	          expectionStatus:0,
	          disappearRemark:'',
	          expectionRemark:'',
	          otherExceptionStatus:0,
	          otherExceptionRemark:"",
	          monitorResult:1,
	          visitOpinion:'',
	          homeProvinceId: '',
	          homeCityId: '',
	          homeDistrictId: '',
	          homeAddress: '',
	          homeChangeStatus: 0,
	          homeChangeRemark: '',
	          homeExceptionStatus: 0,
	          homeExceptionRemark: '',
	          comProvinceId: '',
	          comCityId: '',
	          comDistrictId: '',
	          comAddress: '',
	          comChangeStatus: 0,
	          comChangeRemark: '',
	          comExceptionStatus:0,
	          comExceptionRemark: ''
	        }
          this.form = Object.assign(this.form,_form)         
        }else{
          this.isStyle = true
        }
        
      },
      changeFamilyProvince(id){//省，改变时
        this.form.homeCityId = ''
        this.form.homeDistrictId = ''
        this.applyCity = []
        this.applyArea = []
        if (!id) {return}
        this.queryCityByProvinceIdFn(id)
      },
      changeFamilyCity(id){//市，改变时
        this.form.homeDistrictId= ''
        this.applyArea = []
        if (!id) {return}
        this.queryCityByAreaIdFn(id)
      },
      queryCityByProvinceIdFn(provinceId){//市
        api.queryCityByProvinceId({provinceId:provinceId}).then(res => {
          if(res.data.success){
            this.applyCity = res.data.data
            console.log(res.data.data)
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      queryCityByAreaIdFn(cityId){//区
        api.queryCityByCityId({cityId:cityId}).then(res => {
          if(res.data.success){
            this.applyArea = res.data.data
            console.log(res.data.data)
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      queryProvinceFn(){//省
        api.queryProvince().then(res => {
          if(res.data.success){
            this.applyProvince = res.data.data
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      changeCompanyProvince(id){//省，改变时
        this.form.comCityId = ''
        this.form.comDistrictId = ''
        this.companyCity = []
        this.companyArea  = []
        if(!id) return
        this.queryCityCompany(id)
      },
      changeCompanyCity(id){//市，改变时
        this.form.comDistrictId= ''
        this.companyArea  = []
        if(!id) return
        this.queryAreaCompany(id)
      },
      changeProviceCity(){

      },
      queryCityCompany(provinceId){//市
        api.queryCityByProvinceId({provinceId:provinceId}).then(res => {
          if(res.data.success){
            this.companyCity = res.data.data
            console.log(res.data.data)
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      queryAreaCompany(cityId){//区
        api.queryCityByCityId({cityId:cityId}).then(res => {
          if(res.data.success){
            this.companyArea = res.data.data
            console.log(res.data.data)
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
         this.isDisappearRemark=false,
         this.isExpectionRemark=false,
         this.isHomeChangeRemark=false,
         this.isHomeExceptionRemark=false,
         this.isComChangeRemark=false,
         this.isComExceptionRemark=false,
         this.isOtherExceptionRemark=false,
         this.isComAddress=false,
         this.isHomeAddress=false,
           this.isCompany=false,
           this.isFamily=false,
          this.isStyle=false
	  		this.$nextTick(()=>{
	  			this.$refs['form'].resetFields()
        })
	  		this.form = {
          followTime: this.getNowFormatDate(),
          monitorType:'',
          disappearStatus:0,
          expectionStatus:0,
          disappearRemark:'',
          expectionRemark:'',
          otherExceptionStatus:0,
          otherExceptionRemark:"",
          monitorResult:1,
          visitOpinion:'',
          homeProvinceId: '',
          homeCityId: '',
          homeDistrictId: '',
          homeAddress: '',
          homeChangeStatus: 0,
          homeChangeRemark: '',
          homeExceptionStatus: 0,
          homeExceptionRemark: '',
          comProvinceId: '',
          comCityId: '',
          comDistrictId: '',
          comAddress: '',
          comChangeStatus: 0,
          comChangeRemark: '',
          comExceptionStatus:0,
          comExceptionRemark: ''
        }
	  	},
      pageStart(){
        this.pageNo = 1
        this.currentPage = 1
      },
	  	showDifferDialog(row,followNode) {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
        this.observeObj =  Object.assign(this.observeObj,{})
        this.realName = ''
        if(followNode == '1') {
						this.dialogLoan = true //贷前，
					}  else if (followNode == '2') {//监测				////
            this.dialogObserve = true
          }else if (followNode == '3'){//贷后
						this.dialogLoanEnd = true //贷后
					} else if (followNode == '4'){//4.ERP贷后
						this.dialogErp = true
						this.realName = row.realName
					}else if (followNode == '5'||followNode == '6'||followNode == '7'||followNode == '8'){//实名升级 信息申请 视频面审 开户
            this.dialogInfo = true
          }
        this.queryFollowInfoFn(row.id)
	  	},
      queryFollowInfoFn(followId) {
        console.log(55,this.observeObj)
        this.loadingDialog = true
        api.queryFollowInfo({
          followId:followId
        }).then((res) => {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
          this.observeObj = res.data.data
          if (this.observeObj.followFileUrl) {
          	let downLoad = baseURL + '/api/followUp/viewPhonto?src=' + this.observeObj.followFileUrl
          	this.observeObj.followFileUrl = downLoad	
          }
          this.loadingDialog = false
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
		queryFollowList(){
			console.log('父组件调用子组件成功')
			this.loadingTable = true
			api.queryFollowList({
  				pageNo:this.pageNo,
  				pageSize:this.pageSize,
  				crmCustId:this.rowFollowId
  			}).then((res) => {//followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
  				this.loadingTable = false
        this.arrData = res.data.data
        this.total = res.data.total
				if (res.data.code == 1) {
				} else {
//					this.$notify({
//          title: '提示',
//          message: res.data.msg,
//          duration: 1500
//        });
				}
  				console.log(res ,this.total )
  			})
		},
		confirm_follow(form){
      if(this.form.disappearStatus == 1 && (this.form.disappearRemark).length<=0){
        this.isDisappearRemark = true
        this.remarksInfo.isDisappearRemark = "请输入失联备注"
        return false
      }else if((this.form.disappearRemark).length>50){this.isDisappearRemark = true
        this.remarksInfo.isDisappearRemark = "超过最大长度50"
        return false
      }else{
        this.isDisappearRemark = false
      }
      if(this.form.expectionStatus == 1 && (this.form.expectionRemark).length<=0){
        this.isExpectionRemark = true
        this.remarksInfo.isExpectionRemark = "请输入异常备注"
        return false
      }else if((this.form.expectionRemark).length>50){this.isExpectionRemark = true
        this.remarksInfo.isExpectionRemark = "超过最大长度50"
        return false
      }else{
        this.isExpectionRemark = false
      }
      if(this.form.homeChangeStatus == 1 && (this.form.homeChangeRemark).length<=0){
        this.isHomeChangeRemark = true
        this.remarksInfo.isHomeChangeRemark = "请输入地址变化备注"
        return false
      }else if((this.form.homeChangeRemark).length>50){   this.isHomeChangeRemark = true
        this.remarksInfo.isHomeChangeRemark = "超过最大长度50"
        return false}else{
        this.isHomeChangeRemark = false
      }
      if(this.form.homeExceptionStatus == 1 && (this.form.homeExceptionRemark).length<=0){
        this.isHomeExceptionRemark = true
        this.remarksInfo.isHomeExceptionRemark = "请输入地址异常备注"
        return false
      }else if((this.form.homeExceptionRemark).length>50){ this.isHomeExceptionRemark = true
        this.remarksInfo.isHomeExceptionRemark = "超过最大长度50"
        return false}else{
        this.isHomeExceptionRemark = false
      }
      if(this.form.comChangeStatus == 1 && (this.form.comChangeRemark).length<=0){
        this.isComChangeRemark = true
        this.remarksInfo.isComChangeRemark = "请输入地址变化备注"
        return false
      }else if((this.form.comChangeRemark).length>50){this.isComChangeRemark = true
        this.remarksInfo.isComChangeRemark = "超过最大长度50"
        return false}else{
        this.isComChangeRemark = false
      }
      if(this.form.comExceptionStatus == 1 && (this.form.comExceptionRemark).length<=0){
        this.isComExceptionRemark = true
        this.remarksInfo.isComExceptionRemark = "请输入地址异常备注"
        return false
      }else if ((this.form.comExceptionRemark).length>50){     this.isComExceptionRemark = true
        this.remarksInfo.isComExceptionRemark = "超过最大长度50"
        return false}else{
        this.isComExceptionRemark = false
      }
      if(this.form.otherExceptionStatus == 1 && (this.form.otherExceptionRemark).length<=0){
        this.isOtherExceptionRemark = true
        this.remarksInfo.isOtherExceptionRemark = "请输入其他异常信息备注"
        return false
      }else if((this.form.otherExceptionRemark).length>50){ this.isOtherExceptionRemark = true
        this.remarksInfo.isOtherExceptionRemark = "超过最大长度50"
        return false}else{
        this.isOtherExceptionRemark = false
      }
      // 如果选择上门服务 判断是否填了上门回访家庭地址 或 上门回访公司地址   再判断地址是否填了
      if(this.form.monitorType == 2 ){
        if(!this.isFamily && !this.isCompany){
          this.$message.warning("请填写 上门回访家庭地址/上门回访公司地址")
         return false
        }
        if(this.isFamily){
          if(!this.form.homeProvinceId || !this.form.homeCityId || !this.form.homeDistrictId || !this.form.homeAddress){
            this.isHomeAddress = true
            return false
          }else {
            this.isHomeAddress = false
          }
        }else{
          this.isHomeAddress = false
        }
        if(this.isCompany){
          if(!this.form.comProvinceId || !this.form.comCityId || !this.form.comDistrictId || !this.form.comAddress){
            this.isComAddress = true
            return false
          }else {
            this.isComAddress = false
          }
        }else{
          this.isComAddress = false
        }

      }


      this.$refs['form'].validate((valid) => {
            if(valid){
              this.saveFollow = true
              api.saveFollowInfo({
                followNode:2,
                crmCustInfoId:this.rowFollowId,
                followTime:this.form.followTime,
                monitorType:this.form.monitorType,
                disappearStatus:this.form.disappearStatus,
                disappearRemark:this.form.disappearRemark,
                expectionStatus:this.form.expectionStatus,
                expectionRemark:this.form.expectionRemark,
                otherExceptionStatus:this.form.otherExceptionStatus,
                otherExceptionRemark:this.form.otherExceptionRemark,
                monitorResult:this.form.monitorResult,
                visitOpinion:this.form.visitOpinion,
                homeProvinceId:this.form.homeProvinceId,
                homeCityId: this.form.homeCityId,
                homeDistrictId: this.form.homeDistrictId,
                homeAddress:this.form.homeAddress,
                homeChangeStatus: this.form.homeChangeStatus,
                homeChangeRemark: this.form.homeChangeRemark,
                homeExceptionStatus: this.form.homeExceptionStatus,
                homeExceptionRemark: this.form.homeExceptionRemark,
                comProvinceId:this.form.comProvinceId,
                comCityId: this.form.comCityId,
                comDistrictId:this.form.comDistrictId,
                comAddress: this.form.comAddress,
                comChangeStatus: this.form.comChangeStatus,
                comChangeRemark: this.form.comChangeRemark,
                comExceptionStatus: this.form.comExceptionStatus,
                comExceptionRemark: this.form.comExceptionRemark,
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

		},
      //获取当前时间，格式YYYY-MM-DD
   getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
		},
	  mounted(){
      this.queryProvinceFn()

	  },
	  watch: {
	  	rowFollowId(newVal) {
	  		if(newVal){
	  			//this.queryFollowList()
	  		}
	  		console.log(newVal,'-----')
	  	}
	  },
	  components: {
//	  	CommonTable
			Pagination
	  }
}
</script>
<style scoped lang="less">
  @import url("dialogFollowMini.css");

	.order-list-wrap {

    .addressTip{
      color: #f56c6c;
      font-size: 12px;
    }
    .dialogTip{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 122px;
    }
    #disappearRemark:focus{
      border-color: #f56c6c!important;
    }
    .btn-color{
      cursor:pointer;
    }
    .formType{
      float:left;
    }
   .el-textarea[data-v-ce290f66] {
      width: 520px!important;
    }
    .proviceInput{
      width:205px;
    }
    .proviceCity{
      width:100px!important;
    }
    .miniInput{
      margin-left:10px;
      width:400px;
    }
    .miniHeader{
      margin-bottom:0px;
      width:335px;
      display: inline-block;
      .el-input{
        width:160px;
      }
    }
    .dialogLoanEnd .el-row div{
      height:30px;
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
		.clearfix {
	    line-height: 2;
		}
		.followW72 {
    	width: 72px;
    	float: left;
    }
	  .followWW90 {
	  	width: 90%;
	  	float: left;
	  }
	}
</style>
