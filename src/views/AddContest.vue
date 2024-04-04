<template>
    <div class="p-5 grid grid-cols-2 gap-4">
        <div class="editor-box">
            <label>比赛名称</label>
            <input type="text" v-model="contest_name">
        </div>

        <div class="editor-box">
            <label>比赛目录</label>
            <input type="text" v-model="contest_path">
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
                        <ProblemEditor @delete="async () => {
                const result = await Swal.fire({
                    title: '您确定要删除该题吗？',
                    icon: 'warning',
                    showCancelButton: true
                })

                if (result.isConfirmed) {
                    problems.splice(index, 1)
                }
            }" v-model="problems[index]" />
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
        <button class="btn btn-outline btn-primary col-span-2 text-2xl" @click="submit">创建比赛</button>
    </div>
</template>

<script lang="ts" setup>
import ProblemEditor from '@/components/ProblemEditor.vue';
import { CCF, Language, Problem } from '@/types/ccf';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Ref, ref } from 'vue';
import { useRouter } from "vue-router";

const DEBUG = false

let contest_name: Ref<string> = ref('')
let contest_path: Ref<string> = ref('')
let contest_description: Ref<string> = ref('')
let contest_type: Ref<'OI' | 'IOI'> = ref('IOI')
let enable_oj: Ref<boolean> = ref(false)
let problems: Ref<Problem[]> = ref([])

const router = useRouter()

let enabled_languages: { C: boolean, CPP: boolean } = {
    C: false,
    CPP: true
}

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

    if (enabled_languages.C) {
        languages.push('C')
    }

    if (enabled_languages.CPP) {
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

    const resp = await axios.post(`/contest/?path=${ccf.header.path}`, ccf, {
        validateStatus: () => true
    })
    if (resp.status != 200) {
        Swal.fire({
            title: '提交失败',
            html: resp.statusText,
            icon: 'error'
        })
    } else {
        Swal.fire({
            title: '提交成功',
            html: `比赛已成功保存到 ${ccf.header.path}`,
            icon: 'success',
            didClose() {
                router.push('/')
            }
        })
    }
}

if (DEBUG) {
    add_problem()
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