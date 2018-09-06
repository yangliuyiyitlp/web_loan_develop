
export default{
  getMyPageSize(pageSize){
    if (JSON.parse(localStorage.getItem('myPageSize'))){
      pageSize = JSON.parse(localStorage.getItem('myPageSize')).orderPool_List?JSON.parse(localStorage.getItem('myPageSize')).orderPool_List:10
//    console.log(11,pageSize);
      return pageSize
    } else {
      let obj = {}
      localStorage.setItem('myPageSize',JSON.stringify(obj))
    }


  },
  setMyPageSize(val){
    let myPageSize = JSON.parse(localStorage.getItem('myPageSize'))
    myPageSize.orderPool_List = val
    localStorage.setItem('myPageSize',JSON.stringify(myPageSize))
  }
}
