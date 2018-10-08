<template>
	<div class="layout-wraps">
		<Headers :muneList='listMenu' ></Headers>
		<div class="tagViews">
			<tag-views @acceptCacheViews = 'acceptCacheViews'></tag-views>
	    </div>
		<div class="router-wrap">
			<keep-alive :include="visitedViews">
				<router-view></router-view>
			</keep-alive>
			<!--<router-view v-if='!$route.meta.keepAlive'></router-view>-->
		</div>
		<div v-if='showHome' class="homeTit">
			欢迎您登录小贷后台管理系统
		</div>
	</div>
</template>
<script>
	import Headers from '@/components/header/Header'
	import TagViews from '@/components/TagViews'
	import api from "@/api/index"
	export default {
		name: 'home',
		components: {
			Headers,
			TagViews
		},
		data() {
			return {
				showHome: false,
				listMenu: [],
				visitedViews: ''								
			}
		},
		created() {
			this.getLoginData()
		},
		mounted() {
			if(this.$route.path == '/home') {
				this.showHome = true
			} else {
				this.showHome = false
			}
		},
		methods: {
			acceptCacheViews(acceptCacheViewData) {
				this.visitedViews = acceptCacheViewData
				console.log(acceptCacheViewData, "++++++++++++++++++++++++++++")
			},
			getLoginData() {
				//		console.log(12313);
				api.queryMenulist().then(res => {
					if(res.data.menuList && res.data.menuList.length != 0) {
						this.listMenu = res.data.menuList
						//  				console.log(this.listMenu,787878)
					} else {
						this.$notify({
							title: '提示',
							message: res.data.msg,
							duration: 1500
						});
					}
				})
			}
		},
		watch: {
			$route() {
				// debugger
				if(this.$route.path == '/home') {
					this.showHome = true
					console.log(this.$route, 1233213213132)
				} else {
					this.showHome = false
				}
//				this.visitedViews = this.$store.state.tagsView.cachedViews.join(',')
//				this.visitedViews = window.localStorage.getItem("cachedViews")
//				this.acceptCacheViews()
//				console.log(window.localStorage.getItem("cachedViews"), "this.visitedViews++++++++++++")
//				console.log(this.$store.state.tagsView.cachedViews, "this.visitedViews++++++++++++")
				
			},
		},
	}
</script>
<style lang="less" scoped>
	.homeTit {
		text-align: center;
		font-size: 35px;
		font-weight: bold;
		margin-top: 15%;
	}
	
	.router-wrap {
		padding: 0 20px 20px 20px;
	}
</style>