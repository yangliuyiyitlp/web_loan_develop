<template>
    <div class="notFound">
      <!--<lay-out></lay-out>-->
      <div class="img">
        <!--<img src="../../assets/images/404_V1.png" alt="404">-->
        <div @click="goBack">返回</div>
      </div>
    </div>
</template>

<script>
  import LayOut from '@/components/Layout'
    export default {
        name: "NotFound",
      methods:{
          goBack(){
            this.$router.go(-1)
          }
      },
      components:{LayOut}
    }
</script>

<style scoped>
  .notFound{

  }
  .img{
    bottom: 0;
    background: url("../../assets/images/404_V1.png") no-repeat center;

    position: fixed;
    width: 100%;
    height: 100%;
    background-size: cover;
    left: 0;
    top: 65px;
    z-index: 1314;
  }
.img img{
  width:100%;
}
  .img div{
       color: rgb(104,175,254);
    width: 160px;
    height: 35px;
    line-height: 35px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 20px;
    position: absolute;
    text-align: center;
    cursor: pointer;
    left: 50%;
    /* margin-left: -80px; */
    top: 73%;
    transform: translateX(-50%);

  }
</style>
