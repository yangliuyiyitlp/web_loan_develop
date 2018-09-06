<template>
  <div class="allCustList">
    <!--<TitCommon :title='title'></TitCommon>-->
    <div class="custListWrap">
    	<div class="g20">
	      <search
	        ref='search'
	        @searchFn='searchFn'
	        :permission="permission"
          :data = 'zTreeData'
	      >
	      </search>
      </div>
      <div class="table-wrap">
        <table-list
          :loadingTable = 'loadingTable'
          :tableData='tableData'
          :parameter="parameter"
          @showDialogTableVisible = 'showDialogTableVisible'
          @showDialogFollow="showDialogFollow"
          @showOpenRecord="showOpenRecord"
          @dialogAudio="audioShow"
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
      <!--跟进弹框-->
      <dialog-follow :dialogFollow='dialogFollow' :rowFollowId = 'rowFollowId' ref="childDialogFollow"></dialog-follow>
      <!--录音文件弹框-->
      <audio-file :dialogFollow='dialogFollow' :rowFollowId = 'rowFollowId' ref="childDialogAudio"></audio-file>
    </div>
  </div>
</template>

<script>
  import api from "@/api/index"
  import pageSize from "@/api/myPageSize"
//import TitCommon from '@/components/common/TitCommon'
  import Pagination from '@/components/common/Pagination'
  import TableList from '@/components/customerService/TableList'
  import Search from '@/components/common/OrderAndCustomerSearch'
  import DialogFollow from '@/components/common/customerDialog'
  import AudioFile from '@/components/common/AudioFileDetail'

  export default {
    name: 'CS_MyOrderList',
    data() {
      return {
        title: '我的处理列表',
        currentPage:1,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        nodeNum:'',
        serachPararms:{},
        rowFollowId: null,
        tableData: [],
        zTreeData: [],
        treeData:[],
        loadingTable: false,
        dialogFollow:{
          dialogFollowVisible:false,
          dialogOpenRecord:false,
          dialogAudio:false
        },
        parameter:{
          operatorList:false,
        },
        permission:{
          searchContent:"姓名或手机号或身份证号码精确查询",
          followResultList:true,
          showCustomer:true
        }
      }
    },

    computed: {
    },
    mounted() {
      this.queryApplyOrderInfoFn()
      this.getDepartmentZtreeFn()
    },
    created() {
      if( pageSize.getMyPageSize(this.pageSize)){
        this.pageSize=pageSize.getMyPageSize(this.pageSize)
      }
      // if (JSON.parse(localStorage.getItem('myPageSize'))){
      //   this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).orderPool_List?JSON.parse(localStorage.getItem('myPageSize')).orderPool_List:10
      // } else {
      //   let obj = {}
      //   localStorage.setItem('myPageSize',JSON.stringify(obj))
      // }
    },
    methods: {
      queryApplyOrderInfoFn() {
      
        this.loadingTable = true
        let s_time,e_time
        if (this.serachPararms.applyDate) {
          s_time = this.serachPararms.applyDate[0]
          e_time = this.serachPararms.applyDate[1]
        } else {
          s_time = ''
          e_time = ''
        }
        if(this.serachPararms.checkListCustomer){
          this.nodeNum = this.serachPararms.checkListCustomer.join(',')
        }
        const pararms = {
          number:2,
//        currentModuleId: this.$route.query.menuId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          queryParam: this.serachPararms.content,//姓名 身份证
          applyTimeBegin: s_time,
          applyTimeEnd: e_time,
          proTypeId:  this.serachPararms.productList,// 产品系列
          proId: this.serachPararms.productName, //产品名称
          department: this.serachPararms.partName, //分公司
          empQueryParam: this.serachPararms.people, //业务员姓名
          provId: this.serachPararms.applyProvince,  //省份
          cityId: this.serachPararms.applyCity, //城市
          nodeNum:this.nodeNum,
          followupResult:this.serachPararms.followResultList
        }
        api.queryCustomerService(pararms).then(res => {
            this.tableData = []
        this.total = 0
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
      queryPageDictionaryDetailFn(code,type) {
        let pararms = {
          code: code,
          pageNo:1,
	  			pageSize: 1000,
					status:1
        }

        api.queryPageDictionaryDetail(pararms).then(res => {
          if (res.data.success) {
            if (type == 'add') {
              this.orderNode = this.orderNode.concat(res.data.data)
            }else if (type == 'del') {
              res.data.data.forEach((value, index)=>{
                let indexCur = this.orderNode.findIndex((val, ind)=>{
                  return val.id == res.data.data[index].id
                })
                this.orderNode.splice(indexCur,1)
              })
            }

          } else {
          }
        })
      },
      showDialogFollow(row,orShow){ // 跟进弹框展示
        this.dialogFollow.dialogFollowVisible = orShow
        this.dialogFollow.myOrderList = true
        this.rowFollowId = row.crmCustInfoId
        this.$nextTick(function () {
          this.$refs.childDialogFollow.queryFollowList(row.crmApplayId) // 方法2 父组件调用子组件方法

        })
      },
      showOpenRecord(row,orShow){// 开户记录
        this.dialogFollow.dialogOpenRecord = orShow
        this.$nextTick(function () {
          this.$refs.childDialogFollow.queryOpenRecord(row) // 方法2 父组件调用子组件方法

        })
      },
      audioShow(row,orShow){//录音文件
        this.dialogFollow.dialogAudio = orShow
        this.$nextTick(function () {
          this.$refs.childDialogAudio.queryAudioList(row) // 方法2 父组件调用子组件方法

        })
      },
      showDialogTableVisible(row,orShow) {
        console.log(row,orShow)
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
      handleSizeChange(val) {
        this.currentPage = 1
        this.pageNo = 1
        pageSize.setMyPageSize(val)
        // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
        // myPageSize.orderPool_List = val
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
    components: {
//    TitCommon,
      TableList,
      Search,
      Pagination,
      DialogFollow,
      AudioFile
    }

  }
</script>
<style lang="less" scoped>
  /*.allCustList {
    .table-wrap {
      padding-top: 20px;
      .el-table th {
        padding: 9px 0;
      }
      .el-table td{
        padding: 3px 0;
      }
    }

  }*/
</style>
