<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
const _ = require("lodash")
import $ from 'jquery'
export default {
  name: 'App',
  computed: {
    userid() {
      return this.$store.state.user.id
    }
  },
  watch: {
    userid(val) {
      // websocket 建立连接成功之后再调用 loginWebsocket, 发送消息
      let timeId = setInterval(() => {
        if(this.$socket.readyState === 1) {
          this.loginWebsocket(val)
          clearInterval(timeId)
        }
      }, 1000);
    }
  },
  created() {
    window._ = _
    window.$ = $
  },
  mounted() {
    let _this = this
    this.setSystemInfo()
    this.$options.sockets.onmessage = ws => {
      const data = JSON.parse(ws.data)
      // console.log('==========',data)
      if (data.cmd === "sys.datetime") {
        this.$store.commit("UPDATE_SERVEROSINFO", data.body)
      } else if (data.cmd === "sys.error.log") {
        this.$store.commit("UPDATE_ERRORINFO", data.body)
      }
    }
    window.onbeforeunload = function() {
      _this.$socket.close()
    }
  },
  methods: {
    loginWebsocket(val) {
      if(val) {
        this.$socket.send("login-" + val + "")
      }
    },
    setSystemInfo() {},
  }
}
</script>

