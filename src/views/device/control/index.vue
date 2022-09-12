<template>
  <div class="app-container">
    <el-form :inline="true" :model="deviceQuery" class="demo-form-inline">
        <el-form-item label="教室">
            <el-select v-model="deviceQuery.classroomId" @change="classroomChange()" placeholder="教室">
                <el-option v-for="(item,index) in classroomList" :key="index" :label="item.classname" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备">
            <el-select v-model="deviceQuery.deviceId" placeholder="设备">
                <el-option v-for="(item,index) in deviceList" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleQueryDevice" >切换</el-button>
        </el-form-item>
    </el-form>


    <div v-if="deviceState.disable">
        故障
    </div>
    <div v-else>
        <el-descriptions title="设备状态">
            <el-descriptions-item label="当前状态">
                <el-tooltip :content="'Switch value: ' + deviceState.currentState" placement="top">
                    <el-switch
                        @change="handleTurnoffClick($event)"
                        v-model="deviceState.currentState"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        active-text="on"
                        inactive-value="0"
                        inactive-text="off">
                    </el-switch>
                </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item label="设备ID">{{deviceState.deviceId}}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{deviceState.deviceTypeName}}</el-descriptions-item>
            <el-descriptions-item label="开启时间">{{deviceState.startupTime}}</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{deviceState.runTime}}</el-descriptions-item>
            <el-descriptions-item label="风速">
                <el-radio-group v-model="deviceState.windSpeed" @change="windSpeedChange($event)">
                    <el-radio :disabled="volumeDisable" label="slow">慢</el-radio>
                    <el-radio :disabled="volumeDisable" label="mid">中</el-radio>
                    <el-radio :disabled="volumeDisable" label="quick">快</el-radio>
                </el-radio-group>
            </el-descriptions-item>
        </el-descriptions>
        音量：
        <el-slider 
            :disabled="volumeDisable"
            vertical
            height="100px"
            v-model="deviceState.volume"
            @change="volumeChange($event)"
            >
        </el-slider>

    </div>

  </div>
</template>

<script>

import classroomApi from '@/api/classroom'
import deviceApi from '@/api/device'

export default {
  
  data() {
    return {
        deviceQuery: {
            classroomId: undefined,
            deviceId: undefined,
        },
        classroomList: [],
        deviceList: [],
        deviceState:{
            deviceId: '',
            deviceName: '',
            deviceImage: '',
            deviceTypeName: '',
            disable: undefined,
            startupTime: '',
            runTime: '',
            volume: undefined,
            windSpeed: undefined,
            currentState: '0',
        },
        windSpeedDisable: false,
        volumeDisable: false,
        preWindSpeed: undefined,
        preVolumeValue: undefined,
        runTimeInterval: undefined,
        
    }
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
        this.deviceQuery.deviceId = undefined
        this.getDeviceList()
    },
    getDeviceList(){
        deviceApi.getlistByClassroomId(this.deviceQuery.classroomId).then(response =>{
            this.deviceList = response.data
        })
    },
    handleQueryDevice(){
        deviceApi.getDeviceByDeviceId(this.deviceQuery.deviceId).then(response =>{
            // console.log(response.data)
            // 清除计算运行时长定时器
            this.clearRunTimeInterval()
            this.deviceState = response.data
            // 记录音量，风速的值
            this.preVolumeValue = this.deviceState.volume
            this.preWindSpeed = this.deviceState.windSpeed
            // 将数字转化为字符串
            this.deviceState.currentState += ''
            if(this.deviceState.startupTime != null){
                // 开启定时，展示运行时长
                this.runTimeInterval = setInterval(this.calcRunTime,1000)
            }
        })
    },


    handleTurnoffClick($event){
        let onOff = $event;
        // Todo:开关逻辑
        deviceApi.updateDeviceCurrentState(this.deviceState.deviceId,onOff).then(response =>{
            if(onOff == 1){
                // deal with button display
                this.windSpeedDisable = false
                this.volumeDisable = false
                this.handleQueryDevice()
            }else{
                // deal with button display
                this.windSpeedDisable = true
                this.volumeDisable = true
                // clear timed task
                this.clearRunTimeInterval()
            }
            console.log("模拟的设备数据:")
            console.log(response.data)
        }).catch(response =>{
            this.deviceState.currentState = (this.deviceState.currentState == '0'?'1':'0')
        })
    },
    volumeChange($event){
        // Todo:音量改变逻辑
        deviceApi.updateDeviceVolume(this.deviceState.deviceId, $event).then(response => {
            console.log("模拟的设备数据:")
            console.log(response.data)
        }).catch(response =>{
            this.deviceState.volume = this.preVolumeValue
        })
    },
    windSpeedChange($event){
        // Todo:风速改变逻辑
        deviceApi.updateDeviceWindSpeed(this.deviceState.deviceId, $event).then(response =>{

            console.log("模拟的设备数据:")
            console.log(response.data)
        }).catch(response =>{
            this.deviceState.windSpeed = this.preWindSpeed
        })
    },

    // 计算现在时间和设备开始运行时间的差值
    calcRunTime(){
        let startupTimeDate = new Date(this.deviceState.startupTime)
        let now = new Date()
        let timestamp = now - startupTimeDate
        // 天
        var days=Math.floor(timestamp/(24*3600*1000))
        // 小时
        var leave1=timestamp%(24*3600*1000)
        var hours=Math.floor(leave1/(3600*1000))
        // 分钟
        var leave2=leave1%(3600*1000)
        var minutes=Math.floor(leave2/(60*1000))
        // 秒
        var leave3=leave2%(60*1000)
        var seconds=Math.round(leave3/1000)
        let result=  days + "天" + hours + ":" + minutes + ":" + seconds
        this.deviceState.runTime = result
        this.$forceUpdate()
    },
    clearRunTimeInterval(){
        if(this.runTimeInterval != null && this.runTimeInterval != undefined){
            clearInterval(this.runTimeInterval)
        }
    },


    

  }
}
</script>
