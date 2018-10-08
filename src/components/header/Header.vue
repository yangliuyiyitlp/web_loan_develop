<template>
  <div class="header-wrap">
    <div class="con-wrap clearfix">
    	<div class="logo">
    		<img src="../../assets/images/logo.png"/>
    	</div>
    	<div class="ulList">
    		<ul class="clearfix router-wrap" v-if='muneList.length != 0'>
    			<li @click="showManger(item,index)" v-for ='(item,index) in muneList' :key='index'>
    				{{item.name}}
    				<transition-group name="list" tag="div">
	    				<div class="router_list" :key='index' v-if="showObj['show' + (index+1)]">
			    			<div class="cust-wrap">
			    				<ul class="clearfix" v-if='item.list.length != 0 && item.list'>
			    					<li class='' v-for ='(val,ind) in item.list' :key='ind'>
			    						<div class="tit"><i :class="val.icon"></i>{{val.name}}</div>
			    						<div v-if='val.list.length != 0 && val.list' class="clearfix">
			    							<div class="routerItem"
			    								v-for = "(valChild,indChild) in val.list" :key='indChild'>

			    								<!--<router-link :to="valChild.url" @click.native.stop='showTag(valChild)'>{{valChild.name}}</router-link>-->
			    								<router-link :to="{ path: valChild.url, query: { menuId: valChild.id }}" @click.native.stop='showTag(valChild)'>{{valChild.name}}</router-link>
			    								<!--<router-link :to="valChild.url + '/' + valChild.id" @click.native.stop.prevent='showTag(valChild)'>{{valChild.name}}</router-link>-->
			    							</div>
			    						</div>
			    					</li>
			    				</ul>
			    			</div>
			    		</div>
    			</transition-group>
    			</li>
    		</ul>
    	</div>
    	<div class="rt head-rt">
	        <span class="isInLine" @click="goInline" slot="reference" v-if="isCustomer">
	            <i class="circle"></i>
	            <span class="isStatus" >{{isStatus}}</span>
	            <span class="bottom" >
	         		<i class="bottom-arrow1"></i>
	         		<i class="bottom-arrow2"></i>
	            </span>
				<div class="setOnline" v-show="isInLine" >
					<!--{{nowStatus}}-->
					<p :class="{ activeLine: isActive}"  @click.stop="setOnLine(1)" ><i class="inLine line_s1" ></i>在线</p>
					<p :class="{ activeLine_s: isActive_s}" @click.stop="setOnLine(0)"><i class="outLine line_s2"   ></i>离线</p>
				</div>
	        </span>
    		<span class="admin-wrap">
					<!--<el-popover
					  placement="bottom"
					  width="160"
					  v-model="visiblePassWord">
					  <div style="text-align: center;font-size: 16px;">
					    <el-button size="mini" type="text" @click="showModifyPassWord" style="font-size: 15px">修改密码</el-button>
					  </div>
					  <i class="" slot="reference"></i>
					</el-popover>-->
				<i class=""></i>
    			{{loginName}}，您好！
    		</span>
    		<span class="login-out" @click.stop='loginOut' >
    		<i class=""></i>
    			退出登录

    		</span>
    	</div>
    </div>
	  <!--<div class="tagViews">
			<tag-views></tag-views>
	  </div>-->
	  <modify-pass-word :dialogPassVisible = 'dialogPassVisible'></modify-pass-word>
  </div>
</template>

<script>
import TagViews from "@/components/TagViews";
import ModifyPassWord from "@/components/header/ModifyPassWord";
import api from "@/api/index";
import { baseURL } from "@/api/config.js";

