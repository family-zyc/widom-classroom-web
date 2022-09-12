<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="teacher" label-width="80px" >
        <el-form-item label="帐号" prop="username">
            <el-input v-model="teacher.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="teacher.password" placeholder="password"></el-input>
        </el-form-item>
        
        <el-form-item label="管理权限" prop="rule">
            <el-radio-group v-model="teacher.rule">
                <el-radio :label="1">普通用户</el-radio>
                <el-radio :label="2">管理员</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="name" >
            <el-input v-model="teacher.name" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="teacher.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
            <el-input v-model.number="teacher.age" placeholder="age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
            <el-input v-model="teacher.telephone" placeholder="telephone"></el-input>
        </el-form-item>
        
        <el-form-item>
            <el-button type="primary" @click="saveOrUpdate('form')">保存</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  
  data() {
    return {
        teacher:{
            id: undefined,
            username: '',
            password: '',
            avatar: undefined,
            rule: undefined,
            name: '',
            gender: undefined,
            age: '',
            telephone: ''
        },
        rules: {
            username: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            password: [
                {required: true, message:'请输入密码', trigger: 'blur'},
                { min: 6, message: '最少6个字符', trigger: 'blur' }
            ],
            rule:[
                {required: true, message:'请选择一个', trigger: 'change'}
            ],
            name: [
                {required: true, message:'请输入', trigger: 'blur'}
            ],
            gender:[
                {required: true, message:'请选择性别', trigger: 'change'}
            ],
            age: [
                { type: 'number', message: '年龄必须为数字值', trigger: 'blur'}
            ],
            telephone: [
                {pattern: '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', message:'请输入正确的手机号', trigger: 'blur'}
            ]
        },
        isUpdate: false
    }
  },
  created() {
    this.isUpdate = this.$route.params && this.$route.params.id
    if(this.isUpdate){
        this.getOne(this.$route.params.id)
    }

  },
  methods: {
    saveOrUpdate(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.isUpdate){
                    this.update();
                }else{
                    this.save()
                }
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    save(){
        teacherApi.save(this.teacher).then(response => {
            this.$message({
                message: '保存成功',
                type: 'success'
            });
            this.$router.push({path: '/teacher/list'})
        })
    },
    update(){
        teacherApi.update(this.teacher).then(response => {
            this.$message({
                message: '更新成功',
                type: 'success'
            });
            this.$router.push({path: '/teacher/list'})
        })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    getOne(id){
        teacherApi.getOne(id).then(response => {
            this.teacher = response.data
        })
    }

  }
}
</script>
