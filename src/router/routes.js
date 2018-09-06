import Hello from '@/components/hello'
import Layout from '@/components/Layout'
//import Login from '@/components/login/login'

import AllCustList from '@/components/custManage/AllCustList'
import NoVerifyCustList from '@/components/custManage/NoVerifyCustList'
import TradedCustList from '@/components/custManage/TradedCustList'
import RealNameCustList from '@/components/custManage/RealNameCustList'

import AllOrderList from '@/components/orderManage/allOrderList'
import ApplyList from  '@/components/orderManage/applyList'
import ExamList from  '@/components/orderManage/examList'
import RepaymentList from  '@/components/orderManage/repaymentList'
import PayOffList from  '@/components/orderManage/payOffList'
import RejectList from  '@/components/orderManage/rejectList'
//import NotFound from  '@/components/common/NotFound'
//import ServiceError from  '@/components/common/ServiceError'

/*import OverdueList from '@/components/afterloanManage/overdueList'
import MinitorList from '@/components/afterloanManage/minitorList'
import CollectionList from '@/components/afterloanManage/collectionList'
import M1List from '@/components/afterloanManage/M1List'*/


import CtrexamList from '@/components/controlManage/CtrexamList'
import CtrallList from '@/components/controlManage/CtrallList'
import OrderPool from '@/components/customerService/orderPool'
import MyOrderList from '@/components/customerService/myOrderList'

import About from '@/components/sysContManage/about'
import AMTdeadlineSet from '@/components/sysContManage/AMTdeadlineSet'
import BannerList from '@/components/sysContManage/bannerList'
import FAQList from '@/components/sysContManage/FAQList'
import InfoList from '@/components/sysContManage/infoList'

import ParamSet from '@/components/sysParamManage/ParamSet'
import Dictionary from '@/components/sysParamManage/Dictionary'
//import WithdrawRangeSet from '@/components/sysParamManage/withdrawRangeSet'
import AndroidVersionControl from '@/components/sysParamManage/AndroidVersionControl'


import AllOverdueOrderList from '@/components/loanManage/AllOverdueOrderList'
import MinitorList from '@/components/loanManage/MinitorList'
import CollectionList from '@/components/loanManage/CollectionList'
import M1List from '@/components/loanManage/M1List'
import AppH5Question from '@/components/app/H5Question'
import H5About from '@/components/app/H5About'

import CustDetail from '@/components/common/CustDetail'
import OrderDetail from '@/components/common/OrderDetail'
//import DialogFollowList from '@/components/otherManager/DialogFollowList'
/*
 * 
 *注意： meta的keepAlive、conpenentName是用来缓存的页面的，用的是<keep-alive :include="visitedViews">方法
	meta的conpenentName要与页面的name名字一样	            
 *
 * 
 * **/
