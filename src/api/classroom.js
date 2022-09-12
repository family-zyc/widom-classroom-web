import request from '@/utils/request'

export default {
    listForPage(page,limit,classroomQuery){
        return request({
            url: `/classroom/list/${page}/${limit}`,
            method: 'get',
            params: classroomQuery
        })
    },
    list(){
        return request({
            url: `/classroom/list`,
            method: 'get',
        })
    },

    getClassroomType(){
        return request({
            url: `/classroom/type`,
            method: 'get',
        })
    },
    remove(id){
        return request({
            url: `/classroom/crud/${id}`,
            method: 'delete',
        })
    },
    save(classroomVo){
        return request({
            url: `/classroom/crud`,
            method: 'post',
            data: classroomVo
        })
    },
    getOne(id){
        return request({
            url: `/classroom/crud/${id}`,
            method: 'get',
        })
    },
    update(classroomVo){
        return request({
            url: `/classroom/crud`,
            method: 'put',
            data: classroomVo
        })
    },



//teacher-classroom-apply
    saveClassroomApply(teacherClassroom){
        return request({
            url: `/teacher-classroom/crud`,
            method: 'post',
            data: teacherClassroom
        })
    },
    classroomApplylistForConditionPage(currentPage,limit,classroomApplyQuery){
        return request({
            url: `/teacher-classroom/crud/${currentPage}/${limit}`,
            method: 'get',
            params: classroomApplyQuery
        })
    },
    updateClassroomApply(classroomApplyUpdate){
        return request({
            url: `/teacher-classroom/crud/state`,
            method: 'put',
            data: classroomApplyUpdate
        })
    },
    classroomApplyListForCondition(classroomApplyQuery){
        return request({
            url: `/teacher-classroom/crud`,
            method: 'get',
            params: classroomApplyQuery
        })
    }





}