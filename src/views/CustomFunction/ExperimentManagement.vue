<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="实验名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="fun:exper:viewexp" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('action.addexp')" perms="fun:exper:addexp" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>

    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                     :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize"
                     :total="pageResult.totalSize" style="float:right;">
      </el-pagination>
    </div>

    <!-- 卡片 -->
    <el-col :gutter="20">
      <el-card class="box-card" shadow="hover" v-for="(exp, index) in pageResult.content" :key="index"
               :size="size">
        <div slot="header" class="clearfix">
          <span>{{exp.name}}</span>
          <div class="state">
            <span class="state-content">ID: {{exp.id}}</span>
            <span v-if="exp.status === 0" class="state-content">审核中</span>
            <span v-if="exp.status === 1" class="state-content">未发布</span>
            <span v-if="exp.status === 2" class="state-content">发布中</span>
            <span v-if="exp.status === 3" class="state-content">已结束</span>
            <span class="state-content">{{dateFormatter(exp.createTime)}}</span>
          </div>
        </div>
        <el-row class="card-button">
          <kt-button icon="el-icon-edit" :label="$t('action.edit')" type="text"
                     style="color: #409EFF" perms="fun:exper:editexp" @click="handleEdit(exp)"></kt-button>
          <kt-button v-if="exp.status === 1" icon="el-icon-open" :label="$t('action.startPublishing')" type="text"
                     style="color: #909399" perms="fun:exper:editexp" @click="handlePublish(exp)"></kt-button>
          <kt-button v-if="exp.status === 2" icon="el-icon-turn-off" :label="$t('action.stopPublishing')" type="text"
                     style="color: #E6A23C" perms="fun:exper:editexp" @click="handlePublish(exp)"></kt-button>
          <kt-button icon="el-icon-user" :label="$t('action.checkRegistration')" type="text"
                     style="color: #C71585" perms="fun:exper:viewpeo" @click="handleCheckRegistration(exp)"></kt-button>
          <kt-button icon="el-icon-share" :label="$t('action.share')" type="text"
                     style="color: #67C23A" disabled>分享</kt-button>
          <kt-button icon="el-icon-delete" :label="$t('action.delete')" type="text"
                     style="color: #F56C6C" perms="fun:exper:deleteexp" @click="handleDelete(index)"></kt-button>
        </el-row>
<!--        <div v-for="o in 4" :key="o" class="text item">-->
<!--          {{'列表内容 ' + o }}-->
<!--        </div>-->
      </el-card>

    </el-col>

