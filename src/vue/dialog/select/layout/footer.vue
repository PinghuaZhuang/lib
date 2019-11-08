<template>
    <div class="s-dialog-footer">
        <el-button @click.stop="$emit( 'leftBtn' )" type="primary">保存</el-button>
        <el-button @click.stop="$emit( 'rightBtn' )">取消</el-button>
    </div>
</template>
