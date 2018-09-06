import axios from 'axios';
import * as types from '../store/types';
import { baseURL, baseURLDownload } from './config.js';



import Vue from 'vue'
import Router from 'vue-router'
import routes from '../router/routes'
Vue.use(Router)


const router = new Router({
    routes: routes
})
const queryString = require('query-string');


var _axios = axios.create({
    baseURL: baseURL,
})

_axios.interceptors.request.use(
    (config) => {
//      if (localStorage.token) {
//          config.headers.accessToken = localStorage.token;
//      }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

_axios.interceptors.response.use(
    (response) => {
 	// console.log(response,"console.log(response.response)")
        return response;
   }, (error) => {
     console.log(error,10000)
console.log(error.response,"console.log(error.response)")
        if (error.response) {
            switch (error.response.status) {

//              case 404:
//                  router.push({ path: '/404' });
//                  break;
//              case 500:
//                  router.push({ path: '/500' });
              	case 401:
                    window.location.href = baseURL+'/sys/logout'
//										window.location.reload()
                    break;
//              case 404:
//                  router.push({ path: '/404' });
//                  break;
//              case 500:
//                  router.push({ path: '/500' });
//                  break;
//              case 500:
//                  router.push({ path: '/500' });
//                  break;
//            case 500:
//              localStorage.clear();
//              router.push({ path: '/500' });
//              location.reload();
//              break;
            }

        }
        return Promise.reject(error);
    }
);


export default {
    //by WQ
    queryBannerList(data, params) {
        return _axios.post("/api/banner/queryPageBanner",queryString.stringify(data), { params: params });
    },
    updateSysBanner(data, params) {
        return _axios.post("/api/banner/updateBanner",queryString.stringify(data), { params: params });
    },
    // upload(data, params) {
    //     return _axios.post("/uploadController/upload",data, { params: params });
    // },
    upload: baseURL + '/api/upload/upload',
  fileUpLoad:baseURL + '/api/upload/fileUpload',
   //退出
   queryMyLogout:baseURL+'/sys/logout',
  // fileUpLoad: 'http://192.168.21.178:8080/microcredit/api/upload/fileUpload',
    queryQuestionList(data, params) {
    	return _axios.post("/api/question/queryQuestionList",queryString.stringify(data), { params: params });
//      return _axios.post("/api/question/queryQuestionList",queryString.stringify(data), { params: params });
    },
    updateQuestion(data, params) {
    	return _axios.post("/api/question/updateQuestion",queryString.stringify(data), { params: params });
//      return _axios.post("/api/question/updateQuestion",queryString.stringify(data), { params: params });
    },
    queryFollowList(data, params) { //查询客户跟进列表
        return _axios.post("/api/followUp/queryFollowList",queryString.stringify(data), { params: params });
    },
    saveFollowInfo(data, params) { //保存客户跟进
        return _axios.post("/api/followUp/saveFollowInfo",queryString.stringify(data), { params: params });
    },
    updateDictionary(data, params) { //新增，修改数据字典大类
        return _axios.post("/api/dictionary/updateDictionary",queryString.stringify(data), { params: params });
    },
    queryPageDictionary(data, params) { //数据字典大类列表分页
        return _axios.post("/api/dictionary/queryPageDictionary",queryString.stringify(data), { params: params });
    },
    queryPageDictionaryDetail(data, params) { //数据字典小类列表分页
        return _axios.post("/api/dictionaryDetail/queryPageDictionaryDetail",queryString.stringify(data), { params: params });
    },
  //数据字典明细
  // queryPageDictionaryDetail(data, params) {
  //   return _axios.post("/api/app/appDictionaryDetail/queryPageDictionaryDetail",queryString.stringify(data), { params: params });
  // },
    updateDictionaryDetail(data, params) { //数据字典小类列表
        return _axios.post("/api/dictionaryDetail/updateDictionaryDetail",queryString.stringify(data), { params: params });
    },
    getCustDetailBase(data, params) { //查询后台客户详细信息注册基本信息
        return _axios.post("/api/custInfoDetail/getCustDetailBase",queryString.stringify(data), { params: params });
    },
    queryAccountInfo(data, params) { //查询账号信息
        return _axios.post("/api/custInfoDetail/queryAccountInfo",queryString.stringify(data), { params: params });
    },
    queryEssentialInfo(data, params) { //查询用户基本信息
        return _axios.post("/api/custInfoDetail/queryEssentialInfo",queryString.stringify(data), { params: params });
    },
    queryLinkManInfo(data, params) { //查询联系人信息
        return _axios.post("/api/custInfoDetail/queryLinkManInfo",queryString.stringify(data), { params: params });
    },
    // queryLinkManInfo(data, params) { //查询联系人信息
    //     return _axios.post("/api/custInfoDetail/queryLinkManInfo",queryString.stringify(data), { params: params });
    // },
    queryOrderList(data, params) { //查询联系人信息
        return _axios.post("/api/orderDetail/queryOrderList",queryString.stringify(data), { params: params });
    },
    queryBaseOrderInfo(data, params) { //查询订单基本信息
        return _axios.post("/api/orderDetail/queryBaseOrderInfo",queryString.stringify(data), { params: params });
    },
    queryPaymentHistory(data, params) { //查询还款记录
        return _axios.post("/api/orderDetail/queryPaymentHistory",queryString.stringify(data), { params: params });
    },
    queryRepaymentPlan(data, params) { //查询还款计划
        return _axios.post("/api/orderDetail/queryRepaymentPlan",queryString.stringify(data), { params: params });
    },
    queryAbout(data, params) { //h5app关于

//      return _axios.get("/api/app/appAbout/queryAppAboutUs",queryString.stringify(data), { params: params });
		return _axios.get("/web/appAbout/queryAppAbout",queryString.stringify(data), { params: params });
    },
    queryNodeListInfo(data, params) { //查询订单节点信息
        return _axios.post("/api/orderDetail/queryNodeListInfo",queryString.stringify(data), { params: params });
    },

    //**********************************************************************************************************
    //保存活动权限
    savaActivityRights(data, params) {
    	return _axios.post("/api/rights/savaActivityRights",data, { params: params });
    },
     //查询活动对应的员工
    queryActivityRightsByActivityId(data, params) {
    	return _axios.post("/api/rights/queryActivityRightsByActivityId",queryString.stringify(data), { params: params });
    },
 	queryMenulist(data, params) {
    	return _axios.get("/auth/menu/list",data, { params: params });
    },
    // queryOperatelist(data, params) {
    //     return _axios.get("/auth/operate/list",data, { params: params });
    // },
    queryOperatelist(params) {  // 案件追踪信息
        return _axios({
            method: 'post',
            url: '/auth/operate/list',
            params: params
        })
    },
	//参数设置:默认值
	queryNewData(data, params) {
    	return _axios.get("/api/paramter/queryParamter",data, { params: params });
    },
    //参数设置： 更新
    queryNewUpdateData(data, params) {
    	return _axios.post("/api/paramter/updateParamter",queryString.stringify(data), { params: params });
    },
    //首页期间金额设置:默认值
    queryPeriodNewData(data, params) {
    	return _axios.get("/api/periodAmount/queryPeriodAmount",data, { params: params });
    },
    queryPeriodUpdateData(data, params) {
    	return _axios.post("/api/periodAmount/updatePeriodAmount",queryString.stringify(data), { params: params });
    },

    //APP关于:默认值
    queryAppAbout(data, params) {
    	return _axios.get("/web/appAbout/queryAppAbout",data, { params: params });
    },
    //APP关于：保存
    saveApp(data, params) {
    	return _axios.post("/web/appAbout/updateAppAbout",queryString.stringify(data), { params: params });
    },

    etitorUpload(data, params) {
//  	return baseURL + "/uploadController/upload"
		return baseURL + "/api/upload/kindEditImgUpload"
    },
    ///department/getDepartmentZtree
    getDepartmentZtree(data, params) {
    	return _axios.get("/department/getDepartmentZtree",data, { params: params });
    },
    //获取客户信息
    queryCustInfoData(data, params) {
    	return _axios.post("/api/customer/queryCustInfo",queryString.stringify(data), { params: params });
    },
    //获取客户详情信息:更改密码
    updateDetailCustPwd(data, params) {
    	return _axios.post("/api/customer/updateCustPwd",queryString.stringify(data), { params: params });
    },
    //获取客户详情信息:更改手机号
    updateDetailRegisterPwd(data, params) {
    	return _axios.post("/api/customer/updateRegisterPwd",queryString.stringify(data), { params: params });
    },
     //获取客户详情信息:冻结/解冻客户
    updateDetailBgCust(data, params) {
    	return _axios.post("/api/customer/updateBgCust",queryString.stringify(data), { params: params });
    },

    //查询省份
    queryProvince(data, params) {
    	return _axios.post("/api/address/queryProvince",queryString.stringify(data), { params: params });
    },
    //查询城市
    queryCityByProvinceId(data, params) {
    	return _axios.post("/api/address/queryCityByProvinceId",queryString.stringify(data), { params: params });
    },
//查询区
queryCityByCityId(data, params) {
  return _axios.post("/api/address/queryDistrictByCityId",queryString.stringify(data), { params: params });
},
    //客户分配：获取业务员信息
    queryCustDistributionByDeptId(data, params) {
    	return _axios.post("/api/distribution/queryEmployeeByDeptId",queryString.stringify(data), { params: params });
    },
    //客户分配：保存
	cuntomerDistribution(data, params) {
    	return _axios.post("/api/distribution/customerDistribution",queryString.stringify(data), { params: params });
    },
  //客户分配：变更业务归属人
  cuntomerChangeSalesman(data, params) {
    return _axios.post("/api/distribution/changeSalesman",queryString.stringify(data), { params: params });
  },
	//全部订单:查询全部订单列表
    queryApplyOrderInfo(data, params) {
    	return _axios.post("/api/allOrder/queryApplyInfo",queryString.stringify(data), { params: params });
    },
    //获取产品信息:查询产品类型信息
    queryCrmProTypeInfo(data, params) {
    	return _axios.post("/api/product/queryCrmProTypeInfo",queryString.stringify(data), { params: params });
    },
    //获取产品信息: 根据产品类型id查询产品信息
    queryCrmProInfo(data, params) {
    	return _axios.post("/api/product/queryCrmProInfo",queryString.stringify(data), { params: params });
    },
    //查看拒单原因
    queryRefusalReason(data, params) {
    	return _axios.post("/api/allOrder/queryRefusalReason",queryString.stringify(data), { params: params });
    },
    //查看挂起原因
    hangupReasonFn(data, params){
    	return _axios.post("/api/orderDetail/hangupReason",queryString.stringify(data), { params: params });
    },
  //查询还款订单列表
  queryMiniList(data, params){
    return _axios.post("/api/allOrder/queryRepaymentOrders",queryString.stringify(data), { params: params });
  },
  queryQueryOrderAmountt(data, params){//订单还款中当前应该还金额
    return _axios.post("/api/orderDetail/QueryOrderAmount",queryString.stringify(data), { params: params });
  },
  queryExamDataList(data, params){ //审核记录
    return _axios.post("/api/orderDetail/QueryTrackRecodList",queryString.stringify(data), { params: params });
  },

    //查看拒单原因
//  queryOrderList(data, params) {
//  	return _axios.post("/api/orderDetail/queryOrderList",queryString.stringify(data), { params: params });
//  },
  //安卓版本控制
  queryAndroidVersion(data, params) {
    return _axios.post("/api/version/queryPageVersion",queryString.stringify(data), { params: params });
  },
  androidVersionLoad(data,params){
    return _axios.post("/api/version/apkDown",data);
  },
  updateAndroidVersion(data, params) {
    return _axios.post("/api/version/updateVersion",queryString.stringify(data), { params: params });
  },
//放款监测订单
  saveMiniList(data, params) {
    return _axios.post("/api/version/updateVersion",queryString.stringify(data), { params: params });
  },
  //查询逾期订单列表
  queryOverdueOrders(data, params) {
    return _axios.post("/api/allOrder/queryOverdueOrders",queryString.stringify(data), { params: params });
  },
  //新增贷后跟进时查询联系人
  querylinkManForFollow(data, params) {
    return _axios.post("/api/followUp/querylinkManForFollow",queryString.stringify(data), { params: params });
  },
  //总控管理-全部订单
  queryAllControlOrder(data, params) {
    return _axios.post("/api/allOrder/queryAllOrder",queryString.stringify(data), { params: params });
  },

  queryInfoList(data, params) { //消息推送
    return _axios.post("/api/pushmsg/queryPushMsg",queryString.stringify(data), { params: params });
  },
  infoListAddPushMsg(data, params) { //消息推送新增
    return _axios.post("/api/jpush/pushMessage",queryString.stringify(data), { params: params });
  },
   //查询电子账户余额
   queryAccountBalance(data, params) {
    return _axios.post("/api/orderDetail/queryAccountBalance",queryString.stringify(data), { params: params });
  },
	//按钮权限
  permissionBtnPower(data, params) {
    return _axios.post("/auth/operate/list",queryString.stringify(data), { params: params });
  },
  //登录姓名
  queryLoginName(data, params) {
    return _axios.post("/api/allOrder/loginedIn",queryString.stringify(data), { params: params });
  },
  	//总控管理-全部订单-复活

	reviveOrderFn(data, params) {
	    return _axios.post("/api/allOrder/reviveOrder",queryString.stringify(data), { params: params });
	},

	//数据字典明细(全部)
	queryAllDetailOrder(data, params) {
	    return _axios.post("/api/dictionaryDetail/queryDetailOrder",queryString.stringify(data), { params: params });
	},
  //总控拒单
  queryRefuseOrder(data, params) {
    return _axios.post("/api/allOrder/refuseOrder",queryString.stringify(data), { params: params });
  },

//客服中心列表
  queryCustomerService(data, params) {
    return _axios.post("/api/customerManage/queryHangOrderPool",queryString.stringify(data), { params: params });
  },
  CustomerAccountOpenRecord(data, params) { //客服中心 开户记录
    return _axios.post("/api/customerManage/accountOpenRecord",queryString.stringify(data), { params: params });
  },
  updateCustomerStatus(data, params) { //在线离线
    return _axios.post("/api/customerManage/updateCustomerStatus",queryString.stringify(data), { params: params });
  },
  queryNodeFollow(data, params) { //客服中心获取跟进环节
    return _axios.post("/api/followUp/queryNodeFollow",queryString.stringify(data), { params: params });
  },
  queryFollowInfo(data, params) {//查询跟进内容
  	return _axios.post("/api/followUp/queryFollowInfo",queryString.stringify(data), { params: params });
  },
  ReviewRefuseReason(data, params) {//调用审批系统 拒单三级原因
    return _axios.post("/api/review/reviewRefuseReason",queryString.stringify(data), { params: params });
  },
  queryRecordList(data, params) {//查询呼叫记录
    return _axios.post("/api/orderCall/queryRecordList",queryString.stringify(data), { params: params });
  },
  queryRecordPath(data, params) {//查询录音
    return _axios.post("/api/orderCall/queryRecordPath",queryString.stringify(data), { params: params });
  },
  validateTask(data, params) {//客服 验证是否绑定固话
    return _axios.post("/api/orderCall/validateTask",queryString.stringify(data), { params: params });
  },
  callFixedTel(data, params) {//客服 验证是否绑定固话
    return _axios.post("/api/orderCall/callFixedTel",queryString.stringify(data), { params: params });
  },
  getCollectors(data, params) {//催收机构
    return _axios.post("/api/loanafter/getCollectors",queryString.stringify(data), { params: params });
  },
  otherQueryFollowList(data, params) {//穿山甲跟进列表
    return _axios.post("/web/followUp/queryFollowList",queryString.stringify(data), { params: params });
  },
  otherQueryFollowInfo(data, params) {//穿山甲查看跟进内容
    return _axios.post("/web/followUp/queryFollowInfo",queryString.stringify(data), { params: params });
  },
  // /
  queryAddressInfoFn(data, params) {//
    return _axios.post("/api/followUp/queryAddressInfo",queryString.stringify(data), { params: params });
  },
  
  
}


