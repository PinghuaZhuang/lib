const files = require.context( '../demo/z', true, /\.vue$/ )
const vueList = files.keys().map( ( item ) => /* item.match( /[\/?](.*)\.vue$/ )[ 1 ] */ files( item ) )

// 路由配置
export const demoRouter = {
    path: '/demo',
    name: 'demo',
    children: vueList.map( ( item, index ) => {
        let file = item.default.__file
        let name = file.match( /.*\/(.*)\.vue$/ )[ 1 ]
        const retFile = "../demo/z/index.vue"
        console.log( file, retFile )
        return {
            path: name,
            name: name,
            component: import( retFile )
        }
    } )
}

console.log( vueList, files.keys(), process.demoFiles )
console.log( demoRouter )
