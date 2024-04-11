<template>
    <div>
        <div @click="show_detail = !show_detail" class="cursor-pointer">{{ problem_sum_score(problem_results) }}</div>

        <div v-if="show_detail" class="divider my-2">测试点详情</div>

        <div v-if="show_detail" class="grid grid-cols-2">
            <div v-for="item, index in problem_results" :key="item.ckpt.input + item.ckpt.answer" class="tooltip" :data-tip="'得分：' + item.score">
                测试点 {{ index }}：

                <span v-if="item.status == 'AC'" class="text-green-500 font-bold">AC</span>
                <span v-else-if="item.status == 'WA'" class="text-red-500 font-bold">WA</span>
                <span v-else-if="item.status == 'RE'" class="text-purple-500 font-bold">RE</span>
                <span v-else-if="item.status == 'CE'" class="text-yellow-500 font-bold">CE</span>
                <span v-else class="font-bold">{{ item.status }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { ProblemResult } from '../types/judging_result';
const props = defineProps(['problem_results'])
const problem_results = props.problem_results as ProblemResult[]
let show_detail = ref(false)

function problem_sum_score(problems_result: ProblemResult[]) {
    let sum = 0
    problems_result.forEach(ckpt => sum += ckpt.score)
    return sum
}
</script>