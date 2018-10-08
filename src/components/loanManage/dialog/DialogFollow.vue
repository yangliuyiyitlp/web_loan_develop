<template>
    <div class="order-list-wrap ">
		<el-dialog
			:close-on-click-modal ='false'
			width='60%'
			title=""
			:visible.sync="dialogFollow.dialogFollowVisible">
			    <div class="title">跟进记录</div>
			    <p class="mrtop20"><el-button type="primary" @click='followWrap'>新增跟进</el-button></p>
			    <div class="wrap-list table-wraps">
			  	<el-table
			  		v-loading="loadingTable"
			  		height='300px'
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
					        <span class="btn-color followColo" @click="showDifferDialog(scope.row,scope.row.followNode)" >查看</span>
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
							@handleCurrentChange = 'handleCurrentChange'>
	 					</pagination>
	 				</div>
			  </div>
		</el-dialog>
		<div class="follow-wrap">
			<!--新增跟进"贷前弹框"--START-->
			<el-dialog title="新增跟进" width='964px'  center :visible.sync="dialogFormVisible" :close-on-click-modal ='false'>

			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth" class="demo-ruleForm">
				  <div>
				  	<el-form-item label="跟进形式" prop="addFollowType"  class='inline_from'>
					    <el-select value-key="value" v-model="ruleForm.addFollowType" placeholder="请选择" @change='getFollowData'>
					      <!--<el-option label="电话" value="电话"></el-option>
					      <el-option label="外访" value="外访"></el-option>-->
					      <el-option					      	
						      v-for="item in optionsFollowType"
						      :key="item.value"
						      :label="item.name"
						      :value="item">
						    </el-option>
					    </el-select>
					  </el-form-item>					  
				  </div>
				  <div>
				  	<el-form-item label="跟进对象" prop="addFollowObj"  class='inline_from'>
					    <el-select value-key="relationTop" v-model="ruleForm.addFollowObj" placeholder="请选择" @change='getAddSelData'>
					      <el-option
							      v-for="item in options"
							      :key="item.relationTop"
							      :label="item.relation"
							      :value="item">
							    </el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item label="姓名" :label-width="formLabelWidth" class='inline_from' prop="addFollowName">
					    <el-input v-model="ruleForm.addFollowName" :maxlength = '20'></el-input>
				    </el-form-item>
            <!-- todo  -->
				    <el-form-item label="联系电话" :label-width="formLabelWidth" class='inline_from' >
					    <el-input v-model="ruleForm.addFollowPhone" :maxlength = '11' class='callInput' disabled></el-input>
               <!-- <el-button type='text' :disabled='mobileCall ==""?true:false' v-loading='callPhoLoading' class='callBtn'> <i class="el-icon-phone-outline" @click="callPho" ></i></el-button>  -->
               <button :disabled='mobileCall ==""?true:false' type='button'  v-loading='callPhoLoading' class='callBtn el-icon-phone-outline' @click="callPho"> <i  ></i></button> 
				    </el-form-item>
				  </div>
				  <el-row>
	 					<el-form-item v-if = '!addresState' label="电话状态" :label-width="formLabelWidth" class='inline_from'>
				      <el-select v-model="ruleForm.phoneState" placeholder="请选择" >
				      	<el-option v-for = '(item, index) in phoneStateOptions' :label="item.name" :value="item.detailCode" :key='index'></el-option>
					      <!--<el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>-->
					    </el-select>
				   </el-form-item>
				    <div  v-if = 'addresState' class="inline_block">
					   	<el-form-item label="地址状态" :label-width="formLabelWidth" class='inline_from' prop="addresState">
					      <el-select v-model="ruleForm.addresState" placeholder="请选择" >
					      	<el-option v-for = '(item, index) in addressState' :label="item.name" :value="item.name" :key='index'></el-option>
						    </el-select>
					    </el-form-item>
				    </div>
				   
				   
				   <el-form-item label="工作状态" :label-width="formLabelWidth" class='inline_from'>
				      <el-select v-model="ruleForm.workState" placeholder="请选择" >
					      <el-option v-for = '(item, index) in workStateOptions' :label="item.name" :value="item.detailCode" :key='index'></el-option>
					      <!--<el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>-->
					    </el-select>
				   </el-form-item>
				   <el-form-item label="债务人状态" :label-width="formLabelWidth" class='inline_from'>
				      <el-select v-model="ruleForm.debtState" placeholder="请选择" >
					      <el-option v-for = '(item, index) in debtStateOptions' :label="item.name" :value="item.detailCode" :key='index'></el-option>
					    </el-select>
				   </el-form-item>
					</el-row>
					
				  <div v-if = 'addresState'>
				  	<el-form-item label="地址类型" prop="addressType"  class='inline_from'>
					    <el-select value-key="value" v-model="ruleForm.addressType" placeholder="请选择" @change='cahngeAddresType'>
					      <el-option
							      v-for="item in addressTypeOptions"
							      :key="item.value"
							      :label="item.name"
							      :value="item">
							    </el-option>
					    </el-select>
					  </el-form-item>	
					  <el-form-item class='inline_from wid600' >	
					  	<!--v-if = '!addressTypeDet'-->
						  <div class="spanDis" v-if = 'showAddressObj'>
						  	详细地址：
						  	<!--<span>{{addressObj.addressProvince}}</span>
						  	<span>{{addressObj.addressCity}}</span>
						  	<span>{{addressObj.addressArea}}</span>
						  	<span>{{addressObj.detailedAddress}}</span>		-->
						  	<span>{{this.ruleForm.homeProvinceId.provinceName}}</span>
						  	<span>{{this.ruleForm.homeCityId.cityName}}</span>
						  	<span>{{this.ruleForm.homeDistrictId.districtName}}</span>
						  	<span>{{this.ruleForm.homeAddress}}</span>	
						  </div>
						</el-form-item>	
				  </div>
				  <div v-if = 'addressTypeDet'>
				  	<el-form-item label="详细地址"   class='inline_from wid100 clearfix'>			
				  		<i class="addressTip">*</i>
					    <div class="fl">
					    	<el-select v-model="ruleForm.homeProvinceId" value-key="id" class="proviceCity" placeholder="请选择" @change='changeFamilyProvince' clearable>
		            	<el-option v-for = '(val,ind) in applyProvince' :label='val.provinceName' :value="val" :key='ind'></el-option>
		            </el-select>
					    </div>
		          <div class="fl">
		          	<el-select v-model="ruleForm.homeCityId" value-key="id" class="proviceCity" placeholder="请选择" @change='changeFamilyCity' clearable>
		            	<el-option v-for = '(val,ind) in applyCity' :label='val.cityName' :value="val" :key='ind'></el-option>
		            </el-select>
		          </div>
	            <div class="fl">
		            <el-select v-model="ruleForm.homeDistrictId" value-key="id" class="proviceCity" placeholder="请选择" clearable @blur ='clearVal' >
		            	<el-option v-for = '(val,ind) in applyArea' :label='val.districtName' :value="val" :key='ind'></el-option>
		            </el-select>
		          </div>
	            <div class="fl">
	            	<el-input v-model.trim="ruleForm.homeAddress" class="proviceInput" @blur = 'checkFnShowAddressDet'></el-input>
	            </div>
	            <span class="dialogTip" v-show='showAddressDet'>请填写详细地址</span>
					  </el-form-item>	
				  </div>
					<el-row>
	 					<el-form-item label="催收反馈" :label-width="formLabelWidth" class='inline_from' prop='feedback'>
				      <el-select value-key="value" v-model="ruleForm.feedback" placeholder="请选择" @change='updateData'>
				      	<el-option v-for = '(item, index) in feedbackOptions' :label="item.name" :value="item" :key='index'></el-option>
					      <!--<el-option label="请选择" value=""></el-option>
					      <el-option label="承诺还款" value="1"></el-option>
					      <el-option label="协助跟进" value="2"></el-option>
					      <el-option label="未知" value="3"></el-option>
					      <el-option label="拒绝还款" value="4"></el-option>-->
					    </el-select>
				   </el-form-item>
				   <el-form-item
				   	v-if='showCheckFeedBack'
				   	label="还款日期"
				   	:label-width="formLabelWidth"
				   	class='inline_from'
				   	prop='repaymentDate'
				
				   	>
						     <el-date-picker
						     	value-format="yyyy-MM-dd"
						     	@change='getDate'
						      v-model="ruleForm.repaymentDate"
						      :picker-options="follow_pickerOptions"
						      type="date"
					      	placeholder="选择日期">
					    </el-date-picker>
				   </el-form-item>
				   <el-form-item v-if='showCheckFeedBack' label="还款金额" :label-width="formLabelWidth" class='inline_from' prop='repaymentMoney'>
				      <el-input v-model.trim="ruleForm.repaymentMoney" :maxlength = '9' @input='checkNum'></el-input>
				   </el-form-item>
					</el-row>
			    <el-row>
	 					<el-form-item label="跟进情况" :label-width="formLabelWidth" prop="content">
				       <el-input type="textarea" v-model="ruleForm.content" :maxlength = '200' :autosize="{ minRows: 4}"></el-input>
				   </el-form-item>
					</el-row>
					<el-row>
 						<el-form-item label="预约跟进" :label-width="formLabelWidth">
				    	<el-checkbox v-model="checked" @change='chenkFollowTime'>跟进时间</el-checkbox>
				       <el-date-picker
				       	:disabled='disabledChenk'
				       		style='width:200px'
						      v-model="ruleForm.date"
						      :picker-options="follow_pickerOptions"
						      type="date"
	      					value-format="yyyy-MM-dd"
						      placeholder="选择日期">
						    </el-date-picker>
				    </el-form-item>
					</el-row>
					<el-row>
 						<el-form-item label="预约提醒" :label-width="formLabelWidth">
				       <el-input type="textarea" v-model="ruleForm.warnIng" :maxlength = '200' :disabled='disabledChenk'></el-input>
				    </el-form-item>
					</el-row>

				</el-form>
				<div slot="footer" class="dialog-footer">
				    <div class='text-rt'>
				    	<el-button @click="dialogFormVisible = false">取 消</el-button>
				      <el-button type="primary" @click="confirm_follow()" :loading='saveFollow'>确 定</el-button>
				    </div>
				  </div>
			</el-dialog>
			<!--新增跟进弹框--END-->
      <!--①新增跟进弹框--START-->

      <!--主叫号码-->
      <el-dialog title="主叫号码" width='400px'  center :visible.sync="dialogCallVisible" :close-on-click-modal="false" @close ='callFormClose(callForm)'>
        <el-form :model="callForm" ref="callForm" :rules="rules"   class="customerDialogForm">

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

			<!--贷前弹框--START-->
			<el-dialog title="查看跟进" width='360px' center :visible.sync="dialogLoan">
			  <p>{{observeObj.followContent}}</p>

			</el-dialog>
			<!--贷前弹框--END-->
			<!--//监测弹框--START-->
      <el-dialog title="查看跟进" width='700px' center :visible.sync="dialogObserve" >
      	<div v-loading = 'loadingDialog'>


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
			  <div class="" style='margin-top: -25px;'>
			  	<el-row>
			  		<div class="clearfix">
	            <el-col :span="8">
	              <el-col :span="7" >跟进形式：</el-col>
	              <!--<el-col :span="17" >{{observeObj.followType}}</el-col>-->
	              <el-col :span="17" v-if = 'observeObj.followType == "000021-0002"'>外访</el-col>
	              <el-col :span="17" v-if = 'observeObj.followType == "000021-0003"'>电话</el-col>
	            </el-col>
	            <el-col :span="8" v-if = 'observeObj.followType == "000021-0002"'>
	              <el-col :span="7" >地址类型：</el-col>
	              <el-col :span="17" >{{observeObj.addressType}}</el-col>
	            </el-col>
	            
            </div>
            <div class="clearfix">
            	<el-col :span="24" v-if = 'observeObj.followType == "000021-0002"'>
	              <el-col :span="2.5" >详细地址：</el-col>
	              <el-col :span="21.5" >
	              	<div class="spanDis">						  	
								  	<span>{{observeObj.addressProvince}}</span>
								  	<span>{{observeObj.addressCity}}</span>
								  	<span>{{observeObj.addressArea}}</span>
								  	<span>{{observeObj.detailedAddress}}</span>						  	
								  </div>
	              </el-col>
	            </el-col>
            </div>
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
	              <el-col :span="7" v-if = 'observeObj.followType == "000021-0003"'>电话状态：</el-col>
	              <el-col :span="17" v-if = 'observeObj.followType == "000021-0003"'>{{observeObj.contactMobileStatus }}</el-col>
	              <el-col :span="7" v-if = 'observeObj.followType == "000021-0002"'>地址状态：</el-col>
	              <el-col :span="17" v-if = 'observeObj.followType == "000021-0002"' >{{observeObj.addressStatus}}</el-col>	             
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
	              <el-col :span="17" >{{observeObj.repaymentAmount}}元</el-col>
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
			  				<!--<p><a class="blueColor" :href="observeObj.followFileUrl" target="_blank">附件下载</a></p>-->
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
            <el-col :span="20" >{{observeObj.followupResultMsg}}</el-col>
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
import api from "@/api/index";
import { baseURL } from '@/api/config.js'
import Pagination from "@/components/common/Pagination";
export default {
  props: {
    dialogFollow: {
      type: Object,
      default: function() {
        return {
          dialogFollowVisible: false,
          crmApplayId: ""
        };
      }
    },
    rowFollowId: {
      type: String,
      default: ""
    }
  },
  data() {
  	var validateMoney = (rule, value, callback) => {
        if (Number(value) <= 0) {
          callback(new Error('只允许输入大于零的数字'));
        } else {       
          callback();
        }
      };
    return {
      loadingDialog: false,
      loadingTable: false,
      addresState: false,
      addressTypeDet: false,
      showAddressDet: false,
      showAddressObj: false,
      applyProvince:[],
      applyCity:[],
      applyArea:[],
      addressTypeOptions: [
      	{
          name: "现居住地地址",
          value: 1
        },
        {
          name: "单位地址",
          value: 2
        },
        {
          name: "身份证地址",
          value: 3
        },
        {
          name: "其他",
          value: 4
        },
      ],
      optionsFollowType: [
      	{
          name: "电话",
          value: "000021-0003"
        },
        {
          name: "外访",
          value: "000021-0002"
        },
      ],
      feedbackOptions: [
        //					{
        //						name: '请选择',
        //						value: ''
        //					},
        {
          name: "承诺还款",
          value: 1
        },
        {
          name: "协助跟进",
          value: 2
        },
        {
          name: "未知",
          value: 3
        },
        {
          name: "拒绝还款",
          value: 4
        }
      ],
      phoneStateOptions: [],
      workStateOptions: [],
      debtStateOptions: [],
      addressState: [],
      addressObj: {},
      ruleForm: {
      	addressType: null,
      	addFollowType: null,
        addFollowObj: null,
        addresState: '',
        homeAddress: '',
        homeProvinceId:{} ,
        homeCityId:{} ,
        homeDistrictId:{} ,
        addFollowName: "",
        addFollowPhone: "",
        phoneState: "",
        workState: null,
        debtState: null,
        feedback: null,
        repaymentDate: "",
        repaymentMoney: "",
        content: "",
        date: "",
        warnIng: ""
      },
      rules: {
      	addressTypeDet: [
      		{ required: true, message: "请选择详细地址", trigger: "change" }
      	],
      	addressType: [
      		{ required: true, message: "请选择地址类型", trigger: "change" }
      	],
      	addFollowType: [
          { required: true, message: "请选择跟进形式", trigger: "change" }
        ],
        addFollowName: [
          { required: true, message: "请输入姓名", trigger: "change" }
        ],
        addFollowPhone: [
          { required: true, message: "请输入联系电话", trigger: "change" },          
          { pattern: /^[1][3-9][0-9]{9}?$/, message: '必须以1开头且第二位是3-9的11位数字', trigger: 'change,blur' }
        ],
        addFollowObj: [
          { required: true, message: "请选择跟进对象", trigger: "change" }
        ],
        addresState: [
        	{ required: true, message: "请选择地址状态", trigger: "change" }
        ],
        feedback: [
          { required: true, message: "请输入催收反馈", trigger: "change" }
        ],
        repaymentDate: [
          { required: true, message: "请选择还款日期", trigger: "change" }
          //           { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        repaymentMoney: [
          { required: true, message: "请输入还款金额", trigger: "change,blur"},
//        { required: true, message: "请选择还款金额", trigger: "change,blur"},
          { pattern: /^[0-9]+(.[0-9]{1,2})?$/, max: 9, message: '只允许输入带有两位小数的数字', trigger: 'blur' },
//        { pattern: /^0{0,}$/, max: 9, message: '只允许输入大于零的数字', trigger: 'change,blur' }
          { validator: validateMoney, trigger: 'blur' }
        ],
        content: [
          { required: true, message: "请填写跟进内容", trigger: "change" }
        ],
          callerid:[
            {required:true, message: '请输入话机ID', trigger: 'blur' }
          ]
      },
      layout: "total, prev, pager, next, jumper",
      follow_pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      follow_pickerOptions_s: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
      mobileCall: '',
      value1: "",
      options: [],
      currentPage: 1,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialogLoan: false,
      dialogObserve: false,
      observeObj: {},
      dialogLoanEnd: false,
      dialogErp: false,
      formLabelWidth: "90px",
      saveFollow: false,
      arrData: [],
      beforeLoan_followCont: "",
      checked: false,
      disabledChenk: true,
      showCheckFeedBack: false,
      dialogInfo: false,
      realName: '',
       callPhoLoading:false,
       dialogCallVisible:false,
         callForm:{callerid:'',caller:''},
           fixeNumber:'', //固话 -旧
    };
  },
  created() {
  	this.addressStaFn()
  	this.queryProvinceFn()
  },
  methods: {
    //拨打电话start
      callPho(){//点击电话图标    判断是否绑定固定
        this.dialogCallVisible = true
        this.callPhoLoading = true
        api.validateTask({crmApplayId:this.dialogFollow.crmApplayId}).then(res=>{
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
      
        this.$refs['callForm'].validate((valid) => {
          if (valid) {
            this.saveFollow = true
            let params={
              crmApplayId:this.dialogFollow.crmApplayId,
              fixeNumber:this.fixeNumber,   //固定id  旧
              callerid:this.callForm.callerid, //固话 id -新
              caller:this.callForm.caller, //主叫号码 新
              callee:this.mobileCall, //联系电话
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
    getDate() {
      console.log(this.ruleForm.repaymentDate);
    },
    changeFamilyProvince(val){//省，改变时
			this.ruleForm.homeAddress = ''
      this.ruleForm.homeCityId = ''
      this.ruleForm.homeDistrictId = ''
      this.applyCity = []
      this.applyArea = []
      if (!val.id) {return}
      this.queryCityByProvinceIdFn(val.id)
//		this.checkFnShowAddressDet()
      		  	console.log(val,"id")
      },
    changeFamilyCity(val){//市，改变时
			this.ruleForm.homeAddress = ''
      this.ruleForm.homeDistrictId= ''
      this.applyArea = []
      if (!val.id) {return}
      this.queryCityByAreaIdFn(val.id)
//    this.checkFnShowAddressDet()
    	
      
    },
    clearVal() {
    	this.ruleForm.homeAddress = ''

    },
    checkFnShowAddressDet(val){
			console.log(1212)
    	if (!this.ruleForm.homeProvinceId || !this.ruleForm.homeCityId || !this.ruleForm.homeDistrictId || !this.ruleForm.homeAddress) {
    		this.showAddressDet = true
    	} else {
    		this.showAddressDet = false
    	}
    },
    queryCityByProvinceIdFn(provinceId){//市
      api.queryCityByProvinceId({provinceId:provinceId}).then(res => {
        if(res.data.success){
          this.applyCity = res.data.data
          console.log(res.data.data,"applyCity")
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
    addressStaFn() {
    	let pararms = {
        pageNo: 1,
        pageSize: 100,
        code: "000025"
      };
    	api.queryPageDictionaryDetail(pararms).then(res => {
        if (res.data.success) {
          this.addressState = res.data.data;
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    queryPageDictionaryDetailOptions(code) {
      let pararms = {
        pageNo: 1,
        pageSize: 100,
        code: code
      };
      api.queryPageDictionaryDetail(pararms).then(res => {
        if (res.data.success) {
          if (code == "000013") {
            //		电话状态
            this.phoneStateOptions = res.data.data;
          } else if (code == "000014") {
            //		工作状态
            this.workStateOptions = res.data.data;
          } else if (code == "000015") {
            //		债务人状态

            this.debtStateOptions = res.data.data;
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
    checkNum(value) {
      // this.$refs.newForm.validateField('code');
//    this.$nextTick(() => {
        //^[0-9]*$
//      this.ruleForm["repaymentMoney"] = value.replace(/[^0-9$]/g, "");
//				this.ruleForm["repaymentMoney"] = value.replace(/^[0-9]+(.[0-9]{1,3})?$/g, "");

//    }, 20);
//    console.log(this.ruleForm["repaymentMoney"], value);
    },
    getAddSelData(val) {
      this.ruleForm.addFollowName = val.name;
      this.ruleForm.addFollowPhone = val.phone;
      this.mobileCall = val.mobile
      this.$forceUpdate();
      console.log(val);
    },
    getFollowData(val) {//2是外访
    	this.addresState = val.value == "000021-0002"? true:false
    	this.showAddressObj = false
    	this.applyCity = [] 
      this.applyArea = []
    	if (this.addresState) {
    		this.ruleForm.phoneState = ''    		    	
    	} else {
    		this.addressTypeDet = false
    		this.showAddressDet = false
    		
    		this.ruleForm.addresState = '' 
    		this.ruleForm.addressType = ''
    		this.ruleForm.homeProvinceId = {}
    		this.ruleForm.homeCityId = {}
    		this.ruleForm.homeDistrictId = {}
    		this.ruleForm.homeAddress = ''
//  		this.applyProvince = []
    		
    		this.addressObj = {
	      	addressProvince: '',
	      	addressCity: '',
	      	addressArea: '',
	      	detailedAddress: ''
	      }
    	}
//  	console.log(this.ruleForm,999)
    },
    cahngeAddresType(val) {
    	this.addressTypeDet = val.value == 4? true:false
//  	if (this.addressTypeDet) {    		
//  		this.showAddressDet = false
//  	} else {
//  		this.showAddressObj = true
//  	}
    	
    	console.log(this.ruleForm,6666);
    	if (val.value != 4) {
    		this.queryAddressInfoFn(val.value)
    		this.showAddressObj = true
    	} else {
    		this.showAddressObj = false
    		this.ruleForm.homeProvinceId = {}
    		this.ruleForm.homeCityId = {}
    		this.ruleForm.homeDistrictId = {}
    		this.ruleForm.homeAddress = ''
    		
    	}
    	console.log(this.ruleForm,999)
    },
    queryAddressInfoFn(val) {
    	api.queryAddressInfoFn({
    		crmCustInfoId: this.rowFollowId,
    		addressType: val
    	}).then((res) => {
    		if (res.data.success) {
          if (res.data.data != null) {
//        	this.addressObj = res.data.data;  
//        	console.log(res.data.data,"this.addressObj")
//        	
//						if (!this.addressTypeDet) {
//			    		this.ruleForm.homeProvinceId = {}
//			    		this.ruleForm.homeCityId = {}
//			    		this.ruleForm.homeDistrictId = {}
//			    		this.ruleForm.homeAddress = ''
//				    } else {
				    	this.ruleForm.homeProvinceId.provinceName = res.data.data.addressProvince
	          	this.ruleForm.homeCityId.cityName = res.data.data.addressCity
	          	this.ruleForm.homeDistrictId.districtName = res.data.data.addressArea
	          	this.ruleForm.homeAddress = res.data.data.detailedAddress
//				    }
          	console.log(this.ruleForm.homeProvinceId.provinceName)
          	console.log(this.ruleForm.homeCityId.cityName)
          	console.log(this.ruleForm.homeDistrictId.districtName)
          	console.log(this.ruleForm.homeAddress)
          } else {
          	this.addressObj = {
			      	addressProvince: '',
			      	addressCity: '',
			      	addressArea: '',
			      	detailedAddress: ''
			      }
          	this.ruleForm.homeProvinceId.provinceName = ''
          	this.ruleForm.homeProvinceId.cityName = ''
          	this.ruleForm.homeProvinceId.districtName = ''
          	this.ruleForm.homeAddress = ''
          }          
        } else {          
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
    	})
    },
    updateData(val) {
      console.log(val);
      if (val.value == 1) {
        //
        this.showCheckFeedBack = true;
      } else {
        this.showCheckFeedBack = false;
        this.ruleForm.repaymentDate = "";
        this.ruleForm.repaymentMoney = "";
      }
      this.$forceUpdate();
    },
    chenkFollowTime(val) {
      this.checked = val;
      this.disabledChenk = this.checked ? false : true;
      if (!this.checked) {
        this.ruleForm.date = "";
        this.ruleForm.warnIng = "";
      }
      console.log(this.disabledChenk, 1231313213);
    },

    followWrap() {
      this.dialogFormVisible = true;
      this.mobileCall = ''
      this.addressObj = {
      	addressProvince: '',
      	addressCity: '',
      	addressArea: '',
      	detailedAddress: ''
      }
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
      this.addresState = false
      this.addressTypeDet = false
      this.showAddressDet = false
      
      this.querylinkManForFollowFn();
      this.queryPageDictionaryDetailOptions("000013");
      this.queryPageDictionaryDetailOptions("000014");
      this.queryPageDictionaryDetailOptions("000015");

      this.showCheckFeedBack = false;
      this.checked = false;
      this.disabledChenk = true;
      Object.assign(this.ruleForm, {
      	addressType: null,
      	addFollowType: null,
        addresState: '',
        homeAddress: '',
        homeProvinceId:{} ,
        homeCityId:{},
        homeDistrictId:{},          	
        phoneState: "",
        workState: "",
        debtState: "",
        content: "",
        date: "",
        warnIng: "",
        repaymentDate: "",
        repaymentMoney: "",
        addFollowObj: null,
        addFollowName: "",
        addFollowPhone: "",
        feedback: null
      });
    },
    pageStart() {
      this.pageNo = 1;
      this.currentPage = 1;
    },
    querylinkManForFollowFn() {
      //新增跟进联系人列表
      let crmApplayId = this.dialogFollow.crmApplayId;
      //					let crmApplayId = '2c908a2b5ad0eb3d015ad0ef89bd0000'
      console.log(crmApplayId);
      api.querylinkManForFollow({ crmApplayId: crmApplayId }).then(res => {
        if (res.data.success) {
          this.options = res.data.data;
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
        //	  				this.arrData = res.data.data
        //	  				this.total = res.data.total
        console.log(res.data.data);
      });
    },
    showDifferDialog(row, followNode) {
    	this.realName = ''
      //followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
      console.log(row, followNode);
      this.observeObj = {};
      if (followNode == "1") {
        this.dialogLoan = true; //贷前，
        //						this.beforeLoan_followCont = row.followContent
      } else if (followNode == "2") {
        //监测				////
        this.dialogObserve = true;
      } else if (followNode == "3") {
        //贷后
        this.dialogLoanEnd = true; //贷后
      } else if (followNode == "4") {
        //4.ERP贷后
        this.dialogErp = true;
        this.realName = row.realName
        //						this.beforeLoan_followCont = row.followContent
      } else if (
        followNode == "5" ||
        followNode == "6" ||
        followNode == "7" ||
        followNode == "8"
      ) {
        //实名升级 信息申请 视频面审 开户
        this.dialogInfo = true;
      }
      this.queryFollowInfoFn(row.id);
      //this.dialogErp = true
    },
    queryFollowInfoFn(followId) {
      this.loadingDialog = true;
      api
        .queryFollowInfo({
          followId: followId
        })
        .then(res => {
          //followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
          this.observeObj = res.data.data;
          if (this.observeObj.followFileUrl) {
          	let downLoad = baseURL + '/api/followUp/viewPhonto?src=' + this.observeObj.followFileUrl
          	this.observeObj.followFileUrl = downLoad	
          }
          this.loadingDialog = false;
          console.log(res.data.data, 8888);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.currentPage = 1;
      this.queryFollowList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.currentPage = val;
      this.queryFollowList();
    },
    queryFollowList() {
      console.log("父组件调用子组件成功");
      this.arrData = [];
      this.loadingTable = true;
      api
        .queryFollowList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          crmCustId: this.rowFollowId
        })
        .then(res => {
          //followNode跟进环节:1.贷前 2.监测 3.贷后 4.ERP贷后
          this.loadingTable = false;
          this.arrData = res.data.data;
          this.total = res.data.total;
          //	  				console.log(this.arrData ,this.total )
        });
    },
    confirm_follow() {
    	console.log(this.ruleForm.addresState)
      this.$refs["ruleForm"].validate(valid => {
        console.log(valid, "==============");
        if (this.addressTypeDet) {
          	if (!this.ruleForm.homeProvinceId || !this.ruleForm.homeCityId || !this.ruleForm.homeDistrictId || !this.ruleForm.homeAddress) {
			    		this.showAddressDet = true
			    		return false
			    	} else {
			    		this.showAddressDet = false
			    	}
          }
        if (valid) {
          if (!this.disabledChenk) {
            if (!this.ruleForm.date) {
              this.$message({
                message: "请填写跟进时间",
                type: "warning"
              });
              return;
            }
          }
          
          
          this.saveFollow = true;
          this.showAddressDet = false
          console.log(this.ruleForm);
          let pararms = {
            crmCustInfoId: this.rowFollowId,
            followNode: "3", //跟进环节:1.贷前 2.监测 3.贷后 4.ERP跟进 必填
            receivingRelation: this.ruleForm.addFollowObj.relation,
            receivingName: this.ruleForm.addFollowName,
//          receivingMobile: this.ruleForm.addFollowPhone,
						receivingMobile: this.mobileCall,
            contactMobileStatus: this.ruleForm.phoneState,
            contactJobStatus: this.ruleForm.workState,
            contactObligorStatus: this.ruleForm.debtState,
            collectionFeedback: this.ruleForm.feedback.value,
            repaymentDate: this.ruleForm.repaymentDate,
            repaymentAmount: this.ruleForm.repaymentMoney,
            followContent: this.ruleForm.content, //跟进内容
            reminderTime: this.ruleForm.date, //提醒时间,预约跟进 贷后
            reminderContent: this.ruleForm.warnIng, //提醒内容 贷后
            followType: this.ruleForm.addFollowType.value,//跟进形式
            addressStatus: this.ruleForm.addresState, //地址状态
            addressType: this.ruleForm.addressType.name,//地址类型
            addressProvince: this.ruleForm.homeProvinceId.provinceName,
            addressCity: this.ruleForm.homeCityId.cityName,
            addressArea: this.ruleForm.homeDistrictId.districtName,
            detailedAddress: this.ruleForm.homeAddress,
          };
					console.log(this.ruleForm, "=========");
          console.log(this.mobileCall, "=========");
          api.saveFollowInfo(pararms).then(res => {
            this.saveFollow = false;
            this.dialogFormVisible = false;
            this.queryFollowList();
            console.log("==============");
            this.$notify({
              title: "提示",
              message: res.data.msg,
              duration: 1500
            });
          });
        } else {
          return false;
        }
      });
    }
  },
  components: {
    //	  	CommonTable
    Pagination
  }
};
</script>
<style  lang="less" scoped>
.callBtn{
  position: absolute;
  margin-left:5px;
      top:10px;
}
.callInput{
  width:85%;
}
  .el-icon-phone-outline{
    border:none;
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
.clearfix {
  line-height: 2;
}
.inline_block {
	display: inline-block;
}
.btn-color {
  cursor: pointer;
}
.dialogLoanEnd .el-row div {
  height: 30px;
}
.r_s {
  .el-table th {
    padding: 0px 0;
    line-height: 35px;
  }
  .el-table td {
    padding: 3px 0;
  }
}
.order-list-wrap {
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
    .el-form {
      .el-select {
        width: 100%;
      }
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
.inline_from {
  display: inline-block;
  width: 300px;
}
.followW72 {
  width: 72px;
  float: left;
}
.followWW90 {
  width: 90%;
  float: left;
}
.wid600 {
	width: 600px;
	margin-left: -63px;
}

.wid100 {
	width: 100%;
	position: relative;
}

.fl {
	margin-right: 1%;
	width: 24%;
}

.addressTip {
	position: absolute;
	left: -78px;
	color: #f56c6c;
}
.dialogTip {
  position: absolute;
  left: 0;
  bottom: -30px;
  color: #f56c6c;
  font-size: 12px;
}
.spanDis span {
	display: inline-block;
	margin-right: 5px;
}
</style>
