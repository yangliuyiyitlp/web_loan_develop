<template>
  <div class="allCustList table-wraps">
    <!--<TitCommon :title='title'></TitCommon>-->
    <el-row  type="flex" >
      <el-col  class="searchbox">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label-width='105px'>
            <!--<el-date-picker-->
              <!--v-model="formInline.time"-->
              <!--type="datetimerange"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始时间"-->
              <!--end-placeholder="结束时间"-->
              <!--value-format="yyyy-MM-dd HH:mm:ss"-->
              <!--:default-time="['00:00:00', '00:00:00']">-->
            <!--</el-date-picker>-->
            <el-date-picker
              v-model="formInline.beginTime"
              type="datetime"
              @change="timeChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间">
            </el-date-picker> -
            <el-date-picker
              v-model="formInline.endTime"
              type="datetime"
              @change="timeChange"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item >
            <el-select v-model="formInline.detailCode" placeholder="通知类型">
              <el-option
                v-for="item in states"
                :key="item.id"
                :label="item.name"
                :value="item.detailCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  icon="el-icon-search" @click='search'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click='add'>新增推送</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="custListWrap">
      <div class="table-wrap resetTable">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column align='center' type="index"  width="80" label="序号" >

          </el-table-column>
          <el-table-column
            align='center'
            :show-overflow-tooltip="true"
            prop="type"
            label="类型">
          </el-table-column>
          <el-table-column
            align='center'
            :show-overflow-tooltip="true"
            prop="pushContent"
            label="发送内容">
          </el-table-column>

          <el-table-column
            align='center'
            :show-overflow-tooltip="true"
            prop="createTime"
            label="发送时间">
          </el-table-column>

          <el-table-column
            align='center'
            :show-overflow-tooltip="true"
            prop="operator"
            label="操作人">
          </el-table-column>

        </el-table>
      </div>
      <div class="pad20 alignCen">
        <pagination
          :currentPage = 'currentPage'
          :myPageSizes = 'pageSize'
          :total = 'total'
          @handleSizeChange = 'handleSizeChange'
          @handleCurrentChange = 'handleCurrentChange'
        >
        </pagination>
      </div>
    </div>
    <el-dialog title="消息推送" :visible.sync="banner_DialogVisible" width="35%"  center  @close="addDiaClose" :close-on-click-modal ='false' class="infoListDialog">
      <el-form label-width="130px" ref="addForm" :model="addForm" class="demo-form-inline infoListClass" :rules="addForm_rules" >

        <el-form-item  prop="detailCode"  >
          <el-select v-model="addForm.detailCode" placeholder="请选择通知类型">
            <el-option
              v-for="item in statesAdd"
              :key="item.id"
              :label="item.name"
              :value="item.detailCode">
            </el-option>
          </el-select>
          &nbsp;&nbsp;默认发送所有注册会员
        </el-form-item>
        <el-form-item prop="pushContent">
        <el-input
          @input="descInput"
          type="textarea"
          :rows="5"
          placeholder="请录入需发送消息，限制200个文字以内"
          v-model.trim="addForm.pushContent">
        </el-input>
          <!--<div v-if="showTip" class="showTip">超过最大长度</div>-->
        </el-form-item>

        <p>{{number}}/200</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel_addModify()">取消</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="confirm_add">发送</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from '@/api/index.js'
  import pageSize from "@/api/myPageSize"

