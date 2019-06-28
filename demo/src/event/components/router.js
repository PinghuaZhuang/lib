import getFiles from '@/utils/getFiles'

const files = require.context( './', true, /\.vue$/ )

// 路由配置
export const eventList = getFiles( files, ( item ) => {
    // let name = item === 'index' ? '' : item
    return {
        path: name,
        name: name,
        component: () => import( `./${item}.vue` )
    }
} )
