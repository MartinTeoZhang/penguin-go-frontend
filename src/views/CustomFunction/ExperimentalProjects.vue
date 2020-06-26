
<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filter" :size="size">
        <el-form-item>
          <el-input v-model="filter.expName" placeholder="实验名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="fun:exper:viewexp" type="primary" @click="findPageByStatus(null)"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="clearFilter">清除所有过滤器</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--报名参加界面-->

    <el-dialog :title="'报名'" width= "35%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-row class="detail">
        <span class="dialog-row">实验地点：{{clickedExp.location}}</span>
      </el-row>

      <el-row class="detail">
        <el-table
        class="time-table"
        :data="clickedExp.time"
        border
        stripe
        style="width: 400px;"
        >
          <el-table-column
            prop="dateValue"
            width="200"
            label="实验日期"
            align="center"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="timeValue"
            width="200"
            label="实验时间段"
            align="center"
            header-align="center">
            <template slot-scope="scope">
              {{scope.row.timeValue[0] +' ~ '+ scope.row.timeValue[1]}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row v-if="clickedExp.note" class="detail">
        <span class="dialog-row">备注：{{clickedExp.note}}</span>
      </el-row>

      <el-row slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">报名参加</el-button>
      </el-row>
    </el-dialog>
    <!--展示实验项目-->
    <el-table
      class="exp-table"
      ref="filterTable"
      :data="pageResult.content"
      :span-method="arraySpanMethod"
      @row-click = "clickCard"
      border
      style="width: 100%;"
      height="480">
      <el-table-column
        type="index"
        prop="payment"
        label="最低报酬"
        :filters="[
        {text:'0~20元', value:0},
        {text:'20~40元', value:1},
        {text:'40~60元', value:2},
        {text:'60~80元', value:3},
        {text:'80~100元', value:4},
        {text:'100元以上', value:5}]"
        :filter-method="filterPayment"
        width="150">
        <template slot-scope="scope">
          <el-card shadow="hover" class="box-card" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>{{scope.row.name}}</span>
              <span style="float: right; color: red" type="text">
              {{scope.row.payment.paymentMin + '~' + scope.row.payment.paymentMax}}元</span>
            </div>
            <el-row :gutter="24">
              <el-col :span="5">
                <el-image  style="width: 200px; height: 120px" :src="expimg" class="image">
                </el-image>
              </el-col>
              <el-col :span="19">
                <div class="text item">
                  日期：
                  <span v-for="(time,index) in scope.row.time" :key="index">
                      {{time.dateValue}};
                  </span>
                </div>
                <div class="text item">
                  名额：{{expUserCount[scope.$index]}}/{{scope.row.peopleNum}}人
                  ，时长：{{scope.row.duration}}分钟
                </div>
                <div class="text item">
                  类型：
                  <span v-for="(type,index) in scope.row.types" :key="index">
                      {{type}};
                  </span>
                </div>
                <div v-if="scope.row.requirements.length > 0" class="text item">
                  要求：
                  <span v-for="(r,index) in scope.row.requirements" :key="index">
                    {{r}};
                  </span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        :filters="getDateFilters()"
        :filter-method="filterDate"
        label="实验日期">
      </el-table-column>
      <el-table-column
        prop="types"
        :filters="[
        {value: '按键实验',text: '按键实验'},
        {value: '脑电实验',text: '脑电实验'},
        {value: '问卷实验',text: '问卷实验'},
        {value: '其它',text: '其它'}]"
        :filter-method="filterTypes"
        label="实验类型">
      </el-table-column>
      <el-table-column
        prop="requirements"
        :filters="[
        {value: '左利手',text: '左利手'},
        {value: '右利手',text: '右利手'},
        {value: '无高度近视',text: '无高度近视'},
        {value: '矫正视力', text: '矫正视力'},
        {value: '无近视',text: '无近视'}]"
        :filter-method="filterRequirements"
        label="实验要求">
      </el-table-column>
      <el-table-column
        prop="duration"
        label="实验时长"
        :filters="[
        {text:'0~30分钟', value:0},
        {text:'30~60分钟', value:1},
        {text:'60~90分钟', value:2},
        {text:'90~120分钟', value:3},
        {text:'120分钟以上', value:4}]"
        :filter-method="filterDuration"
        >
      </el-table-column>
      <el-table-column
        prop="peopleNum"
        label="实验名额"
        :filters="[
        {text:'未满', value:0},
        {text:'已满', value:1}]"
        :filter-method="filterPeopleNum"
        >
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar-page" style="padding:10px;">
      <el-row :gutter="20">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                       :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.totalSize" style="float:left;">
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton"
  import { format } from "@/utils/datetime"
  export default {
    components:{
      KtButton,
    },
    data() {
      return {
        size: 'small',
        filter: {
          expName: ''
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
        expimg: '',
      };
    },
    mounted(){
      this.findPageByStatus(null)
    },
    methods:{
      // 获取已发布的实验项目分页数据
      findPageByStatus : function(data){
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {
          name: {name:'name', value:this.filter.expName},
          status: {name:'status', value:'2'}}
        this.$api.exp.findPageByStatus(this.pageRequest).then((res) => {
          this.pageResult = res.data
          this.expUserCount = []
          this.getExpUserCount()
          this.formatRequest(res.data)
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
        this.findPageByStatus(null)
        //回到表格顶部
        this.$refs.filterTable.bodyWrapper.scrollTop = 0
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
      clickCard: function(row, column, event){
        this.dialogVisible = true
        this.clickedExp = row
        this.clickedExpIndex = this.pageResult.content.indexOf(row)
      },
      saveSubject: function(){
        let userName = sessionStorage.getItem('user')
        let create_time = format(new Date())
        let expUser = {
          id: null,
          expId: this.clickedExp.id,
          userId: this.userId,
          status: 0,
          create_by: userName,
          create_time: create_time,
          last_update_by: null,
          last_update_time: null
        }
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
      },
      arraySpanMethod: function({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return [1, 6];
        } else if (columnIndex >= 1) {
          return [0, 0];
        }
      },
      //清除所有过滤器
      clearFilter: function() {
        this.$refs.filterTable.clearFilter();
        //回到表格顶部
        this.$refs.filterTable.bodyWrapper.scrollTop = 0
      },
      //实验日期过滤函数
      filterDate: function(value, row, column) {
        const property = column['property']
        let flag = false
        let today = format(new Date()).split(' ')[0]
        today = new Date(today)
        for (let i = row[property].length - 1; i >= 0 && flag !== true; i--) {
          let day = new Date(row[property][i].dateValue)
          if(value === -1){
            if(day < today)
              flag = true
          }else if(value === 7){
            if(day >= today.setDate(today.getDate()+7))
              flag = true
            today.setDate(today.getDate()-7)
          }else{
            let valueDay = new Date(value)
            if(day.getTime() === valueDay.getTime())
              flag = true
          }
        }
        return flag
      },
      //实验类型过滤函数
      filterTypes: function(value, row, column) {
        const property = column['property'];
        let flag = false
        for (var i = row[property].length - 1; i >= 0 && flag !== true; i--) {
          if(row[property][i]===value)
            flag = true
        }
        return flag
      },
      //最低报酬过滤函数
      filterPayment: function(value, row, column) {
        const property = column['property']
        let paymentMin = row[property].paymentMin
        let min = value * 20
        let max = (value + 1) * 20
        let flag = false
        if(value < 5)
          flag = (paymentMin >= min && paymentMin <= max)
        else
          flag = (paymentMin >= min)
        return flag
      },
      //实验要求过滤函数
      filterRequirements: function(value, row, column){
        return this.filterTypes(value, row, column)
      },
      //实验时长过滤函数
      filterDuration: function(value, row, column) {
        const property = column['property']
        let min = value * 30
        let max = (value + 1) * 30
        let flag = false
        if(value < 4)
          flag = (row[property] >= min && row[property] <= max)
        else
          flag = (row[property] >= min)
        return flag
      },
      //实验名额过滤函数
      filterPeopleNum: function(value, row, column) {
        const property = column['property']
        const index = this.pageResult.content.indexOf(row)
        let flag = false
        if(value === 0)
          flag = (this.expUserCount[index] < row[property])
        else
          flag = (this.expUserCount[index] >= row[property])
        return flag
      },
      //查询结果格式化
      formatRequest: function(pageResult){
        for (var i = pageResult.content.length - 1; i >= 0; i--) {
          let exp = pageResult.content[i]
          exp.payment = this.strToJson(exp.payment)
          exp.requirements = this.strToArray(exp.requirements)
          exp.types = this.strToArray(exp.types)
          let index = exp.time.indexOf('}')
          let str = exp.time.substring(0,index)
          str += ',\\\'key\\\':0'
          str += exp.time.substring(index, exp.time.length)
          exp.time = str
          exp.time = '{\"time\":'+exp.time + '}'
          exp.time = exp.time.replace(/\\'/g,"\"")
          exp.time = JSON.parse(exp.time).time
          for (let i = exp.time.length - 1; i >= 0; i--) {
            //日期
            exp.time[i].dateValue = format(exp.time[i].dateValue).split(' ')[0]
            //时间段
            for (let t = exp.time[i].timeValue.length - 1; t >= 0; t--) {
              exp.time[i].timeValue[t] = format(exp.time[i].timeValue[t]).split(' ')[1]
            }
          }
        }
      },
      getDateFilters: function(){
        let filters = []
        let filter = {text: '', value: ''}
        filter.text = '今天之前'
        filter.value = -1
        filters.push(Object.assign({}, filter))
        let today = new Date()
        for (let i = 0; i <= 6; i++) {
          filter.text = format(today).split(' ')[0]
          filter.value = filter.text
          filters.push(Object.assign({}, filter))
          today.setDate(today.getDate()+1)
        }
        filter.text = '7天之后'
        filter.value = 7
        filters.push(Object.assign({}, filter))
        return filters
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
    height: 220px;
    text-align: left;
    clear: both;
  }

  .el-dialog {
    text-align: left;
  }

  .toolbar-page{
    position: fixed;
    bottom: 0px;
    right: 50px;
  }
  .exp-table{
    top: 0px;
    bottom: 50px;
    clear: both;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
  }

  .detail {
    font-size: 16px;
    margin-bottom: 10px;
  }

</style>
