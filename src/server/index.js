const express = require( 'express' )
const app = express()
const path = require( 'path' )
const fs = require( 'fs' )
const Mock = require( 'mockjs' )
// const net = require( 'net' )

/**
 *  建立 websocket
 */
const WS = require( 'ws' )

const WebsocketServer = WS.Server
const wss = new WebsocketServer( { port: 5001 } )

wss.on( 'connection', ( ws ) => {
    console.log( '>>> client connected.' )
    ws.on( 'message', ( message ) => {
        console.log( `message: ${message}` );
    } )
    ws.send( '这是服务端发布的消息.' )
} )

/**
 * 返回静态文件
 */
app.set( 'port', ( process.env.PORT || 5000 ) )
app.use( '/static', express.static( __dirname + '/public' ) )
app.get( '/', ( request, response ) => {
    response.send( 'Hello World!' )
} )

/**
 * 使用 mock 数据
 */
const mockPath = path.join( __dirname, './mock' ) // 模拟数据目录
const mockFormat = '.js'.split( ' ' ) // 文件格式

// 读取文件
let readFilePromise = new Promise( ( resolve, reject ) => {
    let files = [],
        mockReg = new RegExp( mockFormat.map( ( item ) => `(${item}$)` ).join( '|' ) )

    fs.readdir( mockPath, function ( err, _files ) {
        if ( !err ) {
            _files.forEach( ( dir ) => {
                if ( mockReg.test( dir ) ) {
                    files.push( dir )
                }
            } )
            resolve( files )
        } else {
            reject( err )
        }
    } )
} )

// 处理请求
readFilePromise.then( ( files ) => {
    files.forEach( ( dir ) => {
        app.all( `/mock/${dir}`, ( request, response, next ) => {
            // response.send( '这是mock数据.' )
            let mockOpt = require( path.join( mockPath, dir ) )
            response.send( Mock.mock( mockOpt ) )
            // fs.readFile( path.join( mockPath, dir ), ( err, data ) => {
            //     if ( !err ) {
            //         response.json( Mock.mock( data ) )
            //     } else {
            //         response.send( { status: 500 } )
            //     }
            // } )
        } )
    } )
} )

/**
 * 监听端口
 */
app.listen( app.get( 'port' ), () => {
    console.log( `>>> Node app is running at localhost: ${app.get( 'port' )}` )
} )
