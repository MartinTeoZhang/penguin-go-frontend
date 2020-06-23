<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="form" :size="size">
        <el-form-item>
          <el-input v-model="form.name" placeholder="实验名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item label="实验时间">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--报名参加界面-->

    <el-dialog :title="'报名'" width="30%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div>
        <span class="dialog-row">实验地点：{{clickedExp.location}}</span>
      </div>
      <!-- <span>实验时间段：</span><br />
      <div v-for="(time,index) in timeArray" :key="index">
        <span>{{time}}</span>
      </div> -->
      <div v-if="clickedExp.requirements">
        <span class="dialog-row">实验要求：</span>
        <span v-for="(r,index) in strToArray(clickedExp.requirements)" :key="index">
          {{r}};
        </span>
      </div>
      <div v-if="clickedExp.note">
        <span class="dialog-row">备注：{{clickedExp.note}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">报名参加</el-button>
      </div>
    </el-dialog>

    <!--展示实验项目-->
    <div class="cards" >
      <el-card shadow="hover" class="box-card" v-for="(re, index) in pageResult.content" :key="index" @click.native="clickCard(re, index)">
        <div slot="header" class="clearfix">
          <span>{{re.name}}</span>
          <span style="float: right; color: red" type="text">{{payToStr(re.payment)}}元</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <img height="100" width="200"
                 src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          </el-col>
          <el-col :span="9">
            <div class="text item">
              人数：{{expUserCount[index]}}/{{re.peopleNum}}人
            </div>
            <div class="text item">
              时长：{{re.duration}}分钟
            </div>
            <div class="text item">
              类型：
              <span v-for="(type,index) in strToArray(re.types)" :key="index">
                  {{type}};
                </span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!--分页栏-->
    <div class="toolbar-page" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                     :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.totalSize" style="float:left;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton"

  export default {
    components:{
      KtButton,
    },
    data() {
      return {
        size: 'small',

        currentDate: new Date(),

        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        dialogVisible: false, // 报名参加界面是否显示
        editLoading: false,
        clickedExp: { //被点击的实验
          types: [],
          location: '',
          time: null,
          duration: 1,
          requirements: null,
          note: '',
        },
        userId: 0,
        expUserCount: [], //实验报名人数
      };
    },
    mounted(){
      this.findPage(null)
    },
    methods:{
      // 获取已发布的实验项目分页数据
      findPage : function(data){
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {status: {name:'status', value:'2'}}
        this.$api.exp.findPage(this.pageRequest).then((res) => {
          this.pageResult = res.data
          this.expUserCount = []
          this.getExpUserCount()
        })
      },
      strToJson: function(str){
        var n = str.replace(/\\'/g,"\"")
        return JSON.parse(n)
      },
      strToArray: function(str){
        str = str.replace(/\\'/g,"");
        str = str.substring(1,str.length-1);
        return str.split(",");
      },
      payToStr: function(pay){
        let p = this.strToJson(pay)
        return p.paymentMin + '~' + p.paymentMax
      },
      getExpUserCount: function(){
        let len = this.expUserCount.length
        if(len < this.pageResult.content.length){
          let request = {expId: this.pageResult.content[len].id}
          this.$api.exp.getExpUserCount(request).then((res) => {
            this.expUserCount.push(res.data)
            this.getExpUserCount()
          })
        }
      },
      //更新实验的报名人数
      getExpUserCountByExpId: function(){
        let request = {expId: this.clickedExp.id}
        this.$api.exp.getExpUserCount(request).then((res) => {
          this.expUserCount.splice(this.clickedExpIndex, 1, res.data)
        })
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum
        this.findPage(null)
      },
      submitForm: function () {
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          if(this.isFull()){
            this.$message({message: '报名人数已满！', type: 'warning'})
            return
          }
          this.editLoading = true
          if(this.userId == 0 || this.userId == null){
            //通过userName获得userId
            let userName = sessionStorage.getItem('user')
            var request = { pageNum: 1, pageSize: 10 }
            request.columnFilters = {name: {name:'name', value: userName}}
            this.$api.user.findPage(request).then((res) => {
              this.userId = res.data.content[0].id
              this.verifyRepeatedEnrollment()
            })
          }else{
            this.verifyRepeatedEnrollment()
          }
        })
      },
      clickCard: function(exp, index){
        this.dialogVisible = true
        this.clickedExp = exp
        this.clickedExpIndex = index
      },
      saveSubject: function(){
        let expUser = {id: 0, expId: this.clickedExp.id, userId: this.userId}
        this.$api.exp.saveExpUser(expUser).then((res) => {
          this.editLoading = false
          if(res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.dialogVisible = false
            this.getExpUserCountByExpId()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        })
      },
      //验证重复报名
      verifyRepeatedEnrollment : function(){
        let request = {expId: this.clickedExp.id}
        this.$api.exp.findExpUsers(request).then((res) => {
          for (var i = res.data.length - 1; i >= 0; i--) {
            if(res.data[i].userId == this.userId){
              this.editLoading = false
              this.$message({message: '无法重复报名', type: 'warning'})
              return
            }
          }
          this.saveSubject()
        })
      },
      //判断报名人数是否满了
      isFull: function(){
        return this.expUserCount[this.clickedExpIndex] >= this.clickedExp.peopleNum
      }
    },
    computed:{
      timeArray: function(){
        if(this.clickedExp.time === null)
          return null
        console.log(this.clickedExp.time)
        var e = this.strToJson('exp:'+this.clickedExp.time)
        console.log(e)
        var arr = this.strToArray(this.clickedExp.time)
        console.log(arr)
        var t
        var timeArr = []
        Date.prototype.format = function(fmt) {
          var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
          };
          if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
          }
          for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
          }
          return fmt;
        }
        for(t in arr){
          var str = new Date(t.dateValue).format("yyyy-MM-dd")
          console.log(t)
          str = str + " " + new Date(t.timeValue[0]).format("hh:mm")
          str = str + "至" + new Date(t.timeValue[1]).format("hh:mm")
          timeArr.push(str)
        }
        return timeArr
      }
    }
  }
</script>

<style>
  .text {
    font-size: 12px;
  }

  .item {
    margin-bottom: 10px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";

  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 500px;
    height: 200px;
    text-align: left;
  }

  .el-dialog {
    text-align: left;
  }

</style>
