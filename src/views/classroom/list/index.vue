<template>
  <div class="app-container">
    <el-button type="primary" @click="showSaveDialog('saveForm')" icon="el-icon-plus" circle size="small"></el-button>
    <el-divider></el-divider>

    <!-- 条件栏 -->
    <el-form ref="form" :inline="true" :model="classroomQuery" class="demo-form-inline">
        <el-form-item label="楼层">
            <el-input size="small" v-model="classroomQuery.floor"  placeholder="floor" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="门牌号">
            <el-input size="small" v-model="classroomQuery.number"  placeholder="number" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="座位数">
                <el-input size="small" v-model="classroomQuery.startSeat" style="width:60px"></el-input>
                ~
                <el-input size="small" v-model="classroomQuery.endSeat" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="教室类型">
            <el-select v-model="classroomQuery.typeId" placeholder="教室类型">
                <el-option v-for="(type,index) in classType" :key="index" :label="type.name" :value="type.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getClassroomList()">查询</el-button>
            <el-button type="info" @click="clearClassroomQuery()">清空</el-button>
        </el-form-item>
    </el-form>

    <el-table
        :data="list"
        border
        style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
                {{ scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column
            prop="classname"
            label="教室名字"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            prop="floor"
            label="楼层"
            width="40" align="center">
        </el-table-column>
        <el-table-column
            prop="number"
            label="门牌号"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="seat"
            label="座位数"
            width="80" align="center">
        </el-table-column>
        <el-table-column
            prop="typeId"
            label="教室类型"
            width="100" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.typeId == 1">公共教室</div>
                <div v-else-if="scope.row.typeId == 2">专业教室</div>
                <div v-else-if="scope.row.typeId == 3">实验室</div>
                <div v-else>未知</div>
            </template>
        </el-table-column>
    
        <el-table-column
            label="操作"
            width="120" align="center">
            <template slot-scope="scope">
                <el-button @click="handlerEdit(scope.row.id)" type="text" size="small">编辑</el-button>
                <el-button @click="handlerRemove(scope.row)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
        <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :page-size="limit"
            :current-page="currentPage"
            @current-change="getClassroomList">
        </el-pagination>
    </div>

<!-- 添加对话框 -->
    <el-dialog title="教室添加" :visible.sync="saveDialogFormVisible">
        <el-form ref="saveForm" :model="classroomVo" :rules="rules" inline>
            <el-form-item label="教室名字" prop="classname" label-width="80px">
                <el-input v-model="classroomVo.classname" style="width:120px" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="楼层" prop="floor" label-width="60px">
                <el-input v-model.number="classroomVo.floor" style="width:60px" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="门牌号" prop="number">
                <el-input v-model.number="classroomVo.number" style="width:80px" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="座位数" prop="seat">
                <el-input v-model.number="classroomVo.seat" style="width:60px" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="教室类型" label-width="80px" prop="typeId">
                <el-select v-model="classroomVo.typeId" placeholder="请选择">
                    <el-option v-for="(type,index) in classType" :key="index" :label="type.name" :value="type.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelSaveDisalog">取 消</el-button>
            <el-button type="primary" @click="handlerSave">确 定</el-button>
        </div>
    </el-dialog>

    
    

  </div>
</template>

<script>
import classroomApi from '@/api/classroom'

export default {
  
  data() {
    return {
        currentEditId: undefined,
        list: [],
        limit: 10,
        currentPage: 1,
        total: 0,
        classroomQuery: {},
        classType:[],
        saveDialogFormVisible: false,
        classroomVo: {},
        rules: {
            classname: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            floor: [
                {required: true, message:'请输入', trigger: 'blur'},
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
            number: [
                {required: true, message:'请输入', trigger: 'blur'},
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
            seat: [
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
        },
    }
  },
  created() {
    this.getClassroomList()
    // 查询课程type
    this.getClassroomType()
    
  },
  methods: {
    
// query
    getClassroomList(page = 1){
        this.currentPage = page
        classroomApi.listForPage(this.currentPage,this.limit,this.classroomQuery).then(response =>{
            this.list = response.data.classroomList
            this.total = response.data.total
        })
    },
    getClassroomType(){
        classroomApi.getClassroomType().then(response => {
            this.classType = response.data
        })
    },

// remove 
    handlerRemove(row){
        this.$confirm(`确定删除名字为【${row.classname}】的教室吗？`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            classroomApi.remove(row.id).then(response =>{
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getClassroomList(this.currentPage);
            })
        })
    },

//save
    showSaveDialog(){
        this.saveDialogFormVisible = true
    },
    handlerSave(){
        this.$refs['saveForm'].validate((valid) => {
            if (valid) {
                this.saveDialogFormVisible = false
                let isUpdate = this.classroomVo && this.classroomVo.id
                if(isUpdate){
                    // to update classroom
                    classroomApi.update(this.classroomVo).then(response =>{
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getClassroomList()
                        this.$refs['saveForm'].resetFields()
                        this.classroomVo = {}
                    })
                }else{
                    // to add classroom
                    classroomApi.save(this.classroomVo).then(response =>{
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.getClassroomList()
                        this.$refs['saveForm'].resetFields()
                        this.classroomVo = {}
                    })
                }
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    cancelSaveDisalog(){
        this.saveDialogFormVisible = false
        this.$refs['saveForm'].resetFields()
        this.classroomVo = {}
    },

//update
    handlerEdit(id){
        classroomApi.getOne(id).then(response =>{
            this.saveDialogFormVisible = true
            this.classroomVo = response.data
        })
    },

    clearClassroomQuery(){
        this.classroomQuery = {}
        this.$refs['form'].resetFields()
        this.getClassroomList()
    },


  }
}
</script>
