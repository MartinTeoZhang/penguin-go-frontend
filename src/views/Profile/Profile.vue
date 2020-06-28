<template>
  <div>
    <br>
    <br>

    <!--头像账号等个人信息-->
    <el-row :gutter="20" >
      <el-col :span="14">
        <el-col :span="8">
          <div class="block"><el-avatar :size="150" :src="circleUrl"></el-avatar></div>
          <el-link @click="avatarDialogVisible = true">更换头像</el-link>
        </el-col>
        <el-col :span="16">
          <el-row>
            <el-col :span="6" class="aligin-left">
              <p class="sub-title">用户名：</p>
              <p class="sub-title">邮箱：</p>
              <p class="sub-title">手机号：</p>
              <p class="sub-title">账号类型：</p>
            </el-col>
            <el-col :span="18" class="aligin-left" style="margin-top: 5px">
              <p class="sub-message">{{dataForm.name}}</p>
              <p class="sub-message">{{dataForm.email}}</p>
              <p class="sub-message">{{dataForm.mobile}}</p>
              <p class="sub-message">{{dataForm.roleNames}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-col>

    </el-row>
<!--    信息展示-->
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="实验统计" name="first">
          <el-row style="font-family: 'Helvetica Neue',Helvetica,'PingFang SC',sans-serif;
           font-weight: bold">

            <el-col :span="6" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); padding: 20px">
                <span style="color:#67C23A; font-size:20px"><i class="fa fa-heartbeat fa-lg"></i>参与实验<span style="color: #409EFF; font-size:25px">{{attend_sum}}</span>个</span>
            </el-col>
            <el-col :span="6" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            padding: 20px;margin-left: 10px;">
              <span style="color:#E6A23C; font-size:20px"><i class="fa fa-jpy fa-lg"></i>总报酬<span style="color: #409EFF; font-size:25px">{{reward_sum}}</span>元</span>
            </el-col>
            <el-col :span="6" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            padding: 20px;margin-left: 10px;">
              <span style="color:	#7B68EE; font-size:20px"><i class="fa fa-clock-o fa-lg"></i>总时长<span style="color: #409EFF; font-size:25px">{{time_sum}}</span>分钟</span>
            </el-col>
          </el-row>
          <el-row>
            <!--表格内容栏-->
            <kt-table :height="350" :showBatchDelete="false" :showOperation="false"
                      :data="pageResult" :columns="filterColumns"
                      @findPage="findPage">
            </kt-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="编辑个人信息" name="second">
          <el-row style="margin: 20px">
            <el-col :span="8">
              <el-row>
                <el-col :span="4" style="margin-top: 10px">
                  <span>用户名</span>
                </el-col>
                <el-col :span="10">
                  <el-input
                    placeholder="用户名"
                    v-model="dataForm.name"
                    :disabled="true">
                  </el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" style="margin-top: 10px">
                  <span>手机</span>
                </el-col>
                <el-col :span="10">
                  <el-input
                    placeholder="手机"
                    v-model="phone_change_input"
                    v-on:input="phone_button_disable=false"
                    maxlength="11"
                    clearable>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" :disabled="phone_button_disable" @click="changePhone">确认</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" style="margin-top: 10px">
                  <span>邮箱</span>
                </el-col>
                <el-col :span="10">
                  <el-input
                    placeholder="邮箱"
                    type="email"
                    v-model="email_change_input"
                    v-on:input="email_button_disable=false"
                    clearable>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" :disabled="email_button_disable" @click="changeEmail">确认</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-button type="warning" @click="pwdDialogVisible = true">更改密码</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>

  <!--更换头像的dialog-->
    <el-dialog
      title="更换头像"
      :visible.sync="avatarDialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="avatarDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="avatarDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

