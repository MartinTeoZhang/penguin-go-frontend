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
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
        </el-form-item>
        <el-form-item label="实验时间">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="cards" >
      <!-- Card卡片 -->
      <!-- <el-card shadow="hover" class="box-card">
        <div slot="header" class="clearfix">
          <span>简单的按键+皮电实验</span>
          <sapn style="float: right; color: red" type="text">25元</sapn>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
              <img height="100" width="200"
                 src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          </el-col>
          <el-col :span="6">
            <div v-for="o in 3" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
          </el-col>
        </el-row>
      </el-card> -->
      <el-card shadow="hover" class="box-card" v-for="(re, index) in pageResult.content" :key="index">
        <div slot="header" class="clearfix">
          <span>{{re.name}}</span>
          <sapn style="float: right; color: red" type="text">{{getPaymentMin(re.payment)}}~{{getPaymentMax(re.payment)}}元</sapn>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <img height="100" width="200"
                 src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          </el-col>
          <el-col :span="9">
            <div class="text item">
              人数：{{re.peopleNum}}人
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
        })
      },
      handleAdd: function () {

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
      getPaymentMin: function(payment){
        return this.strToJson(payment).paymentMin
      },
      getPaymentMax: function(payment){
        return this.strToJson(payment).paymentMax
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum
        this.findPage(null)
      },
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

</style>
