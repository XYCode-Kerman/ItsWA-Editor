<template>
    <div class="grid grid-cols-2 gap-4 m-4">
        <div v-for="contest, index in contests" :key="index">
            <div class="card h-48 bg-base-100 border border-base-300">
                <div class="card-body">
                    <h2 class="card-title">比赛： {{ contest.name }}</h2>
                    <p>{{ contest.description }}</p>

                    <div class="card-actions justify-end">
                        <RouterLink :to="'/editor?ccf_file=' + contest.ccf_file + '/ccf.json'"
                            class="btn btn-square shadow-inner text-base w-1/3">
                            编辑
                        </RouterLink>

                        <RouterLink :to="'/contest/judge?contest_path=' + contest.ccf_file"
                            class="btn btn-square btn-ghost shadow-inner text-base w-1/3">
                            评测
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <RouterLink to="/contest/add" class="btn btn-outline h-48 shadow-inner card flex cursor-pointer">
            <div class="card-body justify-center items-center font-bold text-3xl">
                新增比赛
            </div>
        </RouterLink>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

interface Data {
    contests: {
        name: string,
        description: string,
        ccf_file: string
    }[]
}

export default defineComponent({
    name: 'HomeView',
    data(): Data {
        return {
            contests: []
        }
    },
    async created() {
        this.contests = (await axios.get('/contest/')).data
    }
})
</script>
