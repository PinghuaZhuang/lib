// import http from '@/utils/http'
import Vue from 'vue'
import axios from 'axios'

export default {
  methods: {
    /**
     * 下载报表
     * @param { String } fileUrl 下载地址
     * @param { String } fileName 重命名
     * @param { String } options 配置信息
     */
    handleDownload(fileUrl, fileName, options = {}) {
      // url = 'http://imgtest.luckycoffee.com/group1/M00/02/28/CmicNV4Wx4yAUKkCAAKjaWzrILw189.pdf'

      if (fileUrl === '') {
        this.$message.error(this.iUrlError)
        return
      }

      const vm = new Vue({
        data: {
          progress: 0,
          title: `${fileName}`,
          // duration: 5 * 1000,
          duration: 0,
          type: 'info',
          color: '#536EC2',
          tipDelay: 350,
          ...options,
        },
        methods: {
          close(notifyVm) {
            window.setTimeout(_ => {
              notifyVm.close && notifyVm.close()
            }, 1000 * 1.5)
          },
          success(notifyVm) {
            this.color = '#13931D'
            window.setTimeout(_ => {
              notifyVm.type = 'success'
            }, this.tipDelay)
          },
          error(notifyVm) {
            this.color = '#F56C6C'
            notifyVm.type = 'error'
          },
        },
        render() {
          return (<el-progress color={ this.color } percentage={ this.progress } />)
        },
      }).$mount()

      const notifyVm = this.openNotify(vm)
      notifyVm.$el.querySelector(`.progress`).append(vm.$el)

      return this.getBlob(fileUrl, vm, notifyVm).then((response) => {
        if (notifyVm.closed) return

        const blob = response.data
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          this.$z.download(window.URL.createObjectURL(blob), fileName)
        }
      })
    },
    /**
     * 打开提示窗口, 用于显示下载进度
     * @param { Vue } vm 进度条vm实例
     */
    openNotify(vm) {
      const notifyVm = this.$notify({
        title: vm.title,
        message: (<div class="progress">
          <i class="el-icon-close" onClick={ handleNotifyClose.bind(this) } />
        </div>),
        duration: vm.duration,
        type: vm.type,
        customClass: 'download-progress',
        showClose: false,
        vm,
        onClose(self) {
          self.cancel && self.cancel()
        },
      })
      function handleNotifyClose() {
        if (notifyVm.closed) return

        this.$confirm('是否确认取消下载？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          notifyVm.close && notifyVm.close()
        })
      }
      return notifyVm
    },
    /**
     * 获取 blob 数据
     * @param { String } url 下载地址
     * @param { Vue } vm 进度条vm实例
     * @param { Vue } notifyVm notify实例
     */
    getBlob(url, vm, notifyVm) {
      const { CancelToken } = axios
      return axios.get(url, {
        responseType: 'blob',
        onDownloadProgress({ loaded, total }) {
          vm.progress = Math.round(100 * loaded / total)
        },
        cancelToken: new CancelToken(cb => (notifyVm.cancel = cb))
      }).then(data => {
        vm.success(notifyVm)
        // notifyVm.type = 'success'
        vm.close(notifyVm)
        return data
      }).catch(error => {
        vm.error(notifyVm)
        // notifyVm.type = 'error'
        vm.close(notifyVm)
        console.error(`<<< 下载失败! error:`, error)
      })
    },
  }
}
