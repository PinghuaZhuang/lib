// const files = require.context( './', true, /\.vue$/ )

export default function ( files, callback ) {
    const vueList = files.keys().map( ( item ) => /* item.match( /[\/?](.*)\.vue$/ )[ 1 ] */ files( item ) )

    const names = vueList.map( ( item ) => {
        let file = item.default.__file
        let name = file.match( /.*\/(.*)\.vue$/ )[ 1 ]
        return name
    } )
    return names.map( callback )
}
