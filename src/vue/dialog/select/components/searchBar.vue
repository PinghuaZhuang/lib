<template>
    <div class="s-dialog-search-bar">
        <el-form ref="form" :model="model" label-width="80px">
            <el-form-item label="活动名称">
                <el-input v-model="model.searchKey">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                        @click="search( model.searchKey )"></i>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 's-dialog-sarch-bar',
    data () {
        return {
            model: {
                searchKey: ''
            }
        }
    },
    methods: {
        search ( searchKey ) {
            this.$emit( 'search', searchKey )
        }
    }
}
</script>

<style lang="scss" scoped>
.s-dialog-search-bar {
    padding-bottom: 30px;
}
</style>
