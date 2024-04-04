<template>
    <div class="p-5 grid grid-cols-2 gap-4">
        <div class="editor-box">
            <label>比赛名称</label>
            <input type="text" v-model="contest_name">
        </div>

        <div class="editor-box">
            <label>比赛目录</label>
            <input type="text" disabled v-model="contest_path">
        </div>

        <div class="editor-box col-span-2">
            <label>比赛描述</label>
            <textarea v-model="contest_description"></textarea>
        </div>

        <div class="editor-box col-span-2">
            <label class="w-24">支持语言</label>
            <table class="table text-center table-sm">
                <thead>
                    <tr>
                        <th>语言</th>
                        <th>是否启用</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>CPP</td>
                        <td>
                            <input type="checkbox" class="checkbox checkbox-sm" v-model="enabled_languages.CPP">
                        </td>
                    </tr>

                    <tr>
                        <td>C</td>
                        <td>
                            <input type="checkbox" class="checkbox checkbox-sm" v-model="enabled_languages.C">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 题目编辑器 -->
        <div class="editor-box col-span-2">
            <label>题目</label>
            <div class="w-full collapse collapse-arrow flex flex-col join join-vertical">
                <!-- 题目列表 -->
                <div v-for="item, index in problems" :key="index" class="collapse bg-base-100 border join-item">
                    <input type="checkbox" />

                    <div class="collapse-title text-xl font-bold">
                        {{ item.name }}
                    </div>

                    <div class="collapse-content">
                        <ProblemEditor v-model="problems[index]" />
                    </div>
                </div>

                <!-- 新增题目 -->
                <button @click="add_problem"
                    class="collapse w-full py-2 px-4 bg-base-200 join-item cursor-pointer font-bold text-2xl">
                    新增题目
                </button>
            </div>
        </div>

        <!-- 提交 -->
        <button class="btn btn-outline btn-primary col-span-2 text-2xl" @click="submit">保存比赛</button>
    </div>
</template>

<script lang="ts" setup>
import ProblemEditor from '@/components/ProblemEditor.vue';
import { CCF, Language, Problem } from '@/types/ccf';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Ref, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()
let contest_name: Ref<string> = ref('')
let contest_path: Ref<string> = ref('')
let contest_description: Ref<string> = ref('')
let contest_type: Ref<'OI' | 'IOI'> = ref('OI')
let enable_oj: Ref<boolean> = ref(false)
let problems: Ref<Problem[]> = ref([])
let enabled_languages: Ref<{ C: boolean, CPP: boolean }> = ref({
    C: false,
    CPP: true
})

onBeforeMount(async () => {
    const resp = await axios.get(`/contest/ccf/?path=${route.query.ccf_file}`, {
        validateStatus(status) {
            if (status != 200) {
                Swal.fire({
                    title: '获取CCF文件失败',
                    html: `错误码：${status}`
                })

                return false
            } else {
                return true
            }
        }
    })

    const ccf: CCF = resp.data

    contest_name.value = ccf.header.name
    contest_path.value = ccf.header.path
    contest_description.value = ccf.header.description
    contest_type.value = ccf.header.contest_type
    enable_oj.value = ccf.header.enable_oj
    problems.value = ccf.contest.problems
})

function add_problem() {
    problems.value.push({
        name: '新增题目',
        background: '',
        description: '',
        input_format: '',
        output_format: '',
        judge_config: {
            source_file_name: '',
            languages: ['CPP'],
            checkpoints: []
        }
    })
}

async function submit() {
    let languages: Language[] = []

    if (enabled_languages.value.C) {
        languages.push('C')
    }

    if (enabled_languages.value.CPP) {
        languages.push('CPP')
    }

    let ccf: CCF = {
        header: {
            name: contest_name.value,
            path: contest_path.value,
            description: contest_description.value,
            contest_type: contest_type.value,
            enable_oj: enable_oj.value
        },
        contest: {
            problems: problems.value,
            languages: languages
        }
    }

    await axios.put(`/contest/ccf/?path=${route.query.ccf_file}`, ccf, {
        validateStatus(status) {
            if (status != 200) {
                Swal.fire('保存失败', `错误码：${status}`, 'error')
                return false
            } else {
                return true
            }
        }
    })

    await Swal.fire('保存成功', '', 'success')
    router.go(0)
}
</script>

<style scoped>
.editor-box {
    @apply flex items-center gap-4;
}

.editor-box label {
    @apply text-xl font-bold;
}

.editor-box textarea {
    @apply textarea textarea-bordered grow;
}

.editor-box input[type='text'] {
    @apply input input-bordered grow;
}
</style>