<!--    更改密码的dialog-->
    <el-dialog
      title="更改密码"
      :visible.sync="pwdDialogVisible"
      width="30%">
      <el-row style="margin-top: 20px">
        <el-col :span="8" style="margin-top: 10px">
          <span>原密码</span>
        </el-col>
        <el-col :span="16">
          <el-input
            placeholder="原密码"
            show-password
            v-model="pwd_change_raw_input"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" style="margin-top: 10px">
          <span>新密码</span>
        </el-col>
        <el-col :span="16">
          <el-input
            placeholder="新密码"
            show-password
            v-model="pwd_change_new_input"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" style="margin-top: 10px">
          <span>确认新密码</span>
        </el-col>
        <el-col :span="16">
          <el-input
            placeholder="确认新密码"
            show-password
            v-model="pwd_change_new_check_input"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="24">
          <el-button type="primary" @click="changePwd">更改密码</el-button>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
    import api from "../../http/api";

    export default {
      components:{
        PopupTreeInput,
        KtTable,
        KtButton,
        TableColumnFilterDialog
      },
      name: "Profile",
      data() {
        return {
          phone_change_input:"",
          email_change_input:"",
          phone_button_disable:"true",
          email_button_disable:"true",
          account_type: "未知",
          circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          imageUrl: '',
          sizeList: ["large", "medium", "small"],
          avatarDialogVisible: false,
          pwdDialogVisible: false,
          activeName: 'first',
          attend_sum: '0',
          reward_sum: '0',
          time_sum:'0',
          pwd_change_raw_input: "",
          pwd_change_new_input: "",
          pwd_change_new_check_input: "",
          pageRequest: { pageNum: 1, pageSize: 10 },
          pageResult: {},
          filterColumns:[],
          filters: {
            name: ''
          },
          dataForm: {
            id: 0,
            name: '未知',
            password: '',
            deptId: 1,
            deptName: '',
            email: 'test@qq.com',
            mobile: '13889700023',
            status: 1,
            roleNames: "未知",
            userRoles: []
          },
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      },
      methods:{
        handleClose(done) {
          this.$confirm('取消更换头像？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },

        handleClick(tab, event) {
          console.log(tab, event);
        },

        //加载个人基本信息
        loadBasicInfo(){
          this.username = sessionStorage.getItem("user");
          this.$api.profile.getBasicInfo({name :this.username}).then((res)=>{
            console.log(res);
            this.dataForm = Object.assign({}, res.data);
            this.email_change_input = res.data.email;
            this.phone_change_input = res.data.mobile;
            this.loadExpermentData();
          })
        },

        //加载实验概览数据
        loadExpermentData(){
          //被试或主试
          if (this.dataForm.userRoles[0].roleId === 9|| this.dataForm.userRoles[0].roleId === 10){
            this.$api.profile.getExpStatData({id :this.dataForm.id}).then((res)=>{
              this.attend_sum = res.data.expCount;
              this.reward_sum = res.data.paymentCount;
              this.time_sum = res.data.timeCount;
            })
          }
        },

        //加载分页的参与实验数据
        findPage(data){
          if(data !== null) {
            this.pageRequest = data.pageRequest
          }
          this.pageRequest.columnFilters = {
            userName: {userName:'userName', value:sessionStorage.getItem("user")}
          };
          this.$api.exp.findPage(this.pageRequest).then((res) => {
            this.pageResult = this.columnFilter(res.data);
            console.log(this.pageResult);
          }).then(data!=null?data.callback:'')
        },

        //表格数据格式化
        columnFilter(data){
          for(let i=0; i<data.content.length; i++){
            data.content[i].payment=JSON.parse( data.content[i].payment.replace(/\\'/g,"\""));
            data.content[i].payment = data.content[i].payment.paymentMin+" ~ " + data.content[i].payment.paymentMax;
            data.content[i].types=JSON.parse( data.content[i].types.replace(/\\'/g,"\""));
            console.log(data.content[i].types);
            let str = "";
            for (let j=0 ; j < data.content[i].types.length ; j++){
              str += data.content[i].types[j] + " ";
            }
            data.content[i].types = str;
          }
          return data;
        },

        // 时间格式化
        dateFormat: function (row, column, cellValue, index){
          return format(row[column.property])
        },
        // 处理表格列过滤显示
        displayFilterColumnsDialog: function () {
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
        },
        // 处理表格列过滤显示
        handleFilterColumns: function (data) {
          this.filterColumns = data.filterColumns
          this.$refs.tableColumnFilterDialog.setDialogVisible(false)
        },

        // 处理表格列过滤显示
        initColumns: function () {
          this.columns = [
            {prop:"id", label:"ID", minWidth:50},
            {prop:"name", label:"实验名称", minWidth:120},
            {prop:"types", label:"实验类型", minWidth:100},
            {prop:"duration", label:"实验时长(min)", minWidth:120},
            {prop:"payment", label:"报酬", minWidth:120},
            //{prop:"time", label:"实验时间", minWidth:100},
            {prop:"status", label:"状态", minWidth:70},
            {prop:"contact", label:"联系方式", minWidth:70},
            // {prop:"createBy", label:"创建人", minWidth:120},
            // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
            // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
            // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        },

        //更改手机号
        changePhone(){
          if (this.phone_change_input === this.dataForm.mobile){
            this.$message('未作任何更改');
          }else if (this.phone_change_input.length < 11){
            this.$message('手机号长度过短');
          }else {
            this.$api.user.save({id: this.dataForm.id, mobile: this.phone_change_input}).then((res) => {
              if(res.code === 200) {
                this.$message({ message: '操作成功', type: 'success' });
                this.phone_button_disable = true;
                this.dataForm.mobile = this.phone_change_input;
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
            })
          }
        },

        //更改邮箱
        changeEmail(){
          if (this.email_change_input === this.dataForm.email){
            this.$message('未作任何更改');
          }else if (this.email_change_input.length < 5){
            this.$message('邮箱长度过短');
          }else {
            this.$api.user.save({id: this.dataForm.id, email: this.email_change_input}).then((res) => {
              if(res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' });
                this.email_button_disable = true;
                this.dataForm.email = this.email_change_input;
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
            })
          }
        },

        changePwd(){
          if (this.pwd_change_raw_input.length <= 0){
            this.$message({message: '请输入原密码', type: 'error'})
          }else if (this.pwd_change_new_input.length <= 0){
            this.$message({message: '请输入新密码', type: 'error'})
          }else if (this.pwd_change_new_check_input.length <= 0){
            this.$message({message: '请确认新密码', type: 'error'})
          }else if (this.pwd_change_new_input != this.pwd_change_new_check_input){
            this.$message({message: '两次输入的密码不一致', type: 'error'})
          }else{
            this.$api.profile.updatePwd({id: this.dataForm.id, oldPwd: this.pwd_change_raw_input, newPwd: this.pwd_change_new_input}).then((res)=>{
              if(res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' });
                this.pwdDialogVisible = false;
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
            })
          }
        },

      },

      mounted() {
        this.loadBasicInfo();
        this.initColumns();
      }
    }
</script>

<style scoped>

  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .aligin-left{
    text-align: left;
  }

  .sub-title{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 16px;
    color:#409EFF;
  }

  .sub-message{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 16px;
    color: rgb(121, 187, 255);
  }

  /*用户头像上传组件*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
