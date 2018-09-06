<template>
 <div class="allCustList">
 	<!--<TitCommon :title='title'></TitCommon>-->
   <div class="custListWrap">
     <search
       ref='search'
       :data = 'zTreeData'
       @searchFn='searchFn'
       :permission ='permission'>
     </search>
     <div class="table-wrap">
       <table-list
         :loadingTable = 'loadingTable'
         :tableData='tableData'
         :minitorList='minitorList'
         @forWard = 'forWard'
         @viewData = 'viewData'
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
<div>
  <!--跟进弹框-->
  <dialog-follow :dialogFollow='dialogFollow' :rowFollowId = 'rowFollowId' ref="childDialogFollow"></dialog-follow>
</div>
   </div>
 </div>
</template>

<script>
//import TitCommon from '@/components/common/TitCommon'
import Pagination from "@/components/common/Pagination";
import Search from "@/components/loanManage/Search";
import DialogFollow from "@/components/loanManage/dialog/DialogFollowMini";
import TableList from "@/components/loanManage/LoanTableList";
import api from "@/api/index";
import pageSize from "@/api/myPageSize";

export default {
  name: "L_MinitorList",
  data() {
    return {
      title: "放款监测订单",
      currentPage: 1,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      minitorList: true,
      rowFollowId: null,
      dialogFollow: {
        dialogFollowVisible: false
      },
      loadingTable: false,
      zTreeData: [],
      serachPararms: {}
    };
  },
  created() {
    if (pageSize.getMyPageSize(this.pageSize)) {
      this.pageSize = pageSize.getMyPageSize(this.pageSize);
    }
    // if (JSON.parse(localStorage.getItem('myPageSize'))) {
    //   this.pageSize = JSON.parse(localStorage.getItem('myPageSize')).MinitorList?JSON.parse(localStorage.getItem('myPageSize')).MinitorList:10
    // } else {
    //   let obj = {}
    //   localStorage.setItem('myPageSize',JSON.stringify(obj))
    // }
  },
  computed: {
    permission() {
      return {
        showAllPararms: true,
        typeNameIndex: 2
      };
    }
  },
  mounted() {
    this.queryMiniList();
    this.getDepartmentZtreeFn();
  },
  methods: {
    searchFn(data) {
      this.currentPage = 1;
      this.pageNo = 1;
      console.log(66, data);
      this.serachPararms = Object.assign(this.serachPararms, data);
      //		let arrCheckList = this.serachPararms.checkList
      if (!this.serachPararms.checkListParams) {
        this.serachPararms.checkListParams = "";
      }
      this.queryMiniList();
    },
    queryMiniList() {
     
      this.loadingTable = true;
      let s_time, e_time;
      if (this.serachPararms.applyDate) {
        s_time = this.serachPararms.applyDate[0];
        e_time = this.serachPararms.applyDate[1];
      } else {
        s_time = "";
        e_time = "";
      }
      const pararms = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        queryParam: this.serachPararms.content, //姓名|手机|身份证号查询参数
        monitoringStatus: this.serachPararms.checkedCurrent, //全部 状态
        oneSelf: this.serachPararms.onlyCheck, //仅查看我的客户
        proTypeId: this.serachPararms.productList, //产品系列
        proId: this.serachPararms.productName, //产品名称
        department: this.serachPararms.partName, //公司|部门
        empQueryParam: this.serachPararms.people, //归属人
        loanDayBegin: this.serachPararms.overDateStart, //放款天数开始
        loanDayEnd: this.serachPararms.overDateEnd, //放款天数结束
        provId: this.serachPararms.applyProvince, //省份
        cityId: this.serachPararms.applyCity, //城市
        loanTimeBegin: s_time, //放款时间开始
        loanTimeEnd: e_time, //放款时间结束
        currentModuleId: this.$route.query.menuId
      };
      console.log(pararms);
      api.queryMiniList(pararms).then(res => {
         this.total = 0;
      this.tableData = [];
        this.loadingTable = false;
        if (res.data.success) {
          this.total = res.data.total;
          this.tableData = res.data.data;
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    forWard(row) {
      this.dialogFollow.dialogFollowVisible = true;
      this.rowFollowId = row.crmCustInfoId;
      this.$nextTick(function() {
        this.$refs.childDialogFollow.pageStart(); // 方法2 父组件调用子组件弹框里面的方法 每次点击跟进 页面都是在第一页
        this.$refs.childDialogFollow.queryFollowList(); // 方法2 父组件调用子组件弹框里面的方法
      });
    },
    viewData(row) {
      var routeData = this.$router.resolve({
        path: "/detail/orderDetail",
        query: {
          crmApplayId: row.crmApplyId
        }
      });
      window.open(routeData.href);
      console.log("href:", routeData);
    },
    handleSizeChange(val) {
      console.log(val);
      this.currentPage = 1;
      this.pageNo = 1;
      pageSize.setMyPageSize(val);

      // let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
      // myPageSize.MinitorList = val
      // localStorage.setItem('myPageSize',JSON.stringify(myPageSize))

      this.pageSize = val;
      this.queryMiniList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.currentPage = val;
      this.queryMiniList();
    },
    getDepartmentZtreeFn() {
      //    	alert(111)
      api.getDepartmentZtree({ groupId: "" }).then(res => {
        if (res.data.status == 1) {
          this.zTreeData = this.toTree(res.data.ztree);
        } else {
          this.$notify({
            title: "提示",
            message: res.data.msg,
            duration: 1500
          });
        }
      });
    },
    toTree(ary, data) {
      var _this = this;
      var data = data
        ? data
        : (function(ary) {
            var tempAry = [];
            var idList = [];
            ary.forEach(function(item) {
              idList.push(item.id);
            });
            for (var i = 0, len = ary.length; i < len; i++) {
              if (
                ary[i].pId == undefined ||
                (ary[i].pId != undefined && _this.debFn(ary[i].pId, idList))
              ) {
                var obj = {
                  title: ary[i].name,
                  id: ary[i].id
                };
                tempAry.push(obj);
              }
            }
            return tempAry;
          })(ary);
      var temp = 0;
      if (data.constructor == Array) {
        for (var i = 0, len = data.length; i < len; i++) {
          for (var j = 0, lenA = ary.length; j < lenA; j++) {
            if (ary[j].pId == data[i].id) {
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
      if (temp > 0) {
        if (data.constructor == Array) {
          for (var n = 0, lenB = data.length; n < lenB; n++) {
            data[n].children = this.toTree(
              ary,
              data[n].children ? data[n].children : []
            );
            if (data[n].children.length == 0) {
              delete data[n].children;
            }
            //							delete data[n].id;
          }
        }
      } else {
        for (var n = 0, lenB = data.length; n < lenB; n++) {
          //						delete data[n].id;
        }
      }
      return data;
    },
    debFn(id, idList) {
      var flag = true;
      for (var ida in idList) {
        if (id == idList[ida]) {
          flag = false;
        }
      }
      return flag;
    }
  },
  components: {
    //	TitCommon,
    Search,
    Pagination,
    DialogFollow,
    TableList
  }
};
</script>
