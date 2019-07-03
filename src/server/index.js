const express = require( 'express' )
const app = express()
// const net = require( 'net' )

// 建立 websocket
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

app.set( 'port', ( process.env.PORT || 5000 ) )
app.use( '/mock', express.static( __dirname + '/public' ) )

app.get( '/', ( request, response ) => {
    response.send( 'Hello World!' )
} )

app.listen( app.get( 'port' ), () => {
    console.log( `>>> Node app is running at localhost: ${app.get( 'port' )}` )
} )
