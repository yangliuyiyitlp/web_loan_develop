<template>
 <div>
 	<div class="order-search borBot1px">
		<el-form :inline="true" :model="search" class="demo-form-inline">
		  <el-form-item>
		  	<div style="width:315px">
		  		<el-input v-model="search.content" :placeholder='permission.searchContent' clearable></el-input>
		  	</div>
		  </el-form-item>

      <el-form-item label="跟进结果" label-width='105px' v-if="permission.followResultList">
        <el-select v-model="search.followResultList" placeholder="请选择" clearable>
          <el-option
            v-for = 'item in followResultList'
            :label='item.name' :value="item.detailCode" :key='item.id'>
          </el-option>
        </el-select>
      </el-form-item>

		  <el-form-item  v-if='permission.showAllPararms'>
		  	<el-checkbox v-model="search.checked" @change='changeAllVal(search.checked)'>全部</el-checkbox>
		  </el-form-item>
		  <el-form-item  v-if='permission.showAllPararms' class='marBot15'>
		  	<!--<el-checkbox-group size="small" v-model="search.checkList" @change='changeVal(search.checkList)'>
			    <el-checkbox v-for="(value,index) in checkListName" :label="value" :key="index" :value='value' >{{value}}</el-checkbox>
			</el-checkbox-group>-->
			<el-checkbox-group size="small" v-model="search.checkList" @change='changeVal(search.checkList)'>
			    <el-checkbox :id='"checkbox"+index' :ref ='"checkbox"+index' v-for="(value,index) in checkListName" :label="value" :key="index" :value='value' @change='changeRadio(index,value)'>{{value.name}}</el-checkbox>
			</el-checkbox-group>
		  </el-form-item>
		   <el-form-item  v-if='permission.showOnlyCheck'>
		  	<el-checkbox v-model="search.onlyCheck">仅查看我的订单</el-checkbox>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" icon="el-icon-search" @click='searchFn'>查询</el-button>
		  </el-form-item>
		   <el-form-item>
		   	 <el-button @click='showSeniorSearch'>展开高级搜索</el-button>
		  </el-form-item>
      <!--客服中心挂起状态-->
      <div class="custumer-wrap" v-if='permission.showCustomer'>
        <el-form-item  v-if='permission.showCustomer'>
          <el-checkbox v-model="checkedCustomer" @change='changeAllValCustomer(checkedCustomer)'>全部</el-checkbox>
        </el-form-item>
        <el-form-item  v-if='permission.showCustomer'>
          <el-checkbox-group size="small" v-model="search.checkListCustomer" @change='changeValCustomer(search.checkListCustomer)'>
            <el-checkbox
            	:id='"checkboxCustomer"+index' :ref ='"checkboxCustomer"+index'
            	v-for="(value,index) in checkListNameCustomer"
            	:label="value.code" :key="index"
            	:value='value.code'
            	@change='changeRadioCustomer(index,value)'>{{value.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <!--客服中心挂起状态 --END-->
      <el-form-item v-if="permission.showReject">
        <el-button  type="primary" @click='rejectFn'>拒绝</el-button>
      </el-form-item>
			<div class="seniorSearch" v-show='orShow'>
				<div class="pad20">
					<div class="custDistribution">
						<span class="hideSeniorSearch" @click="hideSeniorSearch">收起并清空 </span>
						<el-form-item label="产品系列" label-width='105px' >
						    <el-select v-model="search.productList" placeholder="请选择" @change='changeProductList' clearable>
						    	<el-option

						    		v-for = 'item in productList'
						    		:label='item.name' :value="item.id" :key='item.id'>
						    	</el-option
>
						    </el-select>
						</el-form-item>
						<el-form-item label="产品名称" label-width='105px'>
						    <el-select v-model="search.productName" placeholder="请选择" clearable>
						    	<el-option v-for = 'item in productList_s'
						    		:label='item.name' :value="item.id" :key='item.id'></el-option>
						    </el-select>
						</el-form-item>
						<!--<el-form-item label="订单状态" label-width='105px' v-if='permission.showOrderState'>
						    <el-select value-key="id" v-model="search.orderStatus" placeholder="请选择" @change='changeOrderState'>
                  				<el-option v-for = 'item in productState'
                             :label='item.name' :value="item" :key='item.id' ></el-option>
						    </el-select>
						</el-form-item>-->
			            <el-form-item  v-if='permission.showUp'>
			              <div class="padleft">
			              	<el-checkbox v-model="search.hangStatus">挂起</el-checkbox>
			              </div>
			            </el-form-item>
					</div>
					<div class="pre">
						<el-form-item label="归属公司/部门" label-width='105px'>
						    <el-input
						    	 @focus='showTreeFn'
						    	:readonly = 'true'
						    	 style="width: 200px;"
						    	 v-model="partName_s" placeholder="请选择">
						    	<el-button @click='clearFn' slot="append" icon="el-icon-delete" style='font-size: 20px;'></el-button>
						    </el-input>
						</el-form-item>
						<el-form-item label="归属人" label-width='105px'>
							<el-input :maxlength='20' style="width: 200px;" v-model="search.people" placeholder='请输入姓名、工号模糊查询' ></el-input>
						</el-form-item>
						<el-form-item label="订单环节" label-width='105px' v-if='permission.showOrderNode' >
						    <el-select v-model="search.orderNode" placeholder="请选择"  :disabled = 'showOrderNodeChild' clearable>
						    	<el-option v-for = '(val,ind) in orderNode' :label='val.name' :value="val.detailCode" :key='ind'></el-option>
						    </el-select>
						</el-form-item>
					</div>
					<div>
						<el-form-item label="申请省份" label-width='105px'>
						    <el-select v-model="search.applyProvince" placeholder="请选择" @change='changeProvince' clearable @clear="clearProvince">
						      <!--<el-option label="区域一" value="shanghai"></el-option>-->
						      <el-option v-for = '(val,ind) in applyProvince' :label='val.provinceName' :value="val.id" :key='ind'></el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="申请城市" label-width='105px'>
						    <el-select v-model="search.applyCity" placeholder="请选择" clearable>
						      <el-option v-for = '(val,ind) in applyCity' :label='val.cityName' :value="val.id" :key='ind'></el-option>
						      <!--<el-option label="区域二" value="beijing"></el-option>applyCity-->
						    </el-select>
						</el-form-item>
						<el-form-item label="申请时间" label-width='105px'>
						    <el-date-picker
						      	v-model="search.applyDate"
                    			:editable='false'
						      	 type="daterange"
						      	range-separator="至"
						        start-placeholder="开始日期"
						        end-placeholder="结束日期"
						        value-format="yyyy-MM-dd"
						      >
						    </el-date-picker>
						</el-form-item>

					</div>
          <div v-if="permission.ShowRemainTime">
            <el-form-item label="当前环节停留时间（h）" label-width='160px' class="ShowRemainTime">
              <el-input  v-model="search.remainTimeBegin" @input='checkDateMin' @blur="checkChange"></el-input> -
              <el-input  v-model="search.remainTimeEnd" @input='checkDateMax' @blur="checkChange"></el-input>
            </el-form-item>
          </div>
				</div>
			</div>
		</el-form>
	</div>
	<!--搜索条件中的组织架构弹框-->
	<div class="" id="tree" v-show='showTree'>
		<el-dialog title="请选择" width='500px' :visible.sync="showTree">
			<div class="a1">
				<Tree :arrData='data' @handleNodeClick='handleNodeClick'></Tree>
			</div>
		</el-dialog>
	</div>
	<!--搜索条件中的组织架构弹框--END-->

 </div>
</template>

<script>
import api from "@/api/index";
import Tree from "@/components/common/Tree";
import Pagination from "@/components/common/Pagination";
export default {
  name: "allOrder",
  props: {
    permission: {
      type: Object,
      default: function() {
        return {
          showAllPararms: false, //'申请中','审批中','还款中','已结清'
          showOrderState: false, //是否要展示高级搜索的‘订单状态’的条件
          showOrderNode: false, //是否要展示高级搜索的‘订单环节’的条件
          onlyOrderNode: false, //true是申请中页面控制的订单环节，fasle是审批中页面控制的订单环节
          showReject: false,
          showOnlyCheck: true,
          ShowRemainTime: false,
          fllowResult: false,
          showUp: false,
          detailCode: null,
          showCustomer: false,
          searchContent: "请输入姓名、手机号或身份证号码精确查询"
        };
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    checkListName: {
      type: Array,
      default: function() {
        //				['申请中','审批中','还款中','已结清','拒单','挂起']
        //订单状态：1申请中,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,10退件
        //				return ['申请中','审批中','还款中','已结清']
        return [
          { name: "申请中", detailCode: "000001", id: "1" },
          { name: "审批中", detailCode: "000002", id: "2" },
          { name: "还款中", detailCode: "000003", id: "3" },
          { name: "已结清", detailCode: "000004", id: "4" },
          { name: "拒单", detailCode: "000005", id: "5" }
        ];
      }
    },
    productState: {
      type: Array,
      default: function() {
        return [
          { name: "请选择", detailCode: null, id: null },
          { name: "申请中", detailCode: "000001", id: "1" },
          { name: "审批中", detailCode: "000002", id: "2" },
          { name: "还款中", detailCode: "000003", id: "3" },
          { name: "已结清", detailCode: "000004", id: "4" },
          { name: "拒绝", detailCode: "000005", id: "5" }
        ];
      }
    }
    //	    orderNode: {
    //			type: Array,
    //			default:function() {
    //				return []
    //			}
    //		},
    //	     orderNode: [],
  },
  data() {
    return {
      number_s: 5,
      showOrderNodeChild: false,
      title: "全部客户",
      orShow: false,
      showTree: false,
      partName_s: "",
      search: {
        content: "",
        checked: false,
        checkList: [],
        checkListParams: null, //订单状态：1申请中,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,8满标以放款,9流标,10退件
        onlyCheck: false,
        productList: "", //产品系列
        productName: "", //产品名称
        orderStatus: [], //订单状态
        orderNode: "", //订单环节
        partName: "",
        people: "",
        applyProvince: "",
        applyCity: "",
        applyDate: [],
        hangStatus: false, //挂起
        remainTimeBegin: "", //当前环节停留时间
        remainTimeEnd: "",
        followResultList: "", //跟进结果
        checkListCustomer: [] //客服查询条件
      },
      applyProvince: [],
      applyCity: [],
      //	        productList: ['工薪贷','保单贷','助学贷','随意贷'],
      productList: [],
      productList_s: [],
      // productState: ['申请中','审批中','还款中','已结清','拒单'],
      orderNode: [],
      multipleSelectionIdList: "",
      followResultList: [], //根进结果
      checkedCustomer: false,
      checkListNameCustomer: [
        { code: 1, name: "实名升级" },
        { code: 2, name: "信息申请" },
        { code: 3, name: "视频签约" },
        { code: 4, name: "开户" }
      ],
      innitCheckListNameCustomer: [1, 2, 3, 4]
    };
  },
  mounted() {
    this.queryProvinceFn();
    this.queryCrmProTypeInfoFn();
    //		console.log(this.permission.detailCode,11111111111111111)
    this.initOrderNode();
    this.$nextTick(() => {
      if (this.permission.showCustomer) {
        this.queryFollowResult(); // 客服跟进情况
        // this.queryListNameCustomer() // 客服状态
      }
    });
  },
  methods: {
    // 客服中心 状态搜索start
    changeAllValCustomer(flag) {
      if (flag) {
        this.search.checkListCustomer = this.innitCheckListNameCustomer;
      } else {
        this.search.checkListCustomer = [];
      }
      //    	console.log(this.checkListCustomer,412121121)
    },
    changeValCustomer(val) {
      if (val.length == this.checkListNameCustomer.length) {
        this.checkedCustomer = true;
      } else {
        this.checkedCustomer = false;
      }
      console.log(66, val);
    },
    changeRadioCustomer() {},
    // 客服中心 状态搜索end
    initOrderNode() {
      //  		 {name:"申请中",detailCode: '000001',id:"1"},
      //		          {name:"审批中",detailCode: '000002',id:"2"},
      //		          {name:"还款中",detailCode: '000003',id:"3"},
      //		          {name:"已结清",detailCode: '000004',id:"4"},
      if (this.permission.detailCode == "000001") {
        //
        this.queryPageDictionaryDetailFn_s("000001");
      } else if (this.permission.detailCode == "000002") {
        //
        this.queryPageDictionaryDetailFn_s("000002");
      } else if (this.permission.detailCode == "000003") {
        //
        this.queryPageDictionaryDetailFn_s("000003");
      } else if (this.permission.detailCode == "000004") {
        //
        this.queryPageDictionaryDetailFn_s("000004");
      } else if (this.permission.detailCode == "000005") {
        //
        this.queryPageDictionaryDetailFn_s("000005");
      }
    },
    replceNumVal(keys, value) {
      this.$nextTick(() => {
        //^[0-9]*$
        this.search[keys] = value.replace(/[^0-9$]/g, "");
      }, 20);
    },
    checkDateMin(value) {
      this.replceNumVal("remainTimeBegin", value);
    },
    checkDateMax(value) {
      this.replceNumVal("remainTimeEnd", value);
    },
    checkChange() {
      if (this.search.remainTimeBegin && this.search.remainTimeEnd) {
        if (this.search.remainTimeBegin > this.search.remainTimeEnd) {
          this.$message.warning("结束时间必须大于等于开始时间");
          return false;
        }
      }
    },
    changeOrderState(val) {
      //订单状态条件改变时
      //      	this.search.orderNode = ''
      //      	if (val.id != null) {
      //      		this.search.checkList = []
      //      		this.search.checked = false
      //      	}
      //  		if (this.permission.showOrderState && this.permission.showOrderNode) {//订单状态与订单环节联动时
      ////  			if (val==1) {
      ////	    			this.orderNode = this.orderNode_s1
      ////	    			this.showOrderNodeChild = false
      ////	    		} else if (val == 2) {
      ////	    			this.orderNode = this.orderNode_s2
      ////	    			this.showOrderNodeChild = false
      ////	    		} else {
      ////	    			this.orderNode = []
      ////	    			this.showOrderNodeChild = true
      ////	    		}
      //				this.queryPageDictionaryDetailFn(val.detailCode)
      //	    		console.log(this.search.orderState,val,1200000)
      //  		}
    },

    //  	checkOrderNodeFn() {
    //  		if (!this.permission.showOrderState && this.permission.showOrderNode) {//当订单状态不存，只有订单环节存在时
    //  			if (this.permission.onlyOrderNode) {//订单状态的'申请中'对应的订单环节
    //  				this.orderNode = this.orderNode_s1
    //  					console.log(11212112)
    //	    		} else {//订单状态的'审批'对应的订单环节
    //	    			this.orderNode = this.orderNode_s2
    //	    				console.log(11212112)
    //	    		}
    //  		}
    //
    //  	},

    queryCrmProTypeInfoFn() {
      //获取产品列表
      api.queryCrmProTypeInfo({ status: 1 }).then(res => {
        if (res.data.success) {
          this.productList = res.data.data;
          //  				this.productList.unshift({id:'',name:'请选择'})
          console.log(this.productList, "productList");
        } else {
          //  			console.log(res.data,'-=-==-=-=-=-=-=-=-=-')
        }
      });
    },
    changeProductList() {
      this.search.productName = "";
      this.productList_s = [];
      if (this.search.productList) {
        api
          .queryCrmProInfo({ status: 1, cptId: this.search.productList })
          .then(res => {
            if (res.data.success) {
              this.productList_s = res.data.data;
              console.log(this.productList_s, 123133);
            } else {
              this.productList_s = [];
              this.$notify({
                title: "提示",
                message: res.data.msg,
                duration: 1500
              });
            }
          });
      }

      //  		console.log(this.search.productList)
    },
    changeProvince(id) {
      //省，改变时
      this.search.applyCity = "";
      //  		console.log(id,12313213)
      this.queryCityByProvinceIdFn(id);
    },
    queryCityByProvinceIdFn(provinceId) {
      //市
      api.queryCityByProvinceId({ provinceId: provinceId }).then(res => {
        if (res.data.success) {
          this.applyCity = res.data.data;
          console.log(res.data.data);
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    clearProvince() {
      this.applyCity = [];
    },
    queryProvinceFn() {
      //省
      api.queryProvince().then(res => {
        if (res.data.success) {
          this.applyProvince = res.data.data;
          //  				console.log(res.data.data)
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    handleNodeClick(data) {
      console.log(data, "ssssddddd");
      this.search.partName = data.id;
      this.partName_s = data.title;
      this.showTree = false;
      //	        console.log(data,6664444455555);
    },
    //
    showTreeFn() {
      this.showTree = true;
    },

    changeAllVal(val) {
      if (val) {
        this.search.checkList = this.checkListName;
        console.log(val, this.search.checkList, "====");
      } else {
        this.search.checkList = [];
      }
      if (this.permission.showOrderNode && val) {
        //订单环节存在时
        this.queryAllDetailOrder();
        console.log(val, 1200000);
      } else {
        this.orderNode = [];
      }

      this.search.checkListParams = this.returnCheckListParams(
        this.search.checkList
      );
    },
    queryAllDetailOrder() {
      let pararms = {
        code: "000001,000002,000003,000004,000005" // 申请 审批 还款 结清 拒绝
        //	  			["00001","00002","00003","00004","00005"]
      };
      api.queryAllDetailOrder(pararms).then(res => {
        if (res.data.success) {
          this.orderNode = res.data.data;
          // this.orderNode.unshift({name:'请选择',id:''})
        }
        console.log(res.data.data, "==++++++++++++==");
      });
    },
    // 客服中心跟进情况列表
    queryFollowResult() {
      let pararms = {
        code: "000008" // 跟进情况
      };
      api.queryAllDetailOrder(pararms).then(res => {
        if (res.data.success && res.data.data) {
          this.followResultList = res.data.data;
          console.log(res.data.data, "res.data.data");
          // this.followResultList.unshift({name:'请选择',id:'',detailCode:null})
        }
      });
    },
    // queryListNameCustomer(){
    //   api.queryPageDictionary().then(res => {
    //     if (res.data.success){
    //       let checkArr = res.data.data
    //       for(let i=0;i<checkArr.length;i++){
    //         if(checkArr[i].code =='000012' || checkArr[i].code =='000013'||checkArr[i].code =='000014'||checkArr[i].code =='000015'){
    //           this.checkListNameCustomer.push(checkArr[i])
    //         }
    //       }
    //       for (let i = 0; i < this.checkListNameCustomer.length; i++) {
    //       	this.innitCheckListNameCustomer.push(this.checkListNameCustomer[i].code)
    //       }
    //     }
    //   })
    // },
    changeVal(val) {
      if (val.length == this.checkListName.length) {
        this.search.checked = true;
      } else {
        this.search.checked = false;
      }
      //			if (val.length != 0) {
      //				this.queryPageDictionaryDetailFn(val.detailCode)
      //
      //			}
      this.search.checkListParams = this.returnCheckListParams(val);
    },
    changeRadio(index, val) {
      console.log(99, val);
      if (!this.$refs["checkbox" + index][0].isChecked) {
        //选中其中的一个
        this.queryPageDictionaryDetailFn(val.detailCode, "add");
      } else {
        //不选中
        //	   			this.orderNode = []
        this.queryPageDictionaryDetailFn(val.detailCode, "del");
        console.log("===================");
      }

      //	   		console.log(this.$refs['checkbox' + index][0].isChecked)
      //	   		console.log(val,index,4555555555555)
    },
    returnCheckListParams(val) {
      //订单状态：1申请中,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,8满标以放款,9流标,10退件
      let arr = [];
      console.log(val, 1212121121);
      //	   		1申请中,2审批中,3还款中,4已结清,5拒绝,    (6线上筹 资中,7满标,8满标以放款,9流标,) 审批中 10退件 （拒绝）
      for (var i = 0; i < val.length; i++) {
        if (val[i].id == "1") {
          //					str += Number(i + 1)
          arr.push(Number(1));
        } else if (val[i].id == "2") {
          //					str += Number(i + 1)
          arr.push(Number(2),Number(6),Number(7),Number(8),Number(9));
        } else if (val[i].id == "3") {
          //					str += Number(i + 1)
          arr.push(Number(3));
        } else if (val[i].id == "4") {
          //					str += Number(i + 1)
          arr.push(Number(4));
        } else if (val[i].id == "5") {
          //					str += Number(i + 1)
          arr.push(Number(5),Number(10));
        }
      }
      console.log(arr, 1212121121);
      return arr;
    },
    queryPageDictionaryDetailFn(code, type) {
      let pararms = {
        code: code,
        pageSize: 10000,
        status: 1
      };

      api.queryPageDictionaryDetail(pararms).then(res => {
        if (res.data.success) {
          if (type == "add") {
            this.orderNode = this.orderNode.concat(res.data.data);
          } else if (type == "del") {
            res.data.data.forEach((value, index) => {
              let indexCur = this.orderNode.findIndex((val, ind) => {
                return val.id == res.data.data[index].id;
              });
              this.orderNode.splice(indexCur, 1);
            });
          } else {
            this.orderNode = res.data.data;
          }
          //  				console.log(res.data.data,'78778====78787878')
          //					console.log(this.orderNode,'78778====78787878')
        } else {
          //  				this.orderNode = []
        }
        //  			this.showOrderNodeChild = this.orderNode.length > 0 ? false:true
      });
    },
    queryPageDictionaryDetailFn_s(code) {
      let pararms = {
        code: code,
        pageSize: 10000,
        status: 1 // 启用的数据
      };

      api.queryPageDictionaryDetail(pararms).then(res => {
        if (res.data.success) {
          this.orderNode = res.data.data;
          // this.orderNode.unshift({name:'请选择',id:''})
          console.log(11212);
        } else {
          this.orderNode = [];
        }
      });
    },
    showSeniorSearch() {
      this.showTree = false;
      this.orShow = !this.orShow;
      //	   		if(this.orShow) {//清空数据
      ////	  			let clearObj = {
      ////		  			productList: '',//产品系列
      ////		  			productName: '',//产品名称
      ////		  			orderState: '',//订单状态
      ////		  			orderNode: '',//订单环节
      ////		  			partName: '',
      ////          partName_s:'',
      ////		  			people: '',
      ////		  			applyProvince: '',
      ////		  			applyCity: '',
      ////		  			applyDate: []
      ////	  			}
      ////	  			Object.assign(this.search,clearObj)
      //	  		}
    },
    clearFn() {
      this.search.partName = "";
      this.partName_s = "";
    },
    hideSeniorSearch() {
      this.orShow = false;
      this.showTree = false;
      this.applyCity = [];
      this.productList_s = [];
      let clearObj = {
        productList: "", //产品系列
        productName: "", //产品名称
        ////		  			orderState: '',//订单状态
        orderNode: null, //订单环节
        partName: "",
        orderStatus: null, //订单状态
        people: "",
        applyProvince: "",
        applyCity: "",
        applyDate: [],
        hangStatus: false
      };
      this.partName_s = "";
      this.search = Object.assign(this.search, clearObj);
    },
    searchFn() {
      if (this.search.remainTimeBegin && this.search.remainTimeEnd) {
        if (this.search.remainTimeBegin > this.search.remainTimeEnd) {
          this.$message.warning("结束时间必须大于等于开始时间");
          return false;
        }
      }
      this.orShow = false;
      this.$emit("searchFn", this.search);
    },
    rejectFn() {
      // 拒绝
      if (this.$store.state.controlArr.length == 0) {
        this.$notify({
          title: "提示",
          message: "请选择要拒绝的订单",
          duration: 1500
        });
        return false;
      }
      const arr = [];
      this.$store.state.controlArr.forEach((value, index) => {
        arr.push(value.crmApplayId);
      });
      this.multipleSelectionIdList = arr.join(",");
      console.log(this.multipleSelectionIdList, 66666);

      // if (this.multipleSelectionIdList.length == 0) {
      //   this.$notify({
      //     title: '提示',
      //     message: '请选择要拒绝的订单',
      //     duration: 1500
      //   });
      //   return false
      // }

      //
      // this.CustDistributionDialog = true;
      // this.ser_department  = ''
      // this.ser_people  = ''
      // this.idArr = []
      this.tableData = [];

      this.$emit("rejectFn", this.search);
    }
  },
  watch: {
    //  	orShow(val) {
    //  		if (!val) {
    //	  			console.log(this.search,'---------')
    //  		}
    //  	}
  },
  components: {
    Tree,
    Pagination
  }
};
</script>
<style scoped lang="less">
.order-search {
  margin-top: 8px;
  position: relative;
  /*padding-bottom: 5px;*/
  .el-button {
    border-radius: 0;
  }
  .ShowRemainTime {
    .el-input {
      width: 150px;
    }
  }
  .padleft {
    padding-left: 40px;
  }
  .seniorSearch {
    position: absolute;
    width: 100%;
    top: 68px;
    left: 0;
    z-index: 1996;
    border: 1px solid #ccc;
    border-top: 0;
    background-color: #fff;
    /*.pad20 {
		    	padding: 20px;
		    }*/
  }
  .custDistribution {
    position: relative;
    .hideSeniorSearch {
      position: absolute;
      top: 9px;
      right: 10px;
      color: #169bd5;
    }
  }
  .pre {
    position: relative;
  }
  .hideSeniorSearch {
    cursor: pointer;
  }
  #tree {
    position: absolute;
    z-index: 12111221;
    border: 1px solid #ccc;
    top: 40px;
    background-color: #ffff;
    border-radius: 5px;
    width: 200px;
  }
  .a1 {
    margin-top: -40px;
  }
  /*.btn {
			text-align: right;
			margin-top: 20px;
			button {
		    	width: 100px;
			}
		}*/
}
</style>
