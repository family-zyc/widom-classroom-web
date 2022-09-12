<template>
  <div class="app-container">
      <!-- 条件栏 -->
    <el-form ref="form" :inline="true" :rules="rules" :model="classroomApplyQuery" class="demo-form-inline">
        <el-form-item label="教室" prop="classId">
            <el-select size="small" v-model="classroomApplyQuery.classId" placeholder="选择">
                <el-option v-for="(item,index) in classroomList" :key="index" :label="item.classname" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="老师" prop="teacherId">
            <el-select size="small" v-model="classroomApplyQuery.teacherId" placeholder="选择">
                <el-option v-for="(item,index) in teacherList" :key="index" :label="item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="周数" prop="week">
            <el-select size="small" v-model="classroomApplyQuery.week" placeholder="选择">
                <el-option v-for="(item,index) in scheduleWeekList" :key="index" :label="item.week" :value="item.week"></el-option>
            </el-select>
        </el-form-item>
        
        
        <el-form-item>
            <el-button type="primary" @click="handleQuery()">查询</el-button>
            <el-button type="info" @click="clearClassroomApplyQuery()">清空</el-button>
        </el-form-item>
    </el-form>

    <table border="1"  >
        <tr>
            <td></td>
            <td>星期一</td>
            <td>星期二</td>
            <td>星期三</td>
            <td>星期四</td>
            <td>星期五</td>
            <td>星期六</td>
            <td>星期天</td>
        </tr>
        <tr v-for="(arr,index) in courseArr" :key="index">
            <td>第{{index+1}}节</td>
            <td v-for="(obj,i) in arr" :key="i">
                <P v-if="obj != null && obj.classname != null">{{obj.classname}}</P>
                <P v-if="obj != null && obj.teacherName != null">{{obj.teacherName}}</P>
                <P v-if="obj != null && obj.teacherPhone != null">{{obj.teacherPhone}}</P>
            </td>
        </tr>
        
    </table>

  </div>
</template>

<script>
import classroomApi from '@/api/classroom'
import teacherApi from '@/api/teacher'
import courseApi from '@/api/course'

export default {
  
  data() {
    return {
        classroomApplyList: [],
        classroomList: [],
        teacherList: [],
        scheduleWeekList: [],
        courseArr: new Array(12),
        classroomApplyQuery: {
            classId: undefined,
            teacherId: undefined,
            week: undefined,
            handleState: undefined
        },
        rules:{
            week:[
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            classId:[
                {required: true, message:'请输入', trigger: 'blur'}
            ],
        },
    }
  },
  created() {
      this.init()
      this.getClassroomList()
        this.getTeacherList()
        this.getScheduleWeekList()
        
  },
  methods: {

    init(){
        this.classroomApplyQuery.handleState = 1;
        this.initCourseArr()
    },
// init two-dimension array to store data
    initCourseArr(){
        for(let i=0;i<this.courseArr.length;i++){
            this.courseArr[i] = new Array(7);
        }
    },
    getClassroomList(){
        classroomApi.list().then(response =>{
            this.classroomList = response.data
        })
    },
    getTeacherList(){
        teacherApi.list().then(response =>{
            this.teacherList = response.data
        })
    },
    getScheduleWeekList(){
        courseApi.scheduleWeekList().then(response =>{
            this.scheduleWeekList = response.data
        })
    },
    getClassroomApplyList(){
        // reset courseArr
        this.initCourseArr()
        classroomApi.classroomApplyListForCondition(this.classroomApplyQuery).then(response =>{
            this.classroomApplyList = response.data
            // fill array
            for(let i=0;i<this.classroomApplyList.length;i++){
                let obj = this.classroomApplyList[i]
                for(let j=obj.startPhase-1;j<obj.endPhase;j++){
                    this.courseArr[j][obj.dayOfWeek-1] = obj;
                }
            }
            // 强制更新视图和数据
            this.$forceUpdate()
        })
    },

    handleQuery(){
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.getClassroomApplyList()
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },


    clearClassroomApplyQuery(){
        this.classroomApplyQuery = {handleState: 1};
        this.$refs['form'].resetFields()
        this.initCourseArr()
        this.$forceUpdate()
    },

  }
}
</script>
