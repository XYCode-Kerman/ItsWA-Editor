<template>
    <div>
        <div class="grid grid-cols-2 my-2 gap-4">
            <!-- 题目配置 -->
            <div class="divider col-span-2">题目配置</div>

            <div class="editor-box">
                <label for="">题目名称</label>
                <input type="text" v-model="problem.name">
            </div>

            <div class="editor-box">
                <label for="">题目背景</label>
                <textarea v-model="problem.background"></textarea>
            </div>

            <div class="editor-box col-span-2">
                <label for="">题目描述</label>
                <textarea v-model="problem.description"></textarea>
            </div>

            <div class="editor-box">
                <label for="">输入格式</label>
                <textarea type="text" v-model="problem.input_format"></textarea>
            </div>

            <div class="editor-box">
                <label for="">输出格式</label>
                <textarea type="text" v-model="problem.output_format"></textarea>
            </div>

            <button @click="$emit('delete')" class="col-span-2 btn btn-outline btn-error text-2xl">
                删除题目
            </button>

            <!-- 评测姬配置 -->
            <div class="divider col-span-2">评测姬配置</div>

            <!-- 源文件名称 -->
            <div class="editor-box">
                <label class="sm" for="">源文件名称</label>
                <input type="text" v-model="problem.judge_config.source_file_name">
            </div>

            <!-- 源文件名称配置效果 -->
            <div class="join join-horizontal flex items-center">
                <!-- 合法示例 -->
                <div class="grow h-full flex items-center justify-center bg-success p-2 rounded-lg join-item tooltip"
                    data-tip="合法源文件地址示例">
                    选手文件夹/{{ problem.judge_config.source_file_name }}/{{ problem.judge_config.source_file_name }}.cpp
                </div>

                <!-- 非法示例 -->
                <div class="grow text-sm h-full flex items-center justify-center bg-error p-2 rounded-lg join-item tooltip"
                    data-tip="非法源文件地址示例">
                    <p>选手文件夹/{{ problem.judge_config.source_file_name }}/bar.cpp</p>
                    <p>选手文件夹/foo/{{ problem.judge_config.source_file_name }}.cpp</p>
                </div>
            </div>

            <!-- 测试点 -->
            <div class="divider col-span-2">测试点配置</div>


            <table class="col-span-2 table table-sm overflow-x-scroll">
                <thead>
                    <tr>
                        <th></th>
                        <th>输入</th>
                        <th>答案</th>
                        <th>输入方式</th>
                        <th>输出方式</th>
                        <th>输入文件</th>
                        <th>输出文件</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item, index in problem.judge_config.checkpoints" :key="index">
                        <th>{{ index }}</th>
                        <td><textarea class="h-16 textarea textarea-bordered" type="text" v-model="item.input"></textarea></td>
                        <td><textarea class="h-16 textarea textarea-bordered" type="text" v-model="item.answer"></textarea></td>

                        <!-- 输入输出方式 -->
                        <td>
                            <select name="" id="" v-model="item.input_type">
                                <option value="STDIN">STDIN</option>
                                <option value="FILE">文件</option>
                            </select>
                        </td>

                        <td>
                            <select name="" id="" v-model="item.output_type">
                                <option value="STDOUT">STDOUT</option>
                                <option value="FILE">文件</option>
                            </select>
                        </td>

                        <!-- 输入输出文件 -->
                        <td v-if="item.input_type == 'FILE'"><input type="text" class="input w-32"
                                v-model="item.input_file" /></td>
                        <td v-else class="cursor-not-allowed text-error font-bold">不可修改</td>
                        <td v-if="item.output_type == 'FILE'"><input type="text" class="input w-32"
                                v-model="item.output_file" /></td>
                        <td v-else class="cursor-not-allowed text-error font-bold">不可修改</td>

                        <!-- 删除 -->
                        <td>
                            <button @click="() => {
                    problem.judge_config.checkpoints.splice(index, 1)
                }" class="btn btn-warning btn-sm">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 新增测试点按钮 -->
            <div @click="() => {
                    problem.judge_config.checkpoints.push({
                        input: '',
                        answer: '',
                        input_type: 'STDIN',
                        output_type: 'STDOUT',
                        input_file: '',
                        output_file: ''
                    })
                }" class="btn btn-outline text-2xl col-span-2">
                新增测试点
            </div>

            <!-- 从文件导入测试点 -->
            <div class="divider col-span-2 cursor-pointer" @click="toggle_load_checkpoints_from_files = !toggle_load_checkpoints_from_files">
                从文件导入测试点</div>
            <div v-if="toggle_load_checkpoints_from_files" class="w-full">
                <!-- 测试点输入 -->
                <input class="file-input" type="file" v-on:change="e => {
                    const files = (e.target as HTMLInputElement).files
                    checkpoints_files = []
                    
                    if (files != null) {
                        for (let index = 0; index < files.length; index++) {
                            const element = files?.item(index);
                            if (element != null) {
                                checkpoints_files.push(element)
                            }
                        }   
                    }
                }" multiple>

                <div class="my-2"></div>

                <!-- 测试点匹配器 -->
                <div class="flex flex-col">
                    <!-- 测试点列表 -->
                    <div class="grid grid-cols-2">
                        <div v-for="item in ckpt_file_groups" :key="item[0].name + item[1].name">
                            <div class="p-2 border flex flex-row">
                                <!-- <p>输入文件：{{ item[0] }}</p> -->
                                <!-- <p>输出文件：{{ item[1] }}</p> -->

                                <span>{{ item[0].name }}</span>

                                <div class="flex-grow"></div>

                                <span>{{ item[1].name }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 测试点匹配规则 -->
                    <div class="grid grid-cols-2 gap-2 form-control min-w-full">
                        <div>
                            <div class="label">
                                <span class="label-text">输入文件后缀名</span>
                            </div>
                            <input type="text" class="input input-bordered input-sm w-full" v-model="ckpt_input_suffix">
                        </div>

                        <div>
                            <div class="label">
                                <span class="label-text">答案文件后缀名</span>
                            </div>
                            <input type="text" class="input input-bordered input-sm w-full" v-model="ckpt_answer_suffix">
                        </div>
                    </div>
                </div>
            </div>

            <div @click="load_from_file" class="btn btn-outline text-2xl col-span-2">
                从文件导入测试点
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Problem } from '@/types/ccf';
import { computed, defineModel, ModelRef, Ref, ref } from 'vue';

