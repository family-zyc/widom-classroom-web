import request from '@/utils/request'


export default {

  // 保存教师
  save(teacherVo){
    return request({
      url: '/teacher/save',
      method: 'post',
      data: teacherVo
    })
  },

  update(teacherVo){
    return request({
      url: '/teacher/crud',
      method: 'put',
      data: teacherVo
    })
  },

  listForPage(page,limit){
    return request({
      url: `/teacher/list/${page}/${limit}`,
      method: 'get',
    })
  },
  list(){
    return request({
      url: `/teacher/list`,
      method: 'get',
    })
  },

  remove(id){
    return request({
      url: `/teacher/crud/${id}`,
      method: 'delete',
    })
  },

  getOne(id){
    return request({
      url: `/teacher/crud/${id}`,
      method: 'get',
    })
  }

}
