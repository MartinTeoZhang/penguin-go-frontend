<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="实验名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" label="新增实验" perms="sys:user:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>

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
        <el-form-item label="实验类型" prop="selectedTypes">
          <el-select v-model="dataForm.selectedTypes"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     :multiple-limit=multiLimit
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in this.type" :key="item.value"
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
        <el-form-item label="实验内容">
          <el-input type="textarea" v-model="dataForm.desc" maxlength="999" show-word-limit :rows="5"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(dateTimePicker, index) in dataForm.dateTimePickers"
          :label="'时段' + (index+1)"
          :key="dateTimePicker.key"
          :prop="'dateTimePickers.' + index"
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
          <el-button @click="addDateTimePicker" type="primary">新增实验时间段</el-button>
        </el-form-item>
        <el-form-item label="实验时长" prop="duration">
          <el-input-number v-model.number="dataForm.duration" :min="1" :max="999"
                           auto-complete="off" style="width: 100%;" placeholder="分钟"></el-input-number>
        </el-form-item>
        <el-form-item label="被试要求" prop="selectedRequirements">
          <el-select v-model="dataForm.selectedRequirements"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option-group
              v-for="group in this.requirements"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="实验偏好" prop="preference">
            <el-checkbox-group v-model="dataForm.preference" style="text-align: left">
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
        <el-form-item label="上传图片" prop="fileList" style="text-align: left">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="previewImageFile"
            :on-remove="removeImageFile"
            :on-success="successImageFile"
            :before-upload="beforeImageFileUpload"
            :file-list="dataForm.fileList"
            ref="upload"
            :auto-upload="true"
            drag
            multiple
            :limit="this.multiLimit"
            list-type="picture"
            style="width: 100%">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="justify-content: center">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传5份jpg/png文件，且不超过500kb（第一张为实验封面）</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="dataForm.note" maxlength="999" show-word-limit :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton"
  import {isBtwZeroToTenThousand, isInteger} from '../../utils/validate'

  export default {
    components:{
      KtButton,

    },
    data() {
      return {
        size: 'small',

        filters: {
          name: ''
        },

        dataFormRules: {
          name: [
            { required: true, message: '请输入实验名称', trigger: 'blur'},
            { max: 20, message: '长度在20个字符内', trigger: 'blur' }
          ],
          selectedTypes: [
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
            { required: true, message: '请输入实验时长', trigger: 'blur'},
            { type: 'number', min: 1, max: 999, message: '实验时长在[1, 999]范围内', trigger: 'blur' },
            { validator: isInteger}
          ],
          selectedRequirements: [
            { type: 'array', required: false},
            { validator: this.checkSelectedRequirements, trigger: 'change'}
          ],
          preference: [
            { type: 'array', required: false},
            { validator: this.checkSelectedRequirements, trigger: 'change'}
          ],
          note: { maxLength: 999, message: '长度在999个字符内', trigger: 'blur' }
        },

        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,

        // 新增实验界面数据
        dataForm: {
          id: 0,
          name: '',
          selectedTypes: [],
          payment: {paymentMin: null, paymentMax: null},
          contact: '',
          peopleNum: 1,
          location: '',
          desc: '',
          date: null,
          time: null,
          dateTimePickers: [{
            dateValue: Date.now(),
            timeValue: [Date.now(), Date.now()]
          }],
          duration: 1,
          selectedRequirements: null,
          preference: [],
          questionnaireType: '问卷星',
          questionnaireId: '',
          note: '',
          fileList: [],
          status: 1,
        },

        multiLimit: 5, // 实验种类最多选择个数

        type: [{ // 实验种类
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
            return time.getTime() <= Date.now();
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

        requirements: [{
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
      }
    },
    methods: {
      checkSelectedTypes: function(rule, value, callback) { // 实验种类过滤
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
      checkPayment: function(rule, value, callback) { // 实验报酬校验
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
      checkSelectedRequirements: function(rule, value, callback) { // 被试要求校验
        // console.log(val)
        for(var i = 0; i < value.length; i++) {
          if (value[i].length > 10)
            callback(new Error('每个被试要求长度不大于10'));
        }
        callback()
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
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              // this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              console.log(this.dataForm)
              // this.$refs.upload.submit(); // 上传文件

              // let userRoles = []
              // for(let i=0,len=params.userRoles.length; i<len; i++) {
              //   let userRole = {
              //     userId: params.id,
              //     roleId: params.userRoles[i]
              //   }
              //   userRoles.push(userRole)
              // }
              // params.userRoles = userRoles
              // this.$api.user.save(params).then((res) => {
              //   this.editLoading = false
              //   if(res.code == 200) {
              //     this.$message({ message: '操作成功', type: 'success' })
              //     this.dialogVisible = false
              //     this.$refs['dataForm'].resetFields()
              //   } else {
              //     this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              //   }
              //   this.findPage(null)
              // })
            })
          }
        })
      },
      removeDateTimePicker(item) {
        var index = this.dataForm.dateTimePickers.indexOf(item)
        if (index > 0) {
          this.dataForm.dateTimePickers.splice(index, 1)
        }
      },
      addDateTimePicker() {
        this.dataForm.dateTimePickers.push({
          dateValue: Date.now(),
          timeValue: [Date.now(), Date.now()],
          key: Date.now()
        });
      },
      previewImageFile(file) {
        this.dialogImageUrl = file.url
        this.imageDialogVisible = true
      },
      removeImageFile(file, fileList) {
        // this.dataForm.fileList.remove(file) // TODO
        // // 文件删除后也要触发验证,validateField是触发部分验证的方法,参数是prop设置的值
        // this.$refs.dataForm.validateField('fileList')
      },
      successImageFile(res, file, fileList) { // 图片上传
        // // 这里可以写文件上传成功后的处理,但是一定要记得给fileList赋值
        // this.dataForm.fileList.append(file) // TODO
        // // 文件上传后不会触发form表单的验证,要手动添加验证
        // this.$refs.dataForm.validateField('fileList')
      },
      beforeImageFileUpload: function(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isPG = (isJPG || isPNG)  //限制图片格式为jpg/png
        const isLt500KB = file.size / 1024 / 1024 < 0.5; //限制图片大小

        if(!isPG) {
          this.$message({
            message: '上传的文件只能是jpg/png格式',
            type: 'warning'
          });
        }

        if(!isLt500KB) {
          this.$message({
            message: '上传的文件大小不能超过500kb',
            type: 'warning'
          });
        }

        return isPG && isLt500KB
      },

    }
  }
</script>

<style scoped>

</style>
