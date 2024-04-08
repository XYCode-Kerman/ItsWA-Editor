<template>
    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th>选手</th>
                <th v-for="item, index in Object.keys((judging_result as JudgingResult)[0].problems_result)"
                    :key="index + '114514'">
                    {{ item }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="item, index in props.judging_result" :key="index">
                <th>{{ index }}</th>
                <td>{{ item.player_order }}</td>
                <td v-for="
            prob_result, prob_index in item.problems_result
            " :key="prob_index + '1919810'">
                    <ProblemScore :problems_result="prob_result" />
                </td>
            </tr>

            <tr v-if="is_judging">
                <td colspan="100000" class="font-bold text-center">评测中，请稍后</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { JudgingResult } from '../types/judging_result';
import ProblemScore from './ProblemScore.vue';

const props = defineProps({
    judging_result: {
        type: Object as PropType<JudgingResult>,
        required: true
    },
    is_judging: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>