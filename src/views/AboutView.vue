<template>
    <div class="collapse collapse-arrow join-item bg-base-200">
        <input type="checkbox" name="" id="">
        <div class="collapse-title text-xl font-medium">
            关于 ItsWA（点击展开或关闭）
        </div>

        <div class="collapse-content">
            <div class="my-2 mx-6 prose" v-html="markdown.render(md)"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { tasklist } from '@mdit/plugin-tasklist';
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt()
    .use(tasklist)
</script>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from "vue";

interface Data {
    md: string
}

export default defineComponent({
    name: "AboutView",
    data(): Data {
        return {
            md: '加载中'
        }
    },
    async created() {
        this.md = (await axios.get('https://mirror.ghproxy.com/raw.githubusercontent.com/XYCode-Kerman/ItsWA/master/README.md')).data
    }
})
</script>