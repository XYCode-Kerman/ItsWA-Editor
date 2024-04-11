<template>
    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th>选手</th>
                <th v-for="item in Object.keys((judging_result as JudgingResult)[0].problems_result)"
                    :key="'thead_player_' + item">
                    {{ item }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="item, index in props.judging_result" :key="'player_' + item.player_order">
                <th>{{ index }}</th>
                <td>{{ item.player_order }}</td>
                <td v-for="
            prob_results in item.problems_result
            " :key="String(prob_results.map(x => x.ckpt.input))">
                    <ProblemScore :problem_results="prob_results" />
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