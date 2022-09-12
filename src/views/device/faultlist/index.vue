<template>
  <div class="app-container">

    <!-- 条件栏 -->
    <el-form ref="form" :inline="true" :model="deviceFaultQuery" class="demo-form-inline">
        <el-form-item label="日期">
            <el-date-picker
                v-model="deviceFaultQuery.time"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="教室名字">
            <el-input size="small" v-model.trim="deviceFaultQuery.classroomName"  placeholder="classname" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="反馈老师">
            <el-input size="small" v-model.trim="deviceFaultQuery.feedbackTeacherName"  placeholder="classname" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="故障类型">
            <el-select v-model="deviceFaultQuery.faultType" placeholder="请选择">
                <el-option label="硬件" value="1"></el-option>
                <el-option label="软件" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="处理人员">
            <el-input size="small" v-model.trim="deviceFaultQuery.handlePersonName"  placeholder="classname" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="处理状态">
            <el-select v-model="deviceFaultQuery.handleState" placeholder="请选择">
                <el-option label="未处理" value="0"></el-option>
                <el-option label="正在处理" value="1"></el-option>
                <el-option label="已处理" value="2"></el-option>
                <el-option label="处理失败" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getDeviceFaultList()">查询</el-button>
            <el-button type="info" @click="clearDeviceFaultQuery()">清空</el-button>
        </el-form-item>

    </el-form>

    <el-table
        :data="deviceFaultList"
        border
        style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
                {{ scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column
            prop="time"
            label="提交时间"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            prop="classroomName"
            label="教室名字"
            width="100"
            align="center">
        </el-table-column>
        <el-table-column
            prop="deviceId"
            label="设备ID"
            width="200" align="center">
        </el-table-column>
        <el-table-column
            prop="deviceName"
            label="设备名字"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="feedbackTeacherName"
            label="反馈老师"
            width="80" align="center">
        </el-table-column>
        <el-table-column
            prop="faultType"
            label="故障类型"
            width="60" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.faultType == 1">硬件</div>
                <div v-else-if="scope.row.faultType == 2">软件</div>
                <div v-else>未知</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="detail"
            label="详情"
            width="300" align="center">
        </el-table-column>
        <el-table-column
            prop="handlePersonName"
            label="处理人员"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="handleTime"
            label="处理时间"
            width="200" align="center">
        </el-table-column>
        <el-table-column
            prop="handleState"
            label="处理状态"
            width="80" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.handleState == 1" style="color:LightGreen"  >正在处理</div>
                <div v-else-if="scope.row.handleState == 2" style="color:LawnGreen">已处理</div>
                <div v-else-if="scope.row.handleState == 3" style="color:red">处理失败</div>
                <div v-else>未处理</div>
            </template>
        </el-table-column>
    
        <el-table-column
            label="操作"
            width="120" align="center">
            <template slot-scope="scope">
                <el-button v-if="scope.row.handleState == 0" @click="handlerHandleState(scope.row,1)" type="text" size="small">接受</el-button>
                <el-button v-if="scope.row.handleState == 1" @click="handlerHandleState(scope.row,2)" type="text" size="small">成功</el-button>
                <el-button v-if="scope.row.handleState == 1" @click="handlerHandleState(scope.row,3)" type="text" size="small">失败</el-button>
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
            @current-change="getDeviceFaultList">
        </el-pagination>
    </div>

  </div>
</template>

<script>
import deviceApi from '@/api/device'

export default {
  
  data() {
    return {
        deviceFaultList: [],
        limit: 20,
        currentPage: 1,
        total: 0,
        deviceFaultQuery: {
            time: undefined,
            classroomName: '',
            feedbackTeacherName: '',
            faultType: undefined,
            handlePersonName: '',
            handleState: undefined,
        },

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
    this.getDeviceFaultList()
    
  },
  methods: {
    
// query
    getDeviceFaultList(page = 1){
        this.currentPage = page
        deviceApi.getListForConditionPage(this.currentPage,this.limit,this.deviceFaultQuery).then(response =>{
            this.deviceFaultList = response.data.deviceFaultList
            this.total = response.data.total
        })
    },
    
    clearDeviceFaultQuery(){
        this.deviceFaultQuery = {};
        this.$refs['form'].resetFields()
        this.getDeviceFaultList()
    },

    handlerHandleState(row,handleState){
        deviceApi.updateDeviceFaultState(row.id,handleState).then(response =>{
            this.getDeviceFaultList()
        })
    },




  }
}
</script>
