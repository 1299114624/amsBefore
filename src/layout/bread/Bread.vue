<template>
    <div class="G_bread">
        <el-breadcrumb separator="/" class="el-bread">
            <el-breadcrumb-item v-for="(item, index) in $route.matched" :key='index' :to="{path: item.path.split('/:')[0]}"
            v-if="index > 0 && item.meta.bread && index !== $route.matched.length - 1">
                {{item.meta.alias}}
            </el-breadcrumb-item>
            <!-- 面包屑最后一级不允许点击 -->
            <el-breadcrumb-item>
                {{$route.matched[$route.matched.length - 1].meta.alias}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    name: "bread",
    mounted() {
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
.G_bread {
    .el-breadcrumb {
        font-size: 12px;
    }
    .el-bread {
        line-height: 30px;
    }
}
</style>