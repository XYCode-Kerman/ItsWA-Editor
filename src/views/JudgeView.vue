<template>
    <div>
        <div class="card border m-4">
            <div class="card-body">
                <h2 class="card-title">比赛 {{ ccf?.header.name }}</h2>
                <div class="grid grid-cols-4 gap-4">
                    <div>简介：{{ ccf?.header.description }}</div>
                    <div>赛制：{{ ccf?.header.contest_type }}</div>
                    <div>语言：{{ ccf?.contest.languages }}</div>
                    <div>题目数：{{ ccf?.contest.problems.length }}</div>
                    <div class="col-span-full btn" @click="start_judging">
                        开始评测
                    </div>

                    <div class="col-span-full divider">评测情况</div>

                    <div class="col-span-full">
                        <div v-if="judging_track_id == undefined && judging_result == undefined">
                            暂无评测记录。
                        </div>
                        <div v-else-if="judging_track_id != undefined && judging_result == undefined">
                            评测中。
                        </div>
                        <div v-else>
                            <ScoreTable :judging_result="judging_result" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ScoreTable from '@/components/ScoreTable.vue';
import { CCF } from '@/types/ccf';
import { JudgingResult } from '@/types/judging_result';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Ref, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const DEBUG = true
const route = useRoute();
// const router = useRouter();

const contest_path = route.query.contest_path
const ccf: Ref<CCF | undefined> = ref()
let judging_track_id: Ref<string | undefined> = ref()
let judging_result: Ref<JudgingResult | undefined> = ref()

onBeforeMount(async () => {
    ccf.value = (await axios.get(`/contest/ccf/?path=${contest_path + '/ccf.json'}`, {
        validateStatus(status) {
            if (status != 200) {
                Swal.fire({
                    title: '获取比赛信息失败',
                    html: '错误码：' + status,
                    icon: 'error'
                })
                return false
            } else return true
        },
    })).data

    if (DEBUG) {
        await start_judging()
    }
})

async function start_judging() {
    judging_track_id.value = undefined
    judging_result.value = undefined

    const resp = await axios.post(`/contest/judge/start/?contest_path=${contest_path}`, {}, {
        validateStatus(status) {
            if (status != 200) {
                Swal.fire({
                    title: '开始评测失败',
                    html: '错误码：' + status,
                    icon: 'error'
                })
                return false
            } else return true
        }
    })

    judging_track_id.value = resp.data.trackId

    let counter = 1
    const watcher = setInterval(async () => {
        const judging_result_resp = await axios.get(`/contest/judge/result/${judging_track_id.value}`, {
            validateStatus: () => true
        })

        if (judging_result_resp.status == 200) {
            // 终止定时器
            clearInterval(watcher)

            judging_result.value = judging_result_resp.data
        } else if (judging_result_resp.status != 200 && counter % 100 == 0) {
            await Swal.fire({
                title: '警告',
                html: `程序已经轮询了评测结果 ${counter} 次，仍未获得评测结果，是否继续轮询？`,
                showConfirmButton: true,
                showDenyButton: true,
                preDeny() {
                    clearInterval(watcher)
                }
            })
        }

        counter++
    }, 500)
}
</script>