<!--    &lt;!&ndash;表格内容栏&ndash;&gt;-->
<!--    <kt-table :height="1000" permsEdit="sys:funExp:edit" permsDelete="sys:funExp:delete"-->
<!--              :data="pageResult" :columns="columns"-->
<!--              @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">-->
<!--    </kt-table>-->

    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="实验名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="实验类型" prop="types">
          <el-select v-model="dataForm.types"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     :multiple-limit=multiLimit
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in this.typeOptions" :key="item.value"
                       :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验报酬" prop="payment">
          <el-col :span="11">
            <el-input v-model="dataForm.payment.paymentMin" placeholder="可为0" auto-complete="off" style="width: 100%;"></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="dataForm.payment.paymentMax" placeholder="可与下限相同" auto-complete="off" style="width: 100%;" ref="paymentMax"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="dataForm.contact" placeholder="微信号/手机号/邮箱等" auto-complete="off" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="实验人次" prop="peopleNum">
          <el-input-number v-model.number="dataForm.peopleNum" :min="1" :max="999"
                           auto-complete="off" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="实验地点" prop="location">
          <el-input v-model="dataForm.location" auto-complete="off" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="实验内容" prop="content">
          <el-input type="textarea" v-model="dataForm.content" maxlength="999" show-word-limit :rows="5"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(dateTimePicker, index) in dataForm.time"
          :label="'时段' + (index+1)"
          :key="dateTimePicker.key"
          :prop="'time.' + index"
          :rules="{
            type: 'object', required: true, message: '实验时间段不能为空', trigger: 'change',
            fields: {
              dateValue: { type:'date', required: true, message: '请选择日期', trigger: 'change'},
              timeValue: { type:'array', required: true, message: '请选择时间范围', trigger: 'change',
                fields: {
                  [0]: { type:'date', required: true, message: '请选择起始时间', trigger: 'change'},
                  [1]: { type:'date', required: true, message: '请选择结束时间', trigger: 'change'}
                }
              }
            }
          }">
          <el-col :span="8">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="dateTimePicker.dateValue"
              style="width: 100%;"
              :picker-options="dateTimePickerOptions"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="10">
            <el-time-picker
              placeholder="选择时段"
              v-model="dateTimePicker.timeValue"
              is-range
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="dateTimePickerOptions"
              style="width: 100%;"></el-time-picker>
          </el-col>
          <el-button @click.prevent="removeDateTimePicker(dateTimePicker)" type="danger" v-if="index > 0" style="margin-left: 10px">删除</el-button>
        </el-form-item>
        <el-form-item style="text-align: left">
          <el-button @click="addDateTimePicker" type="primary" v-if="dataForm.time.length<10">新增实验时间段</el-button>
        </el-form-item>
        <el-form-item label="实验时长" prop="duration">
          <el-input-number v-model.number="dataForm.duration" :min="1" :max="999"
                           auto-complete="off" style="width: 100%;" placeholder="分钟"></el-input-number>
        </el-form-item>
        <el-form-item label="被试要求" prop="requirements">
          <el-select v-model="dataForm.requirements"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option-group
              v-for="group in this.requirementOptions"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="实验偏好" prop="preferences">
            <el-checkbox-group v-model="dataForm.preferences" style="text-align: left">
              <el-checkbox label="提交后直接发布" name="type" checked></el-checkbox>
              <el-checkbox label="人数到达上限时停止发布" name="type"></el-checkbox>
              <el-checkbox label="排除职业被试" name="type"></el-checkbox>
              <el-checkbox label="排除低分被试" name="type"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="填写问卷" prop="questionnaireId">
          <el-input placeholder="问卷ID" v-model="dataForm.questionnaireId" class="input-with-select" maxlength="8" show-word-limit>
            <el-select v-model="dataForm.questionnaireType" slot="prepend" placeholder="请选择" style="width: 100px" disabled>
              <el-option label="问卷星" value="1"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
