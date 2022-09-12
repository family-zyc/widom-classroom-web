<template>
  <div class="app-container">
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
            prop="username"
            label="用户名"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            label="权限"
            width="120" align="center">
            <template slot-scope="scope">
                {{scope.row.rule === 1?'普通用户':'管理员'}}
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="120" align="center">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="60" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.gender == 0">未知</div>
                <div v-else-if="scope.row.gender == 1">男</div>
                <div v-else>女</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="age"
            label="年龄"
            width="60" align="center">
        </el-table-column>
        <el-table-column
            prop="telephone"
            label="电话"
            width="120" align="center">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120" align="center">
            <template slot-scope="scope">
                <el-button @click="handlerEdit(scope.row.id)" type="text" size="small">编辑</el-button>
                <el-button @click="handlerRemove(scope.row)" type="text" size="small">删除</el-button>
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
            @current-change="getTeacherList">
        </el-pagination>
    </div>

    

  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  
  data() {
    return {
        currentEditId: undefined,
        list: [],
        limit: 10,
        currentPage: 1,
        total: 0,
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    
    // query
    getTeacherList(page = 1){
        this.currentPage = page
        teacherApi.listForPage(this.currentPage,this.limit).then(response =>{
            this.list = response.data.teacherList
            this.total = response.data.total
        })
    },
    // remove 
    handlerRemove(row){
        this.$confirm(`确定删除名字为【${row.name}】的用户吗？`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            teacherApi.remove(row.id).then(response =>{
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getTeacherList(this.currentPage);
            })
        })
    },

    handlerEdit(id){
        this.$router.push({path:`/teacher/save/${id}`})
    }

  }
}
</script>