const problem: ModelRef<Problem> = defineModel({ required: true })
let toggle_load_checkpoints_from_files: Ref<boolean> = ref(true)
let checkpoints_files: Ref<File[]> = ref([])

let ckpt_input_suffix: Ref<string> = ref('in')
let ckpt_answer_suffix: Ref<string> = ref('out')

let ckpt_file_groups = computed(() => {
    const ckpt_file_names: File[] = checkpoints_files.value
    const input_files: File[] = []
    const answer_files: File[] = []

    ckpt_file_names.forEach(x => {
        if (x.name.endsWith(ckpt_input_suffix.value)) {
            input_files.push(x)
        } else if(x.name.endsWith(ckpt_answer_suffix.value)) {
            answer_files.push(x)
        }
    })

    input_files.sort(x => x.name.search(/[0-9]/))
    answer_files.sort(x => x.name.search(/[0-9]/))

    const result: File[][] = []
    input_files.forEach((x, i) => {
        result.push([x, answer_files[i]])
    })

    return result
})

function load_from_file() {
    ckpt_file_groups.value.forEach(async x => {
        let input: string = (await x[0].text()).trim()
        let answer: string = (await x[1].text()).trim()

        problem.value.judge_config.checkpoints.push({
            input: input,
            answer: answer,
            input_type: 'STDIN',
            output_type: 'STDOUT',
            input_file: '',
            output_file: ''
        })
    })
}
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProblemEditor'
})
</script>

<style scoped>
.editor-box {
    @apply gap-2 flex items-center min-h-14;
}

.editor-box > label.sm {
    @apply text-base max-w-12;
}

.editor-box > label {
    @apply text-lg max-w-12;
}

.editor-box > input[type='text'] {
    @apply input input-bordered grow h-full;
}

.editor-box > textarea {
    @apply textarea textarea-bordered grow
}
</style>