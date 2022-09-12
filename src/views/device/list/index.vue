<template>
  <div class="app-container">

    <!-- 条件栏 -->
    <el-form ref="form" :inline="true" :rules="rules" :model="deviceVoQuery" class="demo-form-inline">
        <el-form-item label="设备ID">
            <el-input size="small" v-model.trim="deviceVoQuery.deviceId"  placeholder="classname" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
            <el-input size="small" v-model.trim="deviceVoQuery.deviceName"  placeholder="teacherName" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="教室名字">
            <el-input size="small" v-model.trim="deviceVoQuery.classroomName"  placeholder="teacherName" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="日期">
            <el-date-picker
                v-model="deviceVoQuery.buyDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="维修次数>">
            <el-input size="small" v-model.number="deviceVoQuery.fixSize"  placeholder="teacherName" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="deviceVoQuery.deviceType" placeholder="请选择">
                <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.deviceType" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="是否可用" prop="deviceType">
            <el-select v-model="deviceVoQuery.disable" placeholder="请选择">
                <el-option label="可用" value="false"></el-option>
                <el-option label="不可用" value="true"></el-option>
            </el-select>
        </el-form-item>

        
        <el-form-item>
            <el-button type="primary" @click="handlerSubmit()">查询</el-button>
            <el-button type="info" @click="clearClassroomApplyQuery()">清空</el-button>
        </el-form-item>
    </el-form>

    <el-table
        :data="deviceVoList"
        border
        style="width: 100%">
        <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
                {{ scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column
            prop="deviceId"
            label="设备ID"
            width="140"
            align="center">
        </el-table-column>
        <el-table-column
            prop="deviceName"
            label="设备名字"
            width="140" align="center">
        </el-table-column>
        <el-table-column
            prop="deviceImage"
            label="设备图片地址"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="classroomName"
            label="教室名字"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="buyDate"
            label="购入时间"
            width="100" align="center">
        </el-table-column>
        <el-table-column
            prop="fixSize"
            label="维修次数"
            width="40" align="center">
        </el-table-column>
        <el-table-column
            prop="deviceTypeName"
            label="设备类型"
            width="80" align="center">
        </el-table-column>
        <el-table-column
            prop="disable"
            label="是否可用"
            width="80" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.disable">不可用</div>
                <div v-if="!scope.row.disable">可用</div>
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="120" align="center">
            <template slot-scope="scope">
                <el-button @click="handleRemove(scope.row.deviceId)" type="text" size="small">删除</el-button>
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
            @current-change="getDeviceVoListForConditionPage">
        </el-pagination>
    </div>

    
    

  </div>
</template>

<script>
import deviceApi from '@/api/device'

export default {
  
  data() {
    return {
        deviceVoList: [],
        limit: 10,
        currentPage: 1,
        total: 0,
        deviceVoQuery: {
            deviceId: '',
            deviceName: '',
            classroomName: '',
            buyDate: undefined,
            fixSize: undefined,
            deviceType: undefined,
            disable: undefined,
        },
        deviceTypeList: [],


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
      this.getDeviceTypeList()
    this.getDeviceVoListForConditionPage()
    
  },
  methods: {
    getDeviceVoListForConditionPage(page = 1){
        this.currentPage = page
        deviceApi.getDeviceVoListForConditionPage(this.currentPage,this.limit,this.deviceVoQuery).then(response =>{
            this.deviceVoList = response.data.deviceVoList
            this.total = response.data.total
        })
    },
    getDeviceTypeList(){
        deviceApi.getDeviceTypeList().then(response => {
            this.deviceTypeList = response.data
        })
    },




    handlerSubmit(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.getDeviceVoListForConditionPage()
            } else {
                this.$message({
                    message: '查询条件错误',
                    type: 'error'
                });
            }
        });
    },
    clearClassroomApplyQuery(){
        this.deviceVoQuery = {};
        this.$refs['form'].resetFields()
        this.getDeviceVoListForConditionPage()
    },
    handleRemove(deviceId){
        deviceApi.removeByDeviceId(deviceId).then(response =>{
            this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            this.getDeviceVoListForConditionPage()
        })
    },


  }
}
</script>