export default [
  {
		path: '/',
		redirect: 'home',
		meta: {
			istoken: false
		},

	},
	{
		path: '*',
		redirect: '/home',
		meta: {
			istoken: false
		},
	},
	{
		path: '/home',
		alias: '', //默认
		name: '首页',
		component: Layout,
		meta: {
			istoken: true,
			conpenentName: 'C_LayOut'
		},
		children: [{
				path: 'hello',
				component: Hello,
				//component: LayoutA,
				name: "测试",
				meta: {
					istoken: true,
					keepAlive: false
				},
			},
			{
				path: 'user/allUserList',
				component: AllCustList,
				name: "全部客户",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'U_AllUserList'
				},
			},
			{
				path: 'user/noVerifyList',
				component: NoVerifyCustList,
				name: "未实名客户",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'U_NoVerifyCustList'
				},
			},
			{
				path: 'user/tradedList',
				component: TradedCustList,
				name: "已成交客户",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'U_TradedCustList'
				},
			},
			{
				path: 'user/realNameList',
				component: RealNameCustList,
				name: "已实名客户",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'U_RealNameCustList'
				},
			},
			{
				path: 'order/allOrderList',
				component: AllOrderList,
				name: '全部订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_AllOrderList'
				}
			},
			{
				path: 'order/applyList',
				component: ApplyList,
				name: '申请中订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_ApplyList'
				}
			},
			{
				path: 'order/examList',
				component: ExamList,
				name: '审批中订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_ExamList'
				}
			},
			{
				path: 'order/repaymentList',
				component: RepaymentList,
				name: '还款中订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_RepayMentList'
				}
			},
			{
				path: 'order/payOffList',
				component: PayOffList,
				name: '已结清订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_PayOffList'
				}
			},
			{
				path: 'order/rejectList',
				component: RejectList,
				name: '拒绝订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'O_RejectList'
				}
			},
			// {
			//     path:'afterloan/overdueList',
			//     component: OverdueList,
			//     name:'全部预期订单'
			// },
			// {
			//     path:'afterloan/minitorList',
			//     component: MinitorList,
			//     name:'放款监测订单'
			// },
			// {
			//     path:'afterloan/collectionList',
			//     component: CollectionList,
			//     name:'预催收订单'
			// },
			// {
			//     path:'afterloan/M1List',
			//     component: M1List,
			//     name:'M1订单'
			// },
			{
				path: 'controlOrder/examList',
				component: CtrexamList,
				name: '总控-审批中订单',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'CT_CtrexamList'
				}
			},
			{
				path: 'controlOrder/allList',
				component: CtrallList,
				name: '总控-订单查询',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'CT_CtrallList'
				}
			},
			{
				path: 'sysContent/bannerList',
				component: BannerList,
				name: 'Banner管理',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYC_BannerList'
				}
			},
			{
				path: 'sysContent/About',
				component: About,
				name: 'APP关于',
				meta: {
					istoken: true,
					keepAlive: true,
//					conpenentName: 'SYC_About'
				}
			},
			{
				path: 'sysContent/AMTdeadlineSet',
				component: AMTdeadlineSet,
				name: '金额期限设置',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYC_AMTdeadlineSet'
				}
			},
			{
				path: 'sysContent/infoList',
				component: InfoList,
				name: '消息推送',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYC_InfoList'
				}
			},
			{
				path: 'sysContent/FAQList',
				component: FAQList,
				name: '常见问题',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYC_FAQList'
				}
			},
			{
				path: 'sysParam/paramSet',
				component: ParamSet,
				name: '系统参数',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYP_ParamSet'
				}
			},
			{
				path: 'sysParam/dictionary',
				component: Dictionary,
				name: '数据字典',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYP_Dictionary'
				}
			},
			//          {
			//              path:'sysParam/withdrawRangeSet',
			//              component: WithdrawRangeSet,
			//              name:'提现限额设置',
			//              meta: {
			//                  istoken: true,
			//		            keepAlive: true,
			//		            conpenentName: 'SYP_WithdrawRangeSet'
			//              }
			//          },
			{
				path: 'sysParam/androidVersionControl',
				component: AndroidVersionControl,
				name: '版本管理（安卓）',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'SYP_AndroidVersionControl'
				}
			},
			{
				path: 'afterloan/overdueList',
				component: AllOverdueOrderList,
				name: "全部逾期订单",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'L_AllOverdueOrderList'
				}
			},
			{
				path: 'afterloan/minitorList',
				component: MinitorList,
				name: "放款监测订单",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'L_MinitorList'
				}
			},
			{
				path: 'afterloan/collectionList',
				component: CollectionList,
				name: "预催收订单",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'L_CollectionList'
				}
			},
			{
				path: 'afterloan/M1List',
				component: M1List,
				name: "M1订单",
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'L_M1List'
				}
			},
			{
				path: '/customerService/orderPool',
				component: OrderPool,
				name: '挂起订单资源总池',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'CS_OrderPool'

				}
			},
			{
				path: '/customerService/myOrderList',
				component: MyOrderList,
				name: '我的处理列表',
				meta: {
					istoken: true,
					keepAlive: true,
					conpenentName: 'CS_MyOrderList'
				}
			},
			//			{
			//			  	path:'/500',
			//			  	name:'500',
			//			  	component:ServiceError,
			//			  	meta: {
			//			      istoken: false,
			//			      name: '500',
			//			      isPushTag: true
			//		    	}
			//		  	},
			//		  	{
			//		  		path:'/404',
			//		  		name:'404',
			//		  		component:NotFound,
			//		  		meta: {
			//			      istoken: false,
			//			      name: '404',
			//			      isPushTag: true
			//		    	}
			//		  	},//全不匹配的情况下，返回404

		]
	},

	//  {
	//      path: '/login',
	//      component: Login,
	//      //component: LayoutA,
	// //      name: "登录",
	//      meta: {
	//          istoken: true
	//      },
	//  },
	{
		path: '/hello',
		component: Hello,
		//      component: LayoutA,
		//      name: "TEST",
		meta: {
			istoken: true
		},
	},
	{
		path: '/questions',
		component: AppH5Question,
		//component: LayoutA,
		name: " 常见问题",
		meta: {
			istoken: false
		},
	},
	{
		path: '/appAbout',
		component: H5About,
		//component: LayoutA,
		name: "app关于",
		meta: {
			istoken: true
		},
	},
	{
		path: '/detail/custDetail',
		component: CustDetail,
		name: "客户详情",
		meta: {
			istoken: true,
			name: '客户详情'
		}
	},
	{
		path: '/detail/orderDetail',
		component: OrderDetail,
		// name: "订单详情",
		meta: {
			istoken: true,
			name: '订单详情'
		}
	},
//	{
//		path: '/loanManager/followList',
//		component: DialogFollowList,
//		name: "F_followList",
//		meta: {
//			istoken: true,
//			name: '跟进列表'
//		}
//	}

]