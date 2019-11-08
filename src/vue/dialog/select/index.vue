<template>
    <!-- FIXED: 修复点击弹窗会关闭的问题. -->
    <el-dialog class="s-dialog"

        v-bind="$attrs" :visible="visible"
        v-on="$listeners"

        modal-append-to-body
        append-to-body >

        <!-- 弹窗标题 -->
        <span slot="title">
            <slot name="title">{{ title }}</slot>
        </span>

        <!-- 弹窗主体内容 开始 -->
        <container>
            <search-bar @search=search></search-bar>
            <slot name="container"></slot>
        </container>
        <!-- 弹窗主体内容 结束 -->

        <!-- 弹窗底部 -->
        <span slot="footer">
            <slot name="footer" :visible="visible">
                <Footer
                    @rightBtn="rightBtn" @leftBtn="leftBtn"></Footer>
            </slot>
        </span>
    </el-dialog>
</template>

<script>
/**
 * 弹窗模板
 */

import Footer from './layout/footer.vue'
import Container from './layout/container'
import SearchBar from './components/searchBar'

export default {
    name: 's-dialog',
    components: {
        Footer,
        Container,
        SearchBar
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: false,
            default: 'Dialog'
        }
    },
    data () {
        return {
            result: {
                text: null, // 选中的信息文本
                data: null, // 选中的数据对象
            }
        }
    },
    created () {
    },
    watch: {
    },
    methods: {
        /* 保存 */
        leftBtn () {
            // TODO: 获取信息
            this.result.text = 'result'

            this.$emit( 'update:visible', false )
            this.$emit( 'leftBtn' )
        },

        /* 取消 */
        rightBtn () {
            this.$emit( 'update:visible', false )
            this.$emit( 'rightBtn' )
        },

        /* 点击搜索 */
        search ( searchKey ) {
            console.log( 'searchKey', searchKey )
        },

        /* 保存选中信息回调 */
        callback () {
            return this.result
        }
    },
}
</script>

<style lang="scss" scoped>
.s-dialog {
    /deep/ .el-dialog__header,
    /deep/ .el-dialog__footer {
        box-shadow: inset 0 0 6px rgba(66, 66, 66, 0.1)
    }



    // /deep/ .el-dialog__header {
    //     border-bottom: 1px solid gray;
    // }
    // /deep/ .el-dialog__footer {
    //     border-top: 1px solid gray;
    // }
}
</style>
