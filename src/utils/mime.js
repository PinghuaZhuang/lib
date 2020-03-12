/**
 * MIME API
 */
export const MIME_MAP = {
    text: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    javaScript: 'text/javascript',
    gif: 'image/gif',
    png: 'image/png',
    jpeg: 'image/jpeg',
    bmp: 'image/bmp',
    icon: 'image/x-icon',
    svg: 'image/svg+xml',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    doc: 'application/msword',
    pdf: 'application/pdf',
}

/**
 * 获取A标签下载base64的前缀
 * @param { String } format 格式
 * @param { Base64 } base64
 */
export function getABase64TypeWithFormat(format, base64) {
    return `data:${format};base64,${base64}`
}