//import TitCommon from '@/components/common/TitCommon'
  import TableList from '@/components/custManage/TableList'
  import Pagination from '@/components/common/Pagination'
  export default {
    name: 'SYC_InfoList',
    data() {
      return {
        buttonLoading:false,
        title: '消息推送',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        banner_DialogVisible:false,
        currentPage:1,
        total: 1,
        pageNo: 1,
        pageSize: 10,
        tableData: [],
        formInline:{
          "detailCode": null
        },
        states:[{
          "id": "99999999",
          "name": "全部",
          "detailCode": null
        }],
        statesAdd:[{
          "id": "99999999",
          "name": "请选择通知类型",
          "detailCode": null
        }],
        addForm:{
          detailCode:null,
          pushContent:''
        },
        addForm_rules:{
          detailCode:[
            {required:true, max:50,message: '请选择通知类型', trigger: 'blur' }
          ],
          pushContent:[
            {required:true, message: '请录入发送消息', trigger: 'change' },
            { min: 1, max: 200, message: '超过最大长度', trigger: 'blur' }
          ]
        },
        number:200,
      sumLen:0,
        showTip:false
      }
    },
    created() {
      if( pageSize.getMyPageSize(this.pageSize)){
        this.pageSize=pageSize.getMyPageSize(this.pageSize)
      }

      // if (JSON.parse(localStorage.getItem('myPageSize'))) {
      //   this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).infoList?JSON.parse(localStorage.getItem('myPageSize')).infoList:10
      //   console.log(JSON.parse(localStorage.getItem('myPageSize')).infoList)
      // } else {
      //   let obj = {}
      //   localStorage.setItem('myPageSize',JSON.stringify(obj))
      // }
    },
    mounted(){
      this.queryDictionary();
      this.queryInfoList();
    },
    methods: {
      descInput(){ //校验字符或者文字
        // let len=0
        // let maxLen = 0
        let txtVal = this.addForm.pushContent;
        let len = 0
        for (let i = 0; i < txtVal.length; i++) {
          //   let a = txtVal.charAt(i);
          //   if (a.match(/[^\x00-\xff]/ig) != null)
          //   {
              len += 1;
          //   }
          //   else
          //   {
          //     maxLen+=0.5;
          //   }
          // this.sumLen = len+maxLen
          }
        if(len>200){
          len=200
          // this.showTip = true
        }
        // else{
        //   this.showTip = false
        // }
        this.number = parseInt(200 - len);
      },
      handleSizeChange(val) {
        this.pageNo = 1
        this.currentPage = 1
        pageSize.setMyPageSize(val)
        // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
        // myPageSize.infoList = val
        // localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
        this.pageSize = val
        this.queryInfoList();

      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.currentPage = val
        this.queryInfoList();
      },
      // queryStatus(){
      //   api.queryPageDictionary({name:'通知类型'}).then(res=>{
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
      // },
      queryDictionary(code){
        api.queryAllDetailOrder({code:'000006',status:1}).then(res=>{
          console.log(111,res)
          if(res.data.success){
            for (var i=0; i < res.data.data.length;i++) {

              this.statesAdd.push(res.data.data[i])
              this.states.push( res.data.data[i])
            }
            // this.states.unshift()

            console.log(8989,  this.statesAdd);
          } else {
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }
        })
      },
      timeChange(val){
       if(this.formInline.beginTime && this.formInline.endTime){
         if(this.formInline.beginTime>this.formInline.endTime){
           this.$message.warning("开始时间需早于结束时间")
           return false
       }
       }
      },
      search(data) {
        console.log(778787878)
        this.pageNo = 1
        this.currentPage =1
        // this.pageSize = 10

        this.queryInfoList()
      },
      queryInfoList(){
        // if(this.formInline.time && this.formInline.time.length == 2){
        //   this.formInline.beginTime=this.formInline.time[0]
        //   this.formInline.endTime=this.formInline.time[1]
        // }else{
        //   this.formInline.beginTime=""
        //   this.formInline.endTime=""
        // }
        if(this.formInline.beginTime && this.formInline.endTime){
          if(this.formInline.beginTime>this.formInline.endTime){
            this.$message.warning("开始时间必须小于等于结束时间")
            return false
          }
        }
        if(this.formInline.beginTime && !this.formInline.endTime){
            this.$message.warning("开始时间和结束时间需都选择")
            return false
        }
        if(!this.formInline.beginTime && this.formInline.endTime){
          this.$message.warning("开始时间和结束时间需都选择")
          return false
        }
        const pararms = {
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          beginTime:this.formInline.beginTime,
          endTime:this.formInline.endTime,
          typeCode:this.formInline.detailCode
        }
        
        api.queryInfoList(pararms).then(res=>{
          this.total = 0;
            this.tableData =[]
          console.log(res)
          if(res.data.code == 1){
            this.total = res.data.total;
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
      add(){
        this.buttonLoading = false;
        this.banner_DialogVisible = true;
        this.addForm={
          pushContent:'',
          detailCode:null
        }
      },
      confirm_add(){
        // if(this.showTip){
        //   return false
        // }
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            console.log(666)
            this.buttonLoading = true;
            api.infoListAddPushMsg({
              pushContent:this.addForm.pushContent,
              typeCode:this.addForm.detailCode,
              sendNum:1 //推送标识(1:后台推送 2:app推送)"
            }).then(res=>{
              this.buttonLoading = false;
              if(res.data.success){
                this.queryInfoList()
                this.$message.success(res.data.msg);
                this.banner_DialogVisible = false;
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            return false;
          }
        })
      },
      addDiaClose(){
        Object.assign(this.addForm,{
          pushContent:'',
          detailCode:null
        })
        // this.showTip = false
        this.number=200
        this.$nextTick(()=>{
          this.$refs.addForm.resetFields();
        })
      },
      cancel_addModify(){
        // this.showTip = false
        this.banner_DialogVisible = false;
        this.number=200
        this.$refs['addForm'].resetFields();
      }
    },

    components: {
//    TitCommon,
      TableList,
      Pagination
    }

  }
</script>
<style  lang="less" >
.infoListClass {
  .el-form-item__content{
    margin-left:0!important;
  }
  .el-select{
    width:200px;
    float:left;
  }
  p{
    float:right;
  }
  .showTip{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
