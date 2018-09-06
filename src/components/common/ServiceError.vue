<template>
  <div class="page500">
    <!--<lay-out></lay-out>-->
    <div class="img">
      <img src="../../assets/images/500_V1.png" alt="500">
      <div @click="goBack">返回</div>
    </div>
  </div>
</template>

<script>
//import LayOut from '@/components/Layout'
  export default {
    name: "ServiceError",
    methods:{
      goBack(){
        this.$router.go(-1)
      }
    },
//  components:{LayOut}
  }
</script>

<style scoped>
  .page500 .img{
    position: fixed;
    top: 65px;
    width: 100%;
    left: 0px;
    /* padding-top: 200px; */
    z-index: 1314;
  }
  .img img{
    width:100%;
  }
  .img div{
    color:#fff;
    width:160px;
    height:35px;
    line-height: 35px;
    background-color: rgb(2,171,255);;
    border:1px solid rgb(2,171,255);;
    border-radius: 20px;
    position: absolute;
    text-align: center;
    cursor:pointer;
    left:54%;
    top:48%;

  }
</style>
