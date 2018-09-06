<template>
  <div class="ques-wrap">
  		<div class="search-wrap">
			 	<el-input  v-model="ques_key" class="seach-con" ref='input' 
			 		@keyup.native.enter="searchList()" @blur = 'showSearchFn' @focus ='hideSearchFn'>
			    <!--<el-button slot="append" icon="el-icon-search" @click="searchList()"></el-button>-->
			  </el-input>
			  <div class="sear-icon" @click='focusFn' v-if='showSearch'>
			  	<i></i>请输入内容
			  </div>
			</div>
      <div class="scroll">
				<cube-scroll
				  ref="scroll"		
				  :data="items"
				  
				  :options="options"
				  @pulling-down="onPullingDown"
				  @pulling-up="onPullingUp"
				  >
				  <template slot-scope="props">
				    <div >				    	
				     <ul id='activityTab'>
							<li v-for="(item,ind) in items" :key='ind'>
								<h2 @click='targetTab($event)'>
									<i class="icons"></i>
									{{item.data}}
								</h2>
								<div class="actCon" v-html="item.result">
						    	</div>
							</li>
						</ul>
				    </div>
				  </template>
				</cube-scroll>
				
			</div>
  </div>
</template>

<script>
import api from '@/api/index.js'
export default {
  name: 'question',
  data () {
    return {
    	showSearch: true,
      idArr: [2],
      ques_key: '',
      itemIndex: 1,
      items: [],
      options: {
        pullDownRefresh: {
          threshold: 90,
          stop: 40,
          txt: '刷新成功'
        },
        pullUpLoad: {
          threshold: 0,          
          txt: {
            more: '往上拉，加载更多',
            noMore: '~我是有底线的~'
          }
        }
	  },
	  pageSize:10,
	  pageNo:1
    }
  }, 
  methods: {
  	hideSearchFn() {
  		this.showSearch = false
  	},
  	focusFn() {
  		this.showSearch = false
  		this.$refs.input.focus()
  	},
  	showSearchFn() {
  		if (!this.ques_key) {  			
  			this.showSearch = true
  		}
  	},
  	searchList(){
  		console.log(1)
  		this.pageNo = 1;
	    this.items = []
  		this.queryQuestionList()

  	},
  	queryQuestionList(){
  		var params={
  			pageNo:this.pageNo,
  			pageSize:this.pageSize,
  			data:this.ques_key,
				status:1
  		}
  		api.queryQuestionList(params).then(res=>{
 			console.log(res.data.data,123121231321)
 			if(res.data.code == 1 && res.data.data.length !=0){
 				this.items = this.items.concat(res.data.data)
 				console.log(this.items,'this.items')
 				
 			} else {
 				this.$refs.scroll.forceUpdate()
 			}
 		})
  	},
  	targetTab(eve) {
//		console.log(eve.target.parentNode.siblings())
  	console.log(112)
  		if(eve.target.nodeName == 'H2') {
//			 	console.log($($(eve.target).siblings()[0]).hasClass('actConShow'))
  			  $(eve.target).parent().siblings().each(function(index,value){
//			  	console.log(this)
						$(this).find('.actCon').removeClass('actConShow')
						$(this).find('.icons').removeClass('putdown')				
					});
					if($(eve.target).siblings().hasClass('actConShow')) {
//					if($($(eve.target).siblings()[0]).hasClass('actConShow')) {											
						$($(eve.target).siblings()[0]).removeClass('actConShow')
						$(eve.target).find('.icons').removeClass('putdown')
					} else {
						$(eve.target).siblings().addClass('actConShow')
						console.log()
						$(eve.target).find('.icons').addClass('putdown')
					}
  		}
  				
  	},
    onPullingDown() {
	      // Mock async load.
	      setTimeout(() => {
	      	this.pageNo = 1;
	      	this.items = []
	      	this.queryQuestionList()
	      }, 1000)
	},
	onPullingUp() {
      // Mock async load.
      setTimeout(() => {
      	this.pageNo = this.pageNo + 1
      	this.queryQuestionList()
      }, 1000)
    },
  },
  mounted() {
	this.queryQuestionList()
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">

.ques-wrap {
	position: fixed;
  top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	background-color: #f0eff5;
	z-index: 20180504;
	.seach-con input{
    border-radius: 50px;
    background-color: rgb(242,242,242);
    border: none;
	}
	.search-wrap {
		/*padding: 5px 7px;*/
		    padding: 10px 15px;
    background-color: #fff;
    position: relative;
	}
	.sear-icon {
		position: absolute;
    top: 50%;
    left: 50%;
		font-size: 14px;
		color: #a8a8a8;

    transform: translateX(-50%) translateY(-50%);
    i {
    	display: inline-block; 
    	width: 16px;
	    height: 16px;
	    background: url('../../assets/images/search@2x.png') no-repeat 0px 0px;
	    background-size: 16px 16px;
	    vertical-align: middle;
	    margin-right: 5px;
    }
	}
	.scroll {
		position: absolute;
		top: 50px;
		left: 0;
		width: 100%;
		/*height:100%;*/
		bottom: 0;
	}
	#activityTab  li{
		/*background-color: #fff;*/
		margin-bottom: 6px;
    background-color: #fff;
	}
	#activityTab li .actCon {
				display: none;
				/*border-bottom: 1px solid #e5e5e5;*/
			    padding: 10px;
			}
			#activityTab li .actCon:last-child {
				/*border-bottom: none;*/
			}
			#activityTab li .actConShow {
				display: block;
			}
			#activityTab li h2 {
			    /*margin: 0 10px;
			    font-size: 14px;			    
			    color: #333;
			    font-weight: 400;
			    height: 43px;
			    line-height: 45px;
			    border-bottom: 1px solid #e5e5e5;
		        overflow: hidden;
		        position: relative;*/
		           margin: 0 15px;
					    font-size: 14px;
					    color: #333;
					    font-weight: 400;
					    height: 64px;
					    line-height: 64px;
					    /* border-bottom: 1px solid #e5e5e5; */
					    overflow: hidden;
					    /* position: relative; */
			   
			}
				#activityTab li:last-child {
					margin-bottom: 0;
				}
			#activityTab li h2 span {
			    float: right;
				margin-right: 20px;
			}
			#activityTab li i.icons {
				/*position: absolute;*/
			    /*top: 16px;
			    right: 0;*/
			    display: inline-block;
			    /*float: right;*/
			    width: 16px;
			    height: 16px;
			    background: url('../../assets/images/actRight@2x.png') no-repeat 0px 0px;
			    background-size: 16px 16px;
			    vertical-align: middle;
			}
			#activityTab li i.putdown {
			    background: url('../../assets/images/actDown@2x.png') no-repeat 0px 0px;
			    background-size: 16px;
			}
			#activityTab li .actCon .imgErma {
				text-align: center;
			}
			#activityTab li .actCon .actName, #activityTab li .actCon .h5href{
				text-align: center;
			    margin-top: 1rem;
    			margin-bottom: 1rem;
			}
			#activityTab li .actCon .h5href a {
			 	text-decoration: none;
			 }
}
</style>
