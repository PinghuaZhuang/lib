const files = require.context( './', true, /\.vue$/ )
const vueList = files.keys().map( ( item ) => item.match( /[\/?](.*)\.vue$/ )[ 1 ] )

export default {
    // 名称列表, 例如 [ index, xitong, zhedie, ...]
    getNameList () {
        return vueList
    }
}
