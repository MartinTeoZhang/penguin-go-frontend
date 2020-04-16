<template>
  <div class="container" style="width:99%;margin-top:-25px;">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.search')" perms="sys:funExp:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button :label="$t('action.add')" perms="sys:funExp:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsEdit="sys:funExp:edit" permsDelete="sys:funExp:delete"
		:data="pageResult" :columns="columns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="编号" prop="id"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.id" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验名称" prop="name"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验状态" prop="status"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.status" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验类型 0：审核中 1：未发布 2：发布中 3：已结束" prop="type"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.type" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验报酬下限" prop="payment"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.payment" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="contact"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.contact" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验人数" prop="peopleNum"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.peopleNum" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验地点" prop="location"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.location" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验内容" prop="content"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.content" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验时间段" prop="time"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.time" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验时长" prop="duration"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.duration" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验要求" prop="requirement"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.requirement" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="实验偏好" prop="preference"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.preference" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="问卷ID" prop="questionnaireId"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.questionnaireId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="图片" prop="imageUrl"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.imageUrl" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="note"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.note" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="创建人" prop="createBy"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.createBy" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="创建时间" prop="createTime"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.createTime" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="更新人" prop="lastUpdateBy"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.lastUpdateBy" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="更新时间" prop="lastUpdateTime"  v-if="dataForm.isPrimaryKey">
				<el-input v-model="dataForm.lastUpdateTime" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
export default {
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			columns: [
				{prop:"id", label:"编号", minWidth:100},
				{prop:"name", label:"实验名称", minWidth:100},
				{prop:"status", label:"实验状态", minWidth:100},
				{prop:"type", label:"实验类型 0：审核中 1：未发布 2：发布中 3：已结束", minWidth:100},
				{prop:"payment", label:"实验报酬下限", minWidth:100},
				{prop:"contact", label:"联系方式", minWidth:100},
				{prop:"peopleNum", label:"实验人数", minWidth:100},
				{prop:"location", label:"实验地点", minWidth:100},
				{prop:"content", label:"实验内容", minWidth:100},
				{prop:"time", label:"实验时间段", minWidth:100},
				{prop:"duration", label:"实验时长", minWidth:100},
				{prop:"requirement", label:"实验要求", minWidth:100},
				{prop:"preference", label:"实验偏好", minWidth:100},
				{prop:"questionnaireId", label:"问卷ID", minWidth:100},
				{prop:"imageUrl", label:"图片", minWidth:100},
				{prop:"note", label:"备注", minWidth:100},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:100},
				{prop:"lastUpdateBy", label:"更新人", minWidth:100},
				{prop:"lastUpdateTime", label:"更新时间", minWidth:100},
			],
			pageRequest: { pageNum: 1, pageSize: 8 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				label: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: null,
				name: null,
				status: null,
				type: null,
				payment: null,
				contact: null,
				peopleNum: null,
				location: null,
				content: null,
				time: null,
				duration: null,
				requirement: null,
				preference: null,
				questionnaireId: null,
				imageUrl: null,
				note: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
			this.$api.exp.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.exp.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: null,
				name: null,
				status: null,
				type: null,
				payment: null,
				contact: null,
				peopleNum: null,
				location: null,
				content: null,
				time: null,
				duration: null,
				requirement: null,
				preference: null,
				questionnaireId: null,
				imageUrl: null,
				note: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.exp.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findPage(null)
						})
					})
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	}
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>
