<template>
	<div id="tag" style="text-align: left;">
		<scroll v-if='visitedViews.length != 0' :scrollY='scrollY' :scrollX='scrollX' :data='visitedViews' ref="scroll">
			<ul class="tab-list clearfix tags-view-wrapper" ref="tabList" v-if='visitedViews.length != 0'>
				<li v-for="tag in Array.from(visitedViews)" class="tab-item" :key="tag.path" ref="tabTag">
					<router-link 
						 @contextmenu.prevent.native="openMenu(tag,$event)"
						@click.prevent.stop.native='fn(tag)' ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" :to="{ path: tag.path, query: { menuId: tag.query.menuId }}" :key="tag.path">
						{{tag.name}}
						<span class='el-icon-close' v-if='tag.path != "/home"' @click.prevent.stop='closeSelectedTag(tag)'></span>
					</router-link>
				</li>
			</ul>
		</scroll>
		 <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
	</div>
</template>

<script>
import Scroll from "@/components/scroll/scroll";
import api from "@/api/index";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    show2: {
      type: Boolean,
      default: false
    },
    show3: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Scroll
  },
  data() {
    return {
      data: [1.2, 1212, 121, 11, 454],
      pullDownRefresh: true,
      pullUpLoad: true,
      listenScroll: true,
      num: 0,
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      currentTab: 4,
      current: 1,
      scrollX: true,
      scrollY: false
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route() {
      //		    	this.$route.meta.keepAlive = true
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
    //	    this._initTabListWidth()
  },
  methods: {
    _initTabListWidth() {
      if (!this.$refs.tabList) {
        return;
      }
      const tabList = this.$refs.tabList;
      //		        console.log(tabList,"tabList=====")
      const items = tabList.children;
      let width = 0;
      for (let i = 0; i < items.length; i++) {
        width += items[i].clientWidth;
      }
      tabList.style.width = width + 50 + "px";
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name;
    },
    async addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      let _this = this;
      await this.$store.dispatch("addVisitedViews", route).then(res => {
        _this.$emit(
          "acceptCacheViews",
          window.localStorage.getItem("cachedViews")
        );
        console.log(window.localStorage.getItem("cachedViews"), 66666666888888);
        this._initTabListWidth();
      });
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            //	            this.$refs.scrollPane.moveToTarget(tag.$el)
            break;
          }
        }
      });
    },
    fn(view) {
      // this.$route.meta.keepAlive = false
      window.localStorage.setItem("isRefresh", "otherMore");
    },
    closeSelectedTag(view) {
      //				view.meta.keepAlive = false
      window.localStorage.setItem("closeRoute", view.path);
      window.localStorage.setItem("isRefresh", "clearKeepAlive");
      console.log(view, "hhhhhhh");
      //		    	this.$destroy()

      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.path);
          } else {
            this.$router.push("/home");
          }
        }
      });
      this._initTabListWidth();
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      console.log(12);
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX;
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.tab-item {
  line-height: 33px;
  float: left;
  text-align: right;
  &:first-child {
    .tags-view-item {
      margin-left: 15px;
    }
  }
}
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
.tags-view-item {
  display: inline-block;
  position: relative;
  height: 35px;
  line-height: 35px;
  /*border-bottom: 1px solid #d8dce5;*/
  color: #495060;
  background: #fff;
  padding: 0 16px;
  font-size: 12px;
  /*margin-left: 0;*/
  margin-top: 0px;
  &.active {
    /*background-color: #42b983;
        color: #fff;
        border-color: #42b983;*/
    position: relative;
    /*background-color: #eee;*/
    /*&::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }*/
    &::after {
      position: absolute;
      left: 0;
      top: 0px;
      content: "";
      width: 100%;
      height: 35px;
      /* border-width: 1px; */
      /* border-style: solid; */
      border-radius: 2px 2px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      pointer-events: none;
      border-color: #c4c0c0;
      border-bottom: 2px solid #31afff;
      /* border-bottom-color: #31AFFF; */
      border-top: none;
    }
  }
}

.tags-view-container {
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>