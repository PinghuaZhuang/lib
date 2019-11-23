<template>
    <a ref="el"
        :class="[ '__download__', { hide } ]"
        :href="`${href}?${uuid}`"
        :download="downloadName"
        @click.prevent="handleClick">

        {{ label }}
    </a>
</template>

<script>

// 获取 UUID
function getUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        var r = ( d + Math.random() * 16 ) % 16 | 0
        d = Math.floor( d / 16 )
        return ( c === 'x' ? r : ( r & 0x3 | 0x8) ).toString( 16 )
    } )
    return uuid
}

const DEF_NAME = 'download'

export default {
    name: 'download-demo',
    components: {
    },

    props: {
        href: { // 下载地址
            type: String,
            required: true,
        },
        label: { // 标签文本
            type: String,
            required: false,
            default: '',
        },
        download: { // download 属性, 文件名
            type: String,
            required: false,
        },
        hide: { // 是否隐藏 a 标签
            type: Boolean,
            required: false,
            default: false,
        },
        image: { // 是否是图片
            type: Boolean,
            required: false,
            default: false,
        }
    },

    data () {
        return {
            uuid: getUUID(),
            srcName: DEF_NAME, // 下载路径上获取文件名
        }
    },

    computed: {
        downloadName () { // 下载后的文件名
            return this.download || this.srcName
        }
    },

    methods: {
        /**
         * 点击下载
         */
        handleClick () {
            if ( this.download == null ) { // 不设置文件名默认获取下载路径的文件名
                this.srcName = this.getNameWithSrc( this.href )
            }

            if ( this.image && !this.isogeny( this.href ) ) { // 是图片的时候 && 同源
                this.handleDownloadImg( this.href )
            }
        },

        /**
         * 下载图片
         * @param { String } src 跨域图片路径
         */
        handleDownloadImg ( src ) {
            let image = new Image()
            image.setAttribute( 'crossOrigin', 'anonymous' )
            image.src = src

            image.onload = () => {
                let canvas = document.createElement( 'canvas' )
                let { width, height } = image

                Object.assign( canvas, {
                    width, height
                } )

                let ctx = canvas.getContext( '2d' ), base64
                ctx.drawImage( image, 0, 0, width, height )

                // base64 = canvas.toDataURL( `image/${this.getExt(image.src)}` )
                // this.handleDownload( base64, this.download )

                canvas.toBlob( ( blob ) => {
                    let url = URL.createObjectURL( blob )
                    this.handleDownload( base64, this.download )
                    URL.revokeObjectURL( url )
                } )
            }

            image.onerror = ( err ) => {
                console.error( `[download]: ${err}` )
            }
        },

        // 自定义下载
        handleDownload ( href, name = DEF_NAME ) {
            let eleLink = document.createElement( 'a' )
            eleLink.download = this.downloadName
            eleLink.href = href
            eleLink.click()
            eleLink.remove()
        },

        // 获取文件格式
        getExt ( src ) {
            return src.substring( src.lastIndexOf( '.' ) + 1 )
                .toLowerCase()
        },

        // 是否跨域
        isogeny ( src ) {
            return this.getOrigin( src ) === window.location.origin
        },

        // 获取域名
        getOrigin ( src ) {
            return src.split( /\/\/?/ ).splice( 0, 2 ).join( '//' )
        },

        // 获取路径上的文件名
        getNameWithSrc ( src ) {
            return src.split( /\/\/?/ ).pop()
        },
    }
}
</script>

<style>
.__download__.hide {
    display: none;
}
</style>
