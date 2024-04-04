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
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item, index in problem.judge_config.checkpoints" :key="index">
                        <th>{{ index }}</th>
                        <td><textarea class="h-16" type="text" v-model="item.input"></textarea></td>
                        <td><textarea class="h-16" type="text" v-model="item.answer"></textarea></td>

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
                    </tr>
                </tbody>
            </table>

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
        </div>
    </div>
</template>

<script setup lang="ts">
import { Problem } from '@/types/ccf';
import { defineModel, ModelRef } from 'vue';

const problem: ModelRef<Problem> = defineModel({ required: true })
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

.editor-box label.sm {
    @apply text-base max-w-12;
}

.editor-box label {
    @apply text-lg max-w-12;
}

.editor-box input[type='text'] {
    @apply input input-bordered grow h-full;
}

.editor-box textarea {
    @apply textarea textarea-bordered grow
}
</style>