<template>
  <div id="app">
    <img alt="Analytics logo" width="30%" src="./assets/analytics.png">
    <qrcode :value=url></qrcode>
    <HelloWorld :msg="'Welcome to Your Analytics (#'+currentSession+')'" :currentSessionID=currentSession></HelloWorld>
    <p style="color: #999; font-size: small;">ShakeIT is a simple and fun Internet of Things game, used for the development of an IoT showcase in purpose
      of a thesis.<br>
      &copy; Stefanie Motzokan, 2020
      <br>This work is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 License</a></p>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  const sprintf = require('sprintf-js').sprintf;

  export default {
    name: 'app',
    components: {
      HelloWorld
    },
    created() {
      this.count = Math.floor(Math.random() * (101));
      let today = new Date(Date.now());
      this.currentSession = sprintf('S%04d%02d%02d%03d_%02d', today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getMilliseconds(), this.count)
      this.url = "https://iot-workshop.github.io/iotgame4?session=" + this.currentSession
    },
    data: function () {
      return {
        currentSession: String,
        count: 1,
        url: String
      }
    }
  }
</script>

<style>
  #app {
    font-family: monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
