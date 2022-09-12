<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="device" label-width="80px" >
        <el-form-item label="设备ID" prop="deviceId" >
            <el-input v-model="device.deviceId" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="设备名字" prop="deviceName" >
            <el-input v-model="device.deviceName" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="教室" prop="classroomId">
            <el-select v-model="device.classroomId" placeholder="请选择教室">
                <el-option v-for="(item,index) in classroomList" :key="index" :label="item.classname" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="购入时间" prop="buyDate">
            <el-date-picker
                v-model="device.buyDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="device.deviceType" placeholder="请选择">
                <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.deviceType" :value="item.id"></el-option>
            </el-select>
        </el-form-item>



        
        <el-form-item>
            <el-button type="primary" @click="handleSubmit()">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import classroomApi from '@/api/classroom'
import deviceApi from '@/api/device'

export default {
  
  data() {
    return {
        device: {
            deviceId: '',
            deviceName: '',
            deviceImage: undefined,
            classroomId: undefined,
            buyDate: undefined,
            deviceType: undefined,

        },
        classroomList: [],
        deviceTypeList: [],
        rules: {
            classroomId: [
                {required: true, message:'请选择', trigger: 'blur'}
            ],
            deviceId: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            deviceName: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            buyDate: [
                {required: true, message:'请选择', trigger: 'blur'}
            ],
            deviceType: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
        },
    }
  },
  created() {
    this.getClassroomList()
    this.getDeviceTypeList()
  },
  methods: {
    getClassroomList(){
        classroomApi.list().then(response =>{
            this.classroomList = response.data
        })
    },
    getDeviceTypeList(){
        deviceApi.getDeviceTypeList().then(response => {
            this.deviceTypeList = response.data
        })
    },


    handleSubmit(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                deviceApi.saveDevice(this.device).then(response =>{
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.$router.push({path:'/device/list'})
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields()
    },
    

  }
}
</script>
