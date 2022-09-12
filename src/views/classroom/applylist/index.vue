<template>
  <div class="app-container">

    <!-- 条件栏 -->
    <el-form ref="form" :inline="true" :rules="rules" :model="classroomApplyQuery" class="demo-form-inline">
        <el-form-item label="教室名字">
            <el-input size="small" v-model.trim="classroomApplyQuery.classname"  placeholder="classname" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="老师名字">
            <el-input size="small" v-model.trim="classroomApplyQuery.teacherName"  placeholder="teacherName" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="日期">
            <el-date-picker
                v-model="classroomApplyQuery.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="周期" prop="week">
            <el-input size="small" v-model.number="classroomApplyQuery.week"  style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="星期" prop="dayOfWeek">
            <el-input size="small" v-model.number="classroomApplyQuery.dayOfWeek"  style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="开始课节" prop="startPhase">
            <el-input size="small" v-model.number="classroomApplyQuery.startPhase"  placeholder="start" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="结束课节" prop="endPhase">
            <el-input size="small" v-model.number="classroomApplyQuery.endPhase"  placeholder="end" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="处理状态">
            <el-select v-model="classroomApplyQuery.handleState" placeholder="选择">
                <el-option v-for="(item,index) in handlerStateList" :key="index" :label="item.state" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handlerSubmit()">查询</el-button>
            <el-button type="info" @click="clearClassroomApplyQuery()">清空</el-button>
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
            width="100"
            align="center">
        </el-table-column>
        <el-table-column
            prop="teacherName"
            label="老师姓名"
            width="60" align="center">
        </el-table-column>
        <el-table-column
            prop="date"
            label="日期"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="week"
            label="周数"
            width="40" align="center">
        </el-table-column>
        <el-table-column
            prop="dayOfWeek"
            label="星期"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="startPhase"
            label="开始课节"
            width="40" align="center">
        </el-table-column>
        <el-table-column
            prop="endPhase"
            label="结束课节"
            width="40" align="center">
        </el-table-column>
        <el-table-column
            prop="detail"
            label="详情"
            width="400" align="center">
        </el-table-column>
        <el-table-column
            prop="handleState"
            label="处理状态"
            width="80" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.handleState == 0">未处理</div>
                <div v-else-if="scope.row.handleState == 1" style="color:LawnGreen">通过</div>
                <div v-else-if="scope.row.handleState == 2" style="color:red">未通过</div>
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="120" align="center">
            <template slot-scope="scope">
                <el-button @click="handelrApplyState(scope.row,'1')" type="text" size="small">同意</el-button>
                <el-button @click="handelrApplyState(scope.row,'2')" type="text" size="small">拒绝</el-button>
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
            @current-change="getClassroomApplyList">
        </el-pagination>
    </div>

    
    

  </div>
</template>

<script>
import classroomApi from '@/api/classroom'

export default {
  
  data() {
    return {
        list: [],
        limit: 20,
        currentPage: 1,
        total: 0,
        classroomApplyQuery: {
            classname: '',
            teacherName: '',
            date: undefined,
            week: undefined,
            dayOfWeek: undefined,
            startPhase: undefined,
            endPhase: undefined,
            handleState: undefined,
        },
        classroomApplyUpdate:{
            id: undefined,
            date: undefined,
            startPhase: undefined,
            endPhase: undefined,
            handleState: undefined,
        },
        handlerStateList:[
            {id: 0,state: '未处理'},
            {id: 1,state: '通过'},
            {id: 2,state: '未通过'},
        ],
        rules:{
            week:[
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
            dayOfWeek:[
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
            startPhase:[
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
            endPhase:[
                { type: 'number', message: '请输入数字', trigger: 'blur'}
            ],
        },
    }
  },
  created() {
      this.getClassroomApplyList()
    
  },
  methods: {
    

    getClassroomApplyList(page = 1){
        this.currentPage = page
        classroomApi.classroomApplylistForConditionPage(this.currentPage,this.limit,this.classroomApplyQuery).then(response =>{
                    this.list = response.data.classroomApplyList
                    this.total = response.data.total
                })
    },

    handelrApplyState(row,stateValue){
        this.classroomApplyUpdate.id = row.id
        this.classroomApplyUpdate.date = row.date
        this.classroomApplyUpdate.startPhase = row.startPhase
        this.classroomApplyUpdate.endPhase = row.endPhase
        this.classroomApplyUpdate.handleState = stateValue
        classroomApi.updateClassroomApply(this.classroomApplyUpdate).then(response =>{
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.getClassroomApplyList()
        })
    },

    handlerSubmit(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.getClassroomApplyList()
            } else {
                this.$message({
                    message: '查询条件错误',
                    type: 'error'
                });
            }
        });
    },
    clearClassroomApplyQuery(){
        this.classroomApplyQuery = {};
        this.$refs['form'].resetFields()
        this.getClassroomApplyList()
    }



  }
}
</script>