<!--        <el-form-item label="上传图片" prop="fileList" style="text-align: left">-->
<!--          <el-upload-->
<!--            class="uploadFile"-->
<!--            action="http://localhost:8001/posts/"-->
<!--            v-if="this.dataForm.fileList.length<5"-->
<!--            :on-preview="previewImageFile"-->
<!--            :on-remove="removeImageFile"-->
<!--            :on-success="successImageFile"-->
<!--            :before-upload="beforeImageFileUpload"-->
<!--            :file-list="dataForm.fileList"-->
<!--            ref="upload"-->
<!--            :auto-upload="true"-->
<!--            drag-->
<!--            :limit="this.multiLimit"-->
<!--            list-type="picture"-->
<!--            style="width: 100%">-->
<!--            <i class="el-icon-upload"></i>-->
<!--            <div class="el-upload__text" style="justify-content: center">将文件拖到此处，或<em>点击上传</em></div>-->
<!--            <div class="el-upload__tip" slot="tip">只能上传5个jpg/png文件，且不超过500kb（第一张为实验封面）</div>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="dataForm.note" maxlength="999" show-word-limit :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--图片选择-->
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!--报名情况-->
    <el-dialog :visible.sync="registDialogVisible">
      <kt-table :width="700" :height="375" permsEdit="fun:exper:editexp" permsDelete="sys:user:delete"
                :data="pagePeoResult" :columns="columns"
                @findPage="findPeoPage" @handleEdit="handlePeoEdit" @handleDelete="handlePeoDelete">
      </kt-table>
    </el-dialog>

    <!--被试报名状态编辑-->
    <el-dialog title="更改被试报名状态" :visible.sync="statusDialogVisible">
      <div>
        <el-radio-group v-model="radioStatus" :size=size @change="changeCurrentStatus">
          <!--TODO v-for v-if不要一起用，先搁置-->
          <!--TOOD 希望增加一个filter，使radio group只能向前选择，之前的radio disabled-->
          <el-radio-button v-for="(value, index) in this.radioStatusList" :key="index"
                           :label="value" v-if="index < 4"></el-radio-button>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="statusDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="setCurrentStatus">{{$t('action.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import { format } from "@/utils/datetime"
  import {isBtwZeroToTenThousand, isInteger} from '../../utils/validate'

  export default {
    components:{
      KtButton,
      KtTable,
    },
    data() {
      return {
        size: 'small',

        filters: {
          name: '',
        },

        // 分页信息
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        pagePeoRequest: { pageNum: 1, pageSize: 10 , columnFilters: null},
        pagePeoResult: {},

        dataFormRules: {
          name: [
            { required: true, message: '请输入实验名称', trigger: 'blur'},
            { max: 20, message: '长度在20个字符内', trigger: 'blur' }
          ],
          types: [
            { type: 'array', required: true, message: '请至少输入或选择一个实验类型', trigger: 'change'},
            { validator: this.checkSelectedTypes, trigger: 'change'}
          ],
          payment: [
            {
              type: 'object',
              required: true,
              message: '请输入实验报酬',
              trigger: 'blur',
              fields: {
                paymentMin: [{ required: true, message: '请输入实验报酬下限', trigger: 'blur'},
                              {validator: this.checkPayment, trigger: 'blur'}],
                paymentMax: [{ required: true, message: '请输入实验报酬上限', trigger: 'blur'},
                              { validator: this.checkPayment, trigger: 'blur'}]
              }
            }
          ],
          contact: [
            { required: true, message: '请输入联系方式', trigger: 'blur'},
            { maxLength: 40, message: '长度在40个字符内', trigger: 'blur' }
          ],
          peopleNum: [
            { required: true, message: '请输入实验人次', trigger: 'blur'},
            { type: 'number', min: 1, max: 999, message: '实验人次在[1, 999]范围内', trigger: 'blur' },
            { validator: isInteger }
          ],
          location: [
            { required: true, message: '请输入实验地点', trigger: 'blur'},
            { maxLength: 40, message: '长度在40个字符内', trigger: 'blur' }
          ],
          content: [
            { maxLength: 999, message: '长度在999个字符内', trigger: 'blur' }
          ],
          duration: [
            { required: true, message: '请输入实验时长', trigger: 'blur' },
            { type: 'number', min: 1, max: 999, message: '实验时长在[1, 999]范围内', trigger: 'blur' },
            { validator: isInteger}
          ],
          requirements: [
            { type: 'array', required: false },
            { validator: this.checkSelectedRequirements, trigger: 'change' }
          ],
          preferences: [
            { type: 'array', required: false }
          ],
          questionnaireId: [
            { required: false, min:8, max: 8 , message: '问卷ID为8位数', trigger: 'blur'}
          ],
          fileList: [
            { validator: this.checkFileList, trigger:'change' }
          ],
          note: { maxLength: 999, message: '长度在999个字符内', trigger: 'blur' }
        },

        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        registDialogVisible: false, // 报名情况界面是否显示
        editLoading: false,

        // 新增实验界面数据
        dataForm: {
          id: 0,
          name: '',
          status: 1,
          types: [],
          payment: {paymentMin: null, paymentMax: null},
          contact: '',
          peopleNum: 1,
          location: '',
          content: '',
          time: [{
            dateValue: Date.now(),
            timeValue: [Date.now(), Date.now()]
          }],
          duration: 1,
          requirements: null,
          preferences: [],
          questionnaireType: '问卷星',
          questionnaireId: null,
          fileList: [],
          note: '',
        },

        multiLimit: 5, // 实验种类最多选择个数

        typeOptions: [{ // 实验种类
          value: '选项1',
          label: '按键实验'
        }, {
          value: '选项2',
          label: '脑电实验'
        }, {
          value: '选项3',
          label: '问卷实验'
        }, {
          value: '选项4',
          label: '其它'
        }],

        dateTimePickerOptions: {
          disabledDate(time) {
            return time.getTime <= Date.now();
          },
          // shortcuts: [{
          //   text: '今天',
          //   onClick(picker) {
          //     picker.$emit('pick', new Date());
          //   }
          // }, {
          //   text: '昨天',
          //   onClick(picker) {
          //     const date = new Date();
          //     date.setTime(date.getTime() - 3600 * 1000 * 24);
          //     picker.$emit('pick', date);
          //   }
          // }, {
          //   text: '一周前',
          //   onClick(picker) {
          //     const date = new Date();
          //     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          //     picker.$emit('pick', date);
          //   }
          // }]
        },

        requirementOptions: [{
          label: '利手',
          options: [{
            value: '组1选项1',
            label: '左利手'
          }, {
            value: '组1选项2',
            label: '右利手'
          }]
        }, {
          label: '视力',
          options: [{
            value: '组2选项1',
            label: '无高度近视'
          }, {
            value: '组2选项3',
            label: '矫正视力'
          }, {
            value: 'Dalian',
            label: '无近视'
          }]
        }],

        dialogImageUrl: '',
        imageDialogVisible: false,

        selectedExpId: null, // 选择报名情况的实验

        columns: [  // 报名情况列
          {prop:"name", label:"用户名", minWidth:100},
          {prop:"email", label:"邮箱", minWidth:120},
          {prop:"mobile", label:"手机", minWidth:120},
          {prop:"createTime", label:"报名时间", minWidth:100, formatter:this.dateFormat},
          {prop:"status", label:"报名状态", minWidth:100, formatter:this.statusFormat},
        ],

        statusDialogVisible: false,
        radioStatusList: ["未处理", "已预约", "进行中", "已结束", "已取消", "未知"],
        radioStatus: "",
        currentStatusIndex: 0,
        selectedExpUserId: null,  // 选择报名情况的被试
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {
          userName: {userName:'userName', value:sessionStorage.getItem("user")},
          expName: {expName:'expName', value:this.filters.name},
        }
        this.$api.exp.findPage(this.pageRequest).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')
      },
      // 获取报名分页数据
      findPeoPage: function (data) {
        // if(data !== null) {
        //   this.pagePeoRequest = data.pagePeoRequest
        // }
        this.pagePeoRequest.columnFilters = {
          expId: {expId:'expId', value:this.selectedExpId}
        }
        this.$api.exp.findExpUsersPage(this.pagePeoRequest).then((res) => {
          this.pagePeoResult = res.data;
          // this.pagePeoResult['expUserStatus'] = 1
        }).then(data!=null?data.callback:'')
      },
      // 单个删除
      handleDelete: function (index) {
        this.delete(index)
      },
      delete: function (index) {
        this.$confirm("确认删除选中实验吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.loading = true
          let params = []
          params.push({'id': this.pageResult.content[index].id})
          this.$api.exp.batchDelete(params).then( res => {
            if(res.code == 200) {
              this.$message({message: '删除成功', type: 'success'})
              this.findPage(null)
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
            this.loading = false
          })
        })
      },
      // 显示新增实验界面
      handleAdd: function() {
        this.dialogVisible = true
        this.operation = true
        // this.dataForm = {
        //   id: 0,
        //   name: '',
        //   password: '',
        //   deptId: 1,
        //   deptName: '',
        //   email: 'test@qq.com',
        //   mobile: '13889700023',
        //   status: 1,
        //   userRoles: []
        // }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.dataFormFormat(params)
        this.dialogVisible = true
        this.operation = false
      },
      // 显示发布提示
      handlePublish: function (params) {
        var currentStatus = params.status
        var nextStatus = currentStatus == 1 ? 2 : 1
        var text = currentStatus == 1 ? "确认开始发布实验吗？": "确认停止发布实验吗？"
        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          params.status = nextStatus
          this.$api.exp.save(params).then((res) => {
            if(res.code == 200) {
              this.$message({ message: '操作成功', type: 'success' })
              this.$refs['dataForm'].resetFields()
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
            this.findPage(null)
          })
        })
      },
      // 显示报名情况
      handleCheckRegistration: function (params) {
        this.registDialogVisible = true
        this.selectedExpId = params.id
        this.findPeoPage(null)
      },
      // 删除报名的被试
      handlePeoDelete: function (data) {
        this.$api.exp.batchPeoDelete(data.params).then(data!=null?data.callback:'')
      },
      // 编辑报名的被试
      handlePeoEdit: function (data) {
        this.statusDialogVisible = true
        this.selectedExpUserId = data.row.id  // 被试报名情况中，被试列表的id存储的是expUserId，而不是userId
        this.$api.exp.findExpUserById({id: data.row.id}).then((res) => {  // 防止再次打开编辑时未刷新状态
          this.radioStatus = this.getStatusText(res.data.status)
        })
      },
      changeCurrentStatus: function(value) {
        this.currentStatusIndex = this.getStatusIndex(value)

      },
      setCurrentStatus: function() {
        let params = {
          id: this.selectedExpUserId,
          status: this.currentStatusIndex
        }
        this.$api.exp.saveExpUser(params).then((res) => {
          if(res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        })
        this.statusDialogVisible = false
        // this.$api.exp.saveExpUser({id: this.selectedExpUserId, status: this.currentStatusIndex})
      },
      dataFormFormat(exp) {
        this.dataForm.id = exp.id
        this.dataForm.name = exp.name
        this.dataForm.status = exp.status
        this.dataForm.types = JSON.parse( exp.types.replace(/\\'/g,"\""))
        this.dataForm.payment = JSON.parse( exp.payment.replace(/\\'/g,"\""))
        this.dataForm.contact = exp.contact
        this.dataForm.peopleNum = exp.peopleNum
        this.dataForm.location = exp.location
        this.dataForm.content = exp.content
        this.dataForm.time = JSON.parse( exp.time.replace(/\\'/g,"\""))
        this.dataForm.duration = exp.duration
        this.dataForm.requirements = JSON.parse( exp.requirements.replace(/\\'/g,"\""))
        this.dataForm.preferences = JSON.parse( exp.preferences.replace(/\\'/g,"\""))
        this.dataForm.questionnaireType = exp.questionnaireType
        this.dataForm.questionnaireId = exp.questionnaireId
        this.dataForm.fileList = JSON.parse( exp.fileList.replace(/\\'/g,"\""))
        this.dataForm.note = exp.note
      },
      // 实验种类过滤
      checkSelectedTypes: function(rule, value, callback) {
        // console.log(val)
        for(var i = 0; i < value.length; i++) {
          if (value[i].length > 10)
            callback(new Error('每个实验类型长度不大于10'));
        }
        callback()
      },
      // // 实验报酬上限验证（这里采用了自定义验证，也可以规则中用field属性使用对象的嵌套验证）
      // checkPayment: function(rule, value, callback) {
      //   let paymentMin = Number(value)
      //   let paymentMax = Number(this.$refs.paymentMax.value); // 在第2个输入框添加ref属性来绑定
      //   // console.log('min: ' + paymentMin + '  max: ' + paymentMax)
      //
      //   isBtwZeroToTenThousand(rule, paymentMin, callback)
      //   isBtwZeroToTenThousand(rule, paymentMax, callback)
      //
      //   if (paymentMin > paymentMax) {
      //     callback(new Error('实验报酬上限需要大于等于实验报酬下限'));
      //   }
      //   callback();
      // },
      // 实验报酬校验
      checkPayment: function(rule, value, callback) {
        // console.log(this.dataForm.payment)
        let paymentMin = Number(this.dataForm.payment.paymentMin)
        let paymentMax = Number(value)
        isBtwZeroToTenThousand(rule, paymentMin, callback)
        isBtwZeroToTenThousand(rule, paymentMax, callback)
        if (paymentMin > paymentMax) {
          callback(new Error('实验报酬上限需要大于等于实验报酬下限'));
        }
        callback();
      },
      // 被试要求校验
      checkSelectedRequirements: function(rule, value, callback) {
        // console.log(val)
        for(var i = 0; i < value.length; i++) {
          if (value[i].length > 10)
            callback(new Error('每个被试要求长度不大于10'));
        }
        callback()
      },
      checkFileList: function(rule, value, callback) {
        // console.log(val)
        if (value.length > 5)
            callback(new Error('最多只能上传5张图片'));
        callback()
      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              // this.$refs.upload.submit(); // 上传文件

              // （可能需要注意双引号无法正确识别的问题 https://www.cnblogs.com/wangyunjie/p/5826676.html）
              params.types = JSON.stringify(params.types).replace(/\"/g, "\\'")
              params.payment = JSON.stringify(params.payment).replace(/\"/g, "\\'")
              params.requirements = JSON.stringify(params.requirements).replace(/\"/g, "\\'")
              params.time = JSON.stringify(params.time).replace(/\"/g, "\\'")
              params.preferences = JSON.stringify(params.preferences).replace(/\"/g, "\\'")
              params.fileList = JSON.stringify(params.fileList).replace(/\"/g, "\\'")

              // console.log(params)
              this.$api.exp.save(params).then((res) => {
                this.editLoading = false
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findPage(null)
              })
            })
          }
        })
      },
      removeDateTimePicker(item) {
        var index = this.dataForm.time.indexOf(item)
        if (index > 0) {
          this.dataForm.time.splice(index, 1)
        }
      },
      addDateTimePicker() {
        if(this.dataForm.time.length < 11) {
          this.dataForm.time.push({
            dateValue: Date.now(),
            timeValue: [Date.now(), Date.now()],
            key: Date.now()
          });
        }
      },
      // 卡片时间格式化
      dateFormatter: function (value){
        return format(value)
      },
      // 表格时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },
      // 表格状态格式化
      statusFormat: function (row, column, cellValue, index){
        return this.getStatusText(cellValue)
      },
      getStatusText: function(index) {
        return this.radioStatusList[index % this.radioStatusList.length]
      },
      getStatusIndex: function(value) {
        var i
        for(i = 0; i < this.radioStatusList.length; ++i) {
          if(value === this.radioStatusList[i])
            return i
        }
        return i
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum
        this.findPage(null)
      },
      // 文件上传，暂时不作实现
      // previewImageFile(file) {
      //   this.dialogImageUrl = file.url
      //   this.imageDialogVisible = true
      // },
      // removeImageFile(file, fileList) {
      //   this.dataForm.fileList = fileList
      //   // 文件删除后也要触发验证,validateField是触发部分验证的方法,参数是prop设置的值
      //   this.$refs.dataForm.validateField('fileList')
      // },
      // successImageFile(res, file, fileList) { // 图片上传
      //   // 这里可以写文件上传成功后的处理,但是一定要记得给fileList赋值
      //   this.dataForm.fileList.push(file)
      //   // 文件上传后不会触发form表单的验证,要手动添加验证
      //   this.$refs.dataForm.validateField('fileList')
      // },
      // beforeImageFileUpload: function(file) {
      //   // console.log(file)
      //   const isJPG = file.type === 'image/jpeg';
      //   const isPNG = file.type === 'image/png';
      //   const isPG = (isJPG || isPNG)  //限制图片格式为jpg/png
      //   const isLt500KB = file.size / 1024 / 1024 < 0.5; //限制图片大小
      //
      //   if(!isPG) {
      //     this.$message({
      //       message: '上传的文件只能是jpg/png格式',
      //       type: 'warning'
      //     });
      //   }
      //
      //   if(!isLt500KB) {
      //     this.$message({
      //       message: '上传的文件大小不能超过500kb',
      //       type: 'warning'
      //     });
      //   }
      //
      //   return isPG && isLt500KB
      // },
    },
    mounted() {
      this.findPage(null)
    }
  }
</script>

<style scoped>
  .box-card {
    margin-bottom: 20px;
    width: 800px;
    height: 125px;
    text-align: left;
  }
  .card-button {
    float: right;
    margin-left: 20px;
  }
  .state {
    margin-top: 5px;
    margin-left: 10px;
    float: right;
    font-size: small;
    color: #999;
  }
  .state-content {
    margin-left: 10px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
