import getFiles from '@/utils/getFiles'

const files = require.context( './', true, /\.vue$/ )

// 路由配置
export const zList = getFiles( files, ( item ) => {
    let name = item === 'index' ? 'z' : item
    return {
        path: name,
        name: name,
        component: () => import( `./${item}.vue` )
    }
} )
