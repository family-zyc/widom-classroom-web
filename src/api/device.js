import request from '@/utils/request'

export default {

    getlistByClassroomId(classroomId){
        return request({
            url: `/device/crud/${classroomId}`,
            method: 'get',
        })
    },
    saveDevice(device){
        return request({
            url: `/device/crud`,
            method: 'post',
            data: device
        }) 
    },
    getDeviceVoListForConditionPage(currentPage,limit,deviceVoQuery){
        return request({
            url: `/device/crud/${currentPage}/${limit}`,
            method: 'get',
            params: deviceVoQuery
        })
    },
    removeByDeviceId(deviceId){
        return request({
            url: `/device/crud/${deviceId}`,
            method: 'delete',
        })
    },
    getDeviceByDeviceId(deviceId){
        return request({
            url: `/device/crud/deviceId/${deviceId}`,
            method: 'get',
        })
    },
    updateDeviceCurrentState(deviceId,onOff){
        return request({
            url: `/device/condition/deviceId/field/current/state`,
            method: 'put',
            data:{
                deviceId: deviceId,
                currentState: onOff
            }
        })
    },
    updateDeviceVolume(deviceId, volume){
        return request({
            url: `/device/condition/deviceId/field/volume`,
            method: 'put',
            data:{
                deviceId: deviceId,
                volume: volume
            }
        })
    },
    updateDeviceWindSpeed(deviceId, windSpeed){
        return request({
            url: `/device/condition/deviceId/field/windSpeed`,
            method: 'put',
            data:{
                deviceId: deviceId,
                windSpeed: windSpeed
            }
        })
    },
    
//device-fault
    saveDeviceFault(deviceFault){
        return request({
            url: `/device-fault/crud`,
            method: 'post',
            data: deviceFault
        }) 
    },
    getListForConditionPage(currentPage,limit,deviceFaultQuery){
        return request({
            url: `/device-fault/crud/${currentPage}/${limit}`,
            method: 'get',
            params: deviceFaultQuery
        })
    },
    updateDeviceFaultState(id,handleState){
        return request({
            url: `/device-fault/crud/${id}/${handleState}`,
            method: 'put',
        })
    },

//device-type
    getDeviceTypeList(){
        return request({
            url: `/device-type/crud`,
            method: 'get',
        })
    },


}