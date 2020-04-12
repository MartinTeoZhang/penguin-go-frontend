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

    <div>
      <!-- Card卡片 -->
      <el-card shadow="hover" class="box-card">
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
      </el-card>
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
        }
      };
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



