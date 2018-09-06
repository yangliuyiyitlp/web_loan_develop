<template>
  <div class="order-list-wrap ">
    <el-dialog
    :close-on-click-modal ='false'
    width='60%'
    title=""
    :visible.sync="dialogFollow.dialogAudio"
  >
      <el-dialog
        width="30%"
        @close="audioClose('audio')"
        @open="audioOpened('audio')"
        title="录音播放"
        :visible.sync="audioOpen"
        append-to-body>
          <audio controls autoplay="autoplay" ref="audio">
            <source :src="voiceFileUrl" >
          </audio>
      </el-dialog>
    <div class="title">查看录音记录</div>
    <div class="wrap-list table-wraps">
      <el-table
        border
        :data="arrData">
        <el-table-column
          label="序号"
          type="index"
          align='center'
          width="60">
        </el-table-column>
        <el-table-column prop="caller" label="主叫号码" align='center' 	:show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="callee" label="被叫号码" align='center' 	:show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column prop="voiceFileUrl" label="录音文件" align='center' width="120">
          <!--<template slot-scope="scope" >-->
          <template slot-scope="scope" v-if="scope.row.voiceFileUrl">
            <span class="btn-color" @click="onLineOpen(scope.row.voiceFileUrl)">在线播放</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align='center' 	:show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align='center' 	:show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="empRealName" label="呼叫人" align='center' 	:show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="followContent" label="操作" align='center'>
          <template slot-scope="scope">
            <span class="btn-color" @click="queryRecordPath(scope.row)">查询录音</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagWrap">
        <pagination
          :currentPage = 'currentPage'
          :total = 'total'
          :layout='layout'
          @handleSizeChange = 'handleSizeChange'
          @handleCurrentChange = 'handleCurrentChange'
        >
        </pagination>
      </div>
    </div>
  </el-dialog>
    </div>
  </template>

  <script>
  import api from "@/api/index"
  import Pagination from '@/components/common/Pagination'
    export default {
        name: "AudioFileDetail",
      props: {
        dialogFollow: {
          type: Object,
          default: function () {
            return {
              dialogAudio: false
            }
          }
        }
      },
      data(){
        return{
          audioOpen:false,
          layout:"total, prev, pager, next, jumper",
            currentPage:1,
            total: 0,
            pageNo: 1,
            pageSize: 10,
            arrData:[],
            voiceFileUrl:'',
            row: null
        }
      },
      methods:{
        queryAudioList(row){ //查看录音文件
        	this.row = row
          api.queryRecordList({
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            crmApplayId:row.crmApplayId}).then(res => {
            this.arrData =[]
            this.total =0
            if(res.data.code == 1 && res.data.success) {
              this.arrData = res.data.data
              this.total = res.data.total
            }
          })
        },
        onLineOpen(voiceFileUrl){ // 在线播放
          this.audioOpen = true
          this.voiceFileUrl = voiceFileUrl
        },
        audioClose(audio){
          this.$refs[audio].pause();

        },
        audioOpened(audio){
          this.$nextTick(function () {
            this.$refs[audio].load();
            this.$refs[audio].play();
          })

          },
        queryRecordPath(row){ // 查询录音
          api.queryRecordPath({
            callId:row.callId,
            resultTaskId:row.resultTaskId,
            salesmanCode:row.salesmanCode,
            callInfoId:row.id}).then(res => {
            if(res.data.code == 1 && res.data.success) {
              row.voiceFileUrl = res.data.data
            }
            this.$notify({
              title: '提示',
              message: res.data.msg,
              duration: 1500
            });
          }).catch(err =>{
            this.$notify({
              title: '提示',
              message: err.data.msg,
              duration: 1500
            });
        })

        },
        handleSizeChange(val) {
          this.pageSize = val
          this.pageNo = 1
          this.currentPage = 1
          this.queryAudioList(this.row)
        },
        handleCurrentChange(val) {
          this.pageNo = val
          this.currentPage = val
          this.queryAudioList(this.row)
        },

      },
      components:{
          Pagination
        }
    }
</script>

<style scoped  lang="less">
  audio{
    width:100%;
  }
  .order-list-wrap {
  .dialogLoanEnd .el-row div{
    height:30px;
  }

  .pagWrap {
    margin-top: 10px;
    text-align: right;
  }
  .title {
    margin-top: -40px;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }
  .wrap-list {
    padding-top: 5px;
  }
 .btn-color{
   cursor:pointer;
 }
  }
</style>
