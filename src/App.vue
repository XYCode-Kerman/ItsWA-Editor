<template>
    <div class="navbar bg-base-100 shadow-lg">
        <div class="flex-1">
            <button class="btn btn-ghost"> ItsWA Manager </button>
        </div>

        <div class="gap-2.5">
            <router-link to="/" class="btn btn-ghost text-lg">首页</router-link>
            <router-link to="/about" class="btn btn-ghost text-lg">关于</router-link>
        </div>
    </div>

    <router-view/>
</template>

<style>
.router-link-exact-active {
    @apply btn-active;
}
</style>