export default {
  data() {
    return {
      isCustomer: true,
      isActive: true,
      isActive_s: false,
      visiblePassWord: false,
      show: false,
      show2: false,
      show3: false,
      showObj: {
        show1: false,
        show2: false,
        show3: false
      },
      dialogPassVisible: {
        outerVisible: false,
        innerVisible: false
      },
      isInLine: false,
      isStatus: "",
      nowStatus: "",
      loginName: ""
    };
  },
  props: {
    muneList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  mounted() {
    this.queryLoginInName(); // 获取登录人姓名
    // 进页面的初始值
    //  this.isStatus='在线'
    // $('.circle').addClass('inLine')
    this.updateCustomerStatus(null);
  },
  methods: {
    queryLoginInName() {
      api.queryLoginName().then(res => {
        this.loginName = res.data;
      });
    },
    // 退出
    loginOut() {
      this.$confirm("您将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          //      	console.log(api.queryMyLogout,"api.queryMyLogout")
          //        window.location.href = api.queryMyLogout
          //        setTimeout(()=>{
          //        	window.location.reload()
          //        },1000)
          //        debugger

          // window.location.href= baseURL + "/logout"

          if (this.isCustomer && this.isStatus == "在线") {
            api
              .updateCustomerStatus({ status:'0' })
              .then(res => {
                window.location.href = baseURL + "/sys/logout";
              })
              .catch(err => {
                this.$notify({
                  title: "提示",
                  message: "退出设置离线失败",
                  duration: 1000
                });
              });
          } else {
            window.location.href = baseURL + "/sys/logout";
          }

          setTimeout(() => {
            window.location.reload();
          }, 1000);
          //      	debugger
          //      	console.log(baseURL + "/sys/logout")
        })
        .catch(() => {
          debugger;
          this.$message({
            type: "info",
            message: "取消退出"
          });
        });

      //      window.location.reload()
    },
    goInline() {
      // 在线 离线
      if (this.isInLine) {
        this.isInLine = false;
      } else {
        this.isInLine = true;
      }
      if (this.isStatus == "离线") {
        this.nowStatus = "设置在线";
      } else {
        this.nowStatus = "设置离线";
      }
    },
    updateCustomerStatus(status, isTrue) {
      // 在线离线接口
      api
        .updateCustomerStatus({ status: status })
        .then(res => {
          if (res.data.success && !res.data.data) {
            //改变在线离线
            if (isTrue) {
              this.isActive = true;
              this.isActive_s = false;
              this.isStatus = "在线";
              $(".circle").addClass("inLine");
              $(".circle").removeClass("outLine");
            } else {
              this.isActive = false;
              this.isActive_s = true;
              this.isStatus = "离线";
              $(".circle").addClass("outLine");
              $(".circle").removeClass("inLine");
            }
          } else if (
            res.data.success &&
            (res.data.data.status == 0 ||
              res.data.data.status == 1 ||
              res.data.data.status == 3)
          ) {
            // 页面一进来判断是离线还是在线
            if (res.data.data.status == 0) {
              this.isActive = false;
              this.isActive_s = true;
              this.isStatus = "离线";
              $(".circle").addClass("outLine");
              $(".circle").removeClass("inLine");
            } else if (res.data.data.status == 1) {
              this.isActive = true;
              this.isActive_s = false;
              this.isStatus = "在线";
              $(".circle").addClass("inLine");
              $(".circle").removeClass("outLine");
            } else if (res.data.data.status == 3) {
              // 不是客服
              this.isCustomer = false;
            }
          } else if (!res.data.success) {
            this.$notify({
              title: "提示",
              message: "在线状态获取失败",
              duration: 1000
            });
          }
        })
        .catch(err => {
          this.$notify({
            title: "提示",
            message: "在线状态获取失败",
            duration: 1000
          });
        });
    },
    setOnLine(type) {
      //  设置状态
      if (type == "1") {
        this.updateCustomerStatus("1", true);
      } else {
        this.updateCustomerStatus("0", false);
      }
      this.isInLine = false;
    },
    showModifyPassWord() {
      this.visiblePassWord = false;
      this.dialogPassVisible.outerVisible = true;
    },
    showManger(item, index) {
      for (var i = 1; i <= this.muneList.length; i++) {
        if (index + 1 == i) {
          this.showObj["show" + i] = !this.showObj["show" + i];
        } else {
          this.showObj["show" + i] = false;
        }
      }
    },
    showControl() {
      this.showObj.show2 = !this.showObj.show2;
      this.showObj.show1 = false;
      this.showObj.show3 = false;
    },
    showSet() {
      this.showObj.show3 = !this.showObj.show3;
      this.showObj.show1 = false;
      this.showObj.show2 = false;
    },
    showTag(valChild) {
      let isRefresh = window.localStorage.getItem("isRefresh");
      if (isRefresh) {
        //	  			if (isRefresh == 'first') {
        //	  			} else {
        //	  				window.localStorage.setItem("isRefresh","otherMore")
        //	  			}
        window.localStorage.setItem("isRefresh", "first");
      } else {
      }

      //	  		window.localStorage.setItem("closeRoute",valChild.url)
      //	  		this.$route.meta.keepAlive = true
      console.log(this.$route, "12313123132132132131@@", valChild);
      for (var i = 1; i <= this.muneList.length; i++) {
        this.showObj["show" + i] = false;
      }
    }
  },
  components: {
    TagViews,
    ModifyPassWord
  }
};
</script>
<style scoped lang="less">
.header-wrap {
  .con-wrap {
    width: 100%;
    height: 64px;
    padding-top: 1px;
    line-height: 65px;
    /*background-color: #31AFFF;*/
    background: linear-gradient(to right, #02abff, #0794fe);
    background: -webkit-linear-gradient(left, #02abff, #0794fe);
    background: -o-linear-gradient(right, #02abff, #0794fe);
    background: -moz-linear-gradient(right, #02abff, #0794fe);

    position: relative;
    .logo {
      width: 173px;
      height: 48px;
      margin-top: 6px;
      margin-left: 20px;
      margin-right: 70px;
      float: left;
      img {
        width: 100%;
      }
    }
    .head-rt {
      margin-right: 20px;
      color: #fff;
      font-size: 16px;

      span {
        display: inline-block;
      }
      .admin-wrap {
        margin-right: 20px;
        i {
          display: inline-block;
          background: url("../../assets/images/admin.png") no-repeat 0 0;
          width: 20px;
          height: 22px;
          background-size: 100%;
          margin-top: -2px;
          vertical-align: middle;
        }
      }
      .login-out {
        cursor: pointer;
      }
      .login-out i {
        display: inline-block;
        background: url("../../assets/images/loginOut.png") no-repeat 0 0;
        width: 20px;
        height: 17px;
        background-size: 100%;
        margin-top: -2px;
        vertical-align: middle;
      }
    }

    .ulList {
      float: left;
      li {
        cursor: pointer;
        float: left;
        color: #fff;
        font-size: 18px;
        margin-right: 30px;
        font-weight: bold;
        &:last-child {
          margin-right: 0;
        }
        /*&:hover {
						color: red;

					}*/
      }
    }
  }
  .router_list {
    position: absolute;
    top: 65px;
    left: 0;
    width: 100%;
    /*height: 50px;*/
    /*border-width: 1px;
	    border-style: solid;
	    border-color: rgba(204, 204, 204, 1);
			border-top: none;*/
    background-color: #fff;
    z-index: 999999;
  }
  .router-wrap {
    .cust-wrap {
      border: 1px solid #ccc;
      border-top: none;
      ul li {
        float: left;
        width: 300px;
        margin-right: 30px;
        position: relative;
        border-right: 1px solid #c3c3c3;
        margin-top: 20px;
        height: 118px;
        margin-bottom: 30px;
        &:first-child {
          margin-left: 10%;
        }
        &:last-child {
          border-right: none;
        }
        .routerItem {
          line-height: 1;
          font-size: 16px;
          margin-bottom: 15px;
          float: left;
          width: 50%;
          a {
            display: inline-block;
            margin-left: 20px;
            font-size: 14px;
            color: #666;
            font-family: "Microsoft YaHei";
            &:hover {
              color: #29b1ff;
            }
          }
        }
      }
    }
  }
  .tit {
    line-height: 1;
    padding: 0px 0 15px;
    font-family: "Microsoft YaHei";
    font-weight: 600;
    font-style: normal;
    color: #333;
    font-size: 18px;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 1s;
  }
  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateY(100px);
  }
  .isInLine {
    margin-right: 40px;
    position: relative;

    .circle {
      display: inline-block;
      /*margin-right:10px;*/
      width: 16px;
      height: 16px;
      /*border-radius: 50%;*/
      vertical-align: middle;
    }
    /*下箭头*/
    .bottom {
      cursor: pointer;
      position: absolute;
      left: 10px;
      top: -1px;
    }
    .bottom-arrow1,
    .bottom-arrow2 {
      width: 0;
      height: 0;
      display: block;
      position: absolute;
      border-bottom: 8px transparent dashed;
      border-left: 8px transparent dashed;
      border-right: 8px transparent dashed;
      border-top: 8px white solid;
      overflow: hidden;
    }
    .bottom-arrow1 {
      top: 1px; /*重要 #31AFFF */
      left: 56px;
      top: 27px;
      /*border-top:10px #31AFFF solid;*/
      border-top: 10px #0697fe solid;

      z-index: 5; /*兼容ie8-*/
    }
    .bottom-arrow2 {
      left: 56px;
      top: 30px;
      border-top: 10px white solid;
      z-index: 4; /*兼容ie8-*/
    }
    .outLine {
      /*background-color: #ccc;*/
      background: url(../../assets/images/outLine.png) no-repeat;
    }
    .inLine {
      /*background-color: green;*/
      background: url(../../assets/images/onLine.png) no-repeat;
    }
    .line_s1,
    .line_s2 {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      padding-right: 5px;
    }
    .setOnline {
      cursor: pointer;
      width: 100px;
      /* height: 30px; */
      line-height: 30px;
      text-align: center;
      background-color: #fff;
      border-radius: 6px;
      color: #000;
      position: absolute;
      padding: 5px 0;
      top: 50px;
      font-size: 12px;
      z-index: 999999;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .activeLine,
  .activeLine_s {
    background-color: #e7f7ff;
  }
}
/*.el-popover {*/
/*min-width: 80px !important;*/
/*}*/
</style>
