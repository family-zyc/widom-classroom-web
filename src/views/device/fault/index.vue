<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="deviceFault" label-width="80px" >
        <el-form-item label="教室" prop="classroomId">
            <el-select v-model="deviceFault.classroomId" @change="classroomChange()" placeholder="请选择教室">
                <el-option v-for="(item,index) in classroomList" :key="index" :label="item.classname" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="deviceId">
            <el-select v-model="deviceFault.deviceId" placeholder="请选择设备">
                <el-option v-for="(item,index) in deviceList" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="故障类型" prop="faultType">
            <el-select v-model="deviceFault.faultType" placeholder="请选择">
                <el-option label="硬件" value="1"></el-option>
                <el-option label="软件" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="详情">
            <el-input type="textarea" v-model="deviceFault.detail"></el-input>
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
import { mapGetters } from 'vuex'
// 定义时间格式化
    Date.prototype.format = function(fmt) { 
        var o = { 
            "M+" : this.getMonth()+1,                 //月份 
            "d+" : this.getDate(),                    //日 
            "h+" : this.getHours(),                   //小时 
            "m+" : this.getMinutes(),                 //分 
            "s+" : this.getSeconds(),                 //秒 
            "q+" : Math.floor((this.getMonth()+3)/3), //季度 
            "S"  : this.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    }

export default {
  
  data() {
    return {
        deviceFault: {
            time: new Date().format("yyyy-MM-dd hh:mm:ss"),
            classroomId: undefined,
            deviceId: '',
            feedbackTeacherId: undefined,
            faultType: undefined,
            detail: '',
        },
        classroomList: [],
        deviceList: [],
        rules: {
            classroomId: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            deviceId: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            faultType: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
        },
    }
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  created() {
    this.getClassroomList()

  },
  methods: {
    getClassroomList(){
        classroomApi.list().then(response =>{
            this.classroomList = response.data
        })
    },
    classroomChange(){
        this.getDeviceList()
    },
    getDeviceList(){
        deviceApi.getlistByClassroomId(this.deviceFault.classroomId).then(response =>{
            this.deviceList = response.data
        })
    },

    handleSubmit(){
        this.deviceFault.feedbackTeacherId = this.id
        this.$refs['form'].validate((valid) => {
            if (valid) {
                deviceApi.saveDeviceFault(this.deviceFault).then(response =>{
                    this.$message({
                        type: 'success',
                        message: '申请成功，等待审核!'
                    });
                    this.$router.push({path:'/common/classroom/state'})
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
