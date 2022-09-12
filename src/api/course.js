import request from '@/utils/request'

export default {

    schedulePhaseList(){
        return request({
            url: `/school-schedule-phase/list`,
            method: 'get',
        })
    },

    scheduleWeekList(){
        return request({
            url: `/school-schedule-week/list`,
            method: 'get',
        })
    }

}