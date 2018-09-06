const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
//  	console.log(view.meta,view,'=================')
    	
      if (state.visitedViews.some(v => v.path === view.path)) return
     
//    if (view.meta.isPushTag){//组织500,404页面不加入tagVew里面
//    	 console.log(view.meta.isPushTag,'---8888');
//    	return
//    } else {
//    	state.visitedViews.push({
//	        name: view.name,
//	        path: view.path,
//	        title: view.meta.title || 'no-name',
//	        query: {
//	        	menuId: view.query.menuId || ''
//	        }
//	      })
//    }
			state.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name',
        query: {
        	menuId: view.query.menuId || ''
        },
        meta: view.meta
      })
				
      
      if (!view.meta.noCache && view.meta.keepAlive) {
//      state.cachedViews.push(view.name)
				state.cachedViews.push(view.meta.conpenentName)
				let cachedViewsStr = state.cachedViews.join(",")
//					console.log(state.cachedViews, "++++++state.cachedViews++++++++++++")
        window.localStorage.setItem("cachedViews",state.cachedViews.join(","))
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path ) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
//    for (const i of state.cachedViews) {
//      if (i === view.name) {
//        const index = state.cachedViews.indexOf(i)
//        state.cachedViews.splice(index, 1)
//        break
//      }
//    }
			for (const i of state.cachedViews) {
        if (i === view.meta.conpenentName) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          let cachedViewsStr = state.cachedViews.join(",")
        	window.localStorage.setItem("cachedViews",state.cachedViews.join(","))
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, i + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
