<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="teacherClassroom" label-width="80px">
        <el-form-item label="教室" prop="classroomId">
            <el-select v-model="teacherClassroom.classroomId" placeholder="请选择教室">
            <el-option v-for="(item,index) in classroomList" :key="index" :label="item.classname" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="使用日期" prop="date">
            <el-date-picker
                v-model="teacherClassroom.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="开始课节" prop="startPhase">
            <el-select v-model="teacherClassroom.startPhase" @change="handlerStartPhaseChange()" placeholder="请选择教室">
                <el-option v-for="(item,index) in startSchoolSchedulePhaseList" :key="index" :label="item.phase" :value="item.phase"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="结束课节" prop="endPhase">
            <el-select v-model="teacherClassroom.endPhase" placeholder="请选择教室">
                <el-option :disabled="item.disabled" v-for="(item,index) in endSchoolSchedulePhaseList" :key="index" :label="item.phase" :value="item.phase"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="详情">
            <el-input type="textarea" v-model="teacherClassroom.detail"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handlerSubmit">申请</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import classroomApi from '@/api/classroom'
import { mapGetters } from 'vuex'
import courseApi from '@/api/course'

export default {
  
  data() {
    return {
        teacherClassroom: {
            teacherId: undefined,
            classroomId: undefined,
            date: undefined,
            startPhase: undefined,
            endPhase: undefined,
            detail: '',
        },
        classroomList:[],
        startSchoolSchedulePhaseList:[],
        endSchoolSchedulePhaseList:[],
        endPhaseDisable: true,
        pickerOptions: {
          
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        rules: {
          classroomId: [
              {required: true, message:'请输入', trigger: 'blur'}
          ],
          date: [
              {required: true, message:'请输入', trigger: 'blur'}
          ],
          startPhase: [
              {required: true, message:'请输入', trigger: 'blur'}
          ],
          endPhase: [
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
      this.getSchoolSchedulePhaseList()
  },
  methods: {

    getClassroomList(){
        classroomApi.list().then(response =>{
            this.classroomList = response.data
        })
    },

    getSchoolSchedulePhaseList(){
        courseApi.schedulePhaseList().then(response =>{
            this.startSchoolSchedulePhaseList = response.data;
            this.endSchoolSchedulePhaseList = response.data;
        })
    },
    handlerStartPhaseChange(){
        this.teacherClassroom.endPhase = undefined
        for(let i=0;i<this.startSchoolSchedulePhaseList.length;i++){
            if(i+1 <  this.teacherClassroom.startPhase){
                this.endSchoolSchedulePhaseList[i]['disabled'] = true
            }else{
                this.endSchoolSchedulePhaseList[i]['disabled'] = false
            }
        }
    },

    handlerSubmit(){
        // get userId from store
        this.teacherClassroom.teacherId = this.id;
        this.$refs['form'].validate((valid) => {
            if (valid) {
                classroomApi.saveClassroomApply(this.teacherClassroom).then(response =>{
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
    resetForm(){
        this.$refs['form'].resetFields()
        this.teacherClassroom = {}
    },


  }
}
</script>
