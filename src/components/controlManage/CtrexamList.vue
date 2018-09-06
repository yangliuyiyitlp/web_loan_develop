<template>
  <div class="allCustList">
    <!--<TitCommon :title='title'></TitCommon>-->
    <div class="custListWrap">
      <search
        ref='search'
        :treeData = 'treeData'
        :data = 'zTreeData'
        @searchFn='searchFn'
        @rejectFn="rejectFn"
        :productState="productState"
        :permission ='permission'>
      </search>
      <div class="table-wrap">
        <table-list
          :tablePermisson="tablePermisson"
          :loadingTable = 'loadingTable'
          :tableData='tableData'
          @showOrderDetail = 'showOrderDetail'
          @modifyReject="modifyReject"
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
      <!--拒绝弹框-->
      <div>
        <!--<dialog-follow :dialogFollow='dialogFollow' :rowFollowId = 'rowFollowId' ref="childDialogFollow" :multipleSelectionIdList="multipleSelectionIdList"></dialog-follow>-->
        <el-dialog title="拒单" width='550px'  center :visible.sync="dialogFollow.dialogFollowVisible" :close-on-click-modal="false">
          <el-form :model="form" ref="form" :rules="form_rules">
            <el-form-item label="订单编号：" class="formNum" v-if="orderNo">
              <div  class="line-limit-length">{{orderNumber}}</div >
            </el-form-item>
            <el-form-item label="拒单原因："  prop="refuseReason" class="rejectInfo">
              <el-form-item class="proviceCity">
              <el-select v-model="form.categories"  placeholder="请选择" @change='changeHead' clearable >
                <el-option v-for = '(val,ind) in reasonFirst' :label='val.value' :value="val.code" :key='ind'></el-option>
              </el-select>
              </el-form-item>
              <!--<el-form-item class="applyCity" >-->
              <!--<el-select v-model="form.subcategories" placeholder="请选择" @change='changeInfo' clearable >-->
                <!--<el-option v-for = '(val,ind) in reasonSecond' :label='val.value' :value="val.code" :key='ind'></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <el-form-item class="applyCity" >
                <el-select v-model="form.subcategories" placeholder="请选择" value-key="code" @change='changeInfo' clearable >
                  <el-option v-for = 'val in reasonSecond' :label='val.value' :value="val" :key='val.code'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item  class="applyArea" >
              <el-select v-model="form.refuseReason" placeholder="请选择" value-key="code" clearable>
                <el-option v-for = 'val in reasonThree' :label='val.value' :value="val" :key='val.code'></el-option>
              </el-select>
              </el-form-item>
            </el-form-item>

            <el-form-item label="备注说明：" prop="remark" class="textPro">
              <el-input type="textarea" v-model.trim="form.remark" :maxlength = '200'  :autosize="{ minRows: 4}"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <div class='text-rt'>
              <el-button @click="dialogFollow.dialogFollowVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirm_follow(form)" :loading='saveFollow'>确 定</el-button>
            </div>
          </div>
        </el-dialog>
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
  import Search from '@/components/controlManage/ControlSearch'
  // import DialogFollow from '@/components/controlManage/DialogCtrall'

  export default {
    name: 'CT_CtrexamList',
    data() {
      // var validateCon = (rule, value, callback) => {
      //   if (!value.code ) {
      //    return  callback(new Error('请选择拒单原因'));
      //   } else {
      //     callback();
      //   }
      // };

      return {
        title: '审批中订单',
        currentPage:1,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        serachPararms:{},
        rowFollowId: null,
        tableData: [],
        zTreeData: [],
        treeData: [],
        loadingTable: false,
        orderNo:true,
        multipleSelectionIdList:"",
        orderStatus:'',
        orderNumber:'',
        dialogFollow: {
          dialogFollowVisible: false

        },
        productState: [{name:"申请中",id:"1"},{name:"审批中",id:"2,6,7,8,9"}],
        saveFollow:false,
        formLabelWidth: '80px',
        form: {
          crmApplayId: '',
          remark: '',
          rejectReasonNumber: '',
          rejectReason: '',
          subcategories:{},
          refuseReason:{}
        },
        form_rules:{
          remark:[
            {required:true, message: '请输入备注说明', trigger: 'blur,change' }
          ],
          // categories: [
          //   {   required: true, message: '请选择拒单原因', trigger: 'change' },
          // ],
          // subcategories: [
          //   {   required: true, message: '请选择拒单原因', trigger: 'change' },
          // ],
          refuseReason: [
            {   required: true, message: '请选择拒单原因', trigger: 'change' },
            // { validator: validateCon, trigger: 'blur,change' }
          ]
        },
        reasonFirst:[],
        reasonSecond:[],
        reasonThree:[],
        categories:''
      }
    },

    computed: {
      permission () {
        return {
          showAllPararms: false,//'申请中','审批中','还款中','已结清'
          showOrderState: true, //是否要展示高级搜索的‘订单状态’的条件
          showOrderNode: true, //是否要展示高级搜索的‘订单环节’的条件
          onlyOrderNode: true, //true是申请中页面控制的订单环节，fasle是审批中页面控制的订单环节
          showReject:true,
          showOnlyCheck:false,
          ShowRemainTime:true,
          showUp:true
        }
      },
      tablePermisson(){
        return{
          systemResidenceTime: true,//系统停留时间
          orderStatus: false, //订单状态
          orderStatusControl:true,//订单状态2
          hangTime: false, //挂起时间
          nodeName: false, //环节
          segment:true,//环节2
          detailBtn: true, //订单详情的‘查看’按钮
          remainTime:true,//停留时间
          hangStatus:true, //挂起状态
          rejectBtn:true,
          showSelection:true,
          applicationTime:true,
          applyTime:false
        }
      },
    },

    mounted() {
      this.getDepartmentZtreeFn()
      this.queryApplyOrderInfoFn()
      this.$refs.search.checkOrderNodeFn()
    },
    created() {
      if( pageSize.getMyPageSize(this.pageSize)){
        this.pageSize=pageSize.getMyPageSize(this.pageSize)
      }
      // if (JSON.parse(localStorage.getItem('myPageSize'))){
      //   this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).C_ControlList?JSON.parse(localStorage.getItem('myPageSize')).C_ControlList:10
      //   console.log(JSON.parse(localStorage.getItem('myPageSize')).C_ControlList)
      // } else {
      //   let obj = {}
      //   localStorage.setItem('myPageSize',JSON.stringify(obj))
      // }
    },
    methods: {
      reviewRefuseReason(){//拒单原因一级
        api.ReviewRefuseReason({type:'1'}).then(res => {
          if(res.data.code ==1) {
            this.reasonFirst = res.data.data
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      changeHead(categories){
        this.form.subcategories = ''
        this.form.refuseReason =''
        this.categories = categories
        this.reasonSecond = []
        this.reasonThree = []
        if(!categories) return
        api.ReviewRefuseReason({type:'2',categories:categories}).then(res => {
          if(res.data.code ==1) {
            this.reasonSecond = res.data.data
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      changeInfo(subcategories){
        this.form.refuseReason =''
        this.reasonThree = []
        if(!subcategories) return
        api.ReviewRefuseReason({type:'3',categories:this.categories,subcategories:subcategories.code}).then(res => {
          if(res.data.code ==1) {
            this.reasonThree = res.data.data
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      confirm_follow(form){ //  拒单
        console.log(56,this.form.refuseReason);
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.saveFollow = true
            api.queryRefuseOrder({
              crmApplayId:this.multipleSelectionIdList,//申请单id(拒单/复活 必填)拒单多个以','隔开
              orderStatus:this.orderStatus,// 订单编号
              remark:this.form.remark, // 备注
              selNumber:this.form.refuseReason.code,//三级编号
              selReaseon: this.form.subcategories.value,//二级原因
            }).then((res) => {
              this.saveFollow = false
              this.$refs['form'].resetFields();
              this.dialogFollow.dialogFollowVisible=false
              this.queryApplyOrderInfoFn()
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
      queryApplyOrderInfoFn() { //获取列表
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
          number:1,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          queryParam: this.serachPararms.content,
          orderStatus: this.serachPararms.orderStatus ||'1,2,6,7,8,9',//订单状态：总控审批中订单默认只展示 审批中和申请中的    1申请中,2审批中,3还款中,4已结清,5拒绝,6线上筹资中,7满标,8满标以放款,9流标,10退件
//			custStatus: [1,2],//客户状态:1未实名,2已实名,3已成交[1,2]
          applyTimeBegin: s_time,
          applyTimeEnd: e_time,
          proTypeId:  this.serachPararms.productList,
          proId: this.serachPararms.productName,
          department: this.serachPararms.partName,
          empQueryParam: this.serachPararms.people,
          nodeCode: this.serachPararms.orderNode,
          hangStatus: this.serachPararms.hangStatus,
          provId: this.serachPararms.applyProvince,
          cityId: this.serachPararms.applyCity,
          remainTimeBegin:this.serachPararms.remainTimeBegin,
          remainTimeEnd:this.serachPararms.remainTimeEnd,
          currentModuleId: this.$route.query.menuId,
        }
        console.log(this.serachPararms,6666)
        console.log(pararms,6666)
       
        api.queryAllControlOrder(pararms).then(res => {
           this.total = 0
            this.tableData =[]
          console.log(898,res);
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
      showOrderDetail(row,orShow) {
        var routeData = this.$router.resolve({
          path: '/detail/orderDetail',
          query: {
            crmApplayId: row.crmApplayId,
            menuId: this.$route.query.menuId
            // orderStatus:row.orderStatus
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
      modifyReject(row){
        this.$nextTick(()=>{
          if(this.$refs.form){
            this.$refs.form.resetFields();
          }
        })
        this.reviewRefuseReason()
        console.log(8989,row);
        this.orderNo=true // 订单编号显示
        this.dialogFollow.dialogFollowVisible=true
        this.multipleSelectionIdList = row.crmApplayId
        this.orderStatus = row.orderStatus
        this.orderNumber  = row.orderNumber // 订单编号
        this.form = Object.assign({},{
          crmApplayId: '',
          orderStatus:'',
          remark: '',
          refuseCode: '',
          refuseReason: ''
        })
      },
      searchFn(data) {
        this.pageNo = 1
        this.currentPage = 1
        this.serachPararms = Object.assign(this.serachPararms,data)
        
        if(!this.serachPararms.orderStatus){
          this.serachPararms.orderStatus = ''
        }
        this.queryApplyOrderInfoFn()
      },
      rejectFn(){
        if ( !this.$store.state.controlArr || this.$store.state.controlArr.length <= 0) {
          this.$message.warning('请选择要拒绝的订单')
          return false
        }

        const arr  = []
        const statusArr =[]
        const arrOrderNumber  = []
        this.$store.state.controlArr.forEach((value, index)=>{
          arr.push(value.crmApplayId)
          statusArr.push(value.orderStatus)
          arrOrderNumber.push(value.orderNumber)
        })
        // if (statusArr.indexOf('1') !== -1 && (statusArr.indexOf('2') !== -1 ||statusArr.indexOf('6') !== -1|| statusArr.indexOf('7') !== -1||statusArr.indexOf('8') !== -1||statusArr.indexOf('9') !== -1)){
        //   this.$message.warning('请选择同一类订单状态')
        //   return false
        // }

        // 如选择多个订单拒绝，则订单编号不展示
        this.multipleSelectionIdList = arr.join(',')
        this.orderStatus = statusArr.join(',')
        if(arrOrderNumber.length==1){
          this.orderNo = true
          this.orderNumber = arrOrderNumber[0]
        }else if(arrOrderNumber.length >=2){
          this.orderNo = false
          this.orderNumber=''
        }
        this.$nextTick(()=>{
          if(this.$refs.form){
            this.$refs.form.resetFields();
          }
        })
        this.reviewRefuseReason()
        // this.orderNumber = arrOrderNumber.join(',')
        this.dialogFollow.dialogFollowVisible=true
        this.form = Object.assign({},{
          crmApplayId: '',
          orderStatus:'',
          remark: '',
          refuseCode: '',
          refuseReason: ''
        })

      },
      handleSizeChange(val) {
        this.pageNo = 1
        this.currentPage = 1
        pageSize.setMyPageSize(val)
        // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
        // myPageSize.C_ControlList = val
        // localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
        this.pageSize = val
        this.queryApplyOrderInfoFn()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.currentPage = val
        this.queryApplyOrderInfoFn()
      },
      getDepartmentZtreeFn() {
        api.getDepartmentZtree({groupId:''}).then(res => {
          if(res.data.status == 1) {
            this.treeData = res.data.ztree
            this.zTreeData = this.toTree(res.data.ztree)
//				console.log(this.zTreeData,123)
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
    watch: {
    	"dialogFollow.dialogFollowVisible"(val) {
    		console.log(val)
    		if (!val) {
    			this.reasonSecond = []
        	this.reasonThree = []
    		}
    	}
    },
    components: {
//    TitCommon,
      TableList,
      Search,
      Pagination
    }

  }
</script>
<style lang="less" scoped>
  .allCustList {
    .line-limit-length {

      display: inline-block;
      width: 368px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .rejectInfo{
      .proviceCity {
        width: 100px;
        float:left;
      }
      .applyCity{
        width: 120px;
        float:left;
        margin:0 5px;
      }
      .applyArea{
        width: 140px;
        float:left;
      }
    }
    .formNum {
       height:40px;
       padding-left:10px!important;

    }
    .textPro {
      .el-textarea{
        width:373px;
        float:left;
      }

    }
    .el-form-item__error{
      left:90px;
    }
  }
</style>
