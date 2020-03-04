<template>
  <div class='hello'>
    <div class='StartButton'>
      <button class="start" @click="startCountdown" :disabled='clicked'>Start IT</button>
    </div>
    <div class="countdown-wrapper">
      <div id="countdown" v-if="clicked && counter!==0">
        <p>{{counter}}</p>
      </div>
      <div id="timeover" v-if="clicked && counter===0">
        <p>Time is over!</p>
      </div>
    </div>
    <h1>{{ msg }}</h1>
    <p class="session-timeout" v-if="sessionTimeout">Session expired!</p>
    <div class='realtime'>
      <details open="open">
        <summary>Realtime data</summary>
        <RealtimeResults></RealtimeResults>
      </details>
    </div>
    <div class='outputSession'>
      <details>
        <summary>Results for your current session</summary>
        <ResultTable :overall=false
                     :url=url_session
                     ref="session"></ResultTable>
      </details>
    </div>
    <div class='outputHighscore'>
      <details>
        <summary>Overall highscore</summary>
        <ResultTable :overall=true
                     :url=url_overall
                     ref="overall"></ResultTable>
      </details>
    </div>
  </div>
</template>

<script>
  import ResultTable from "./ResultTable";
  import RealtimeResults from "./RealtimeResults";
  import {EventBus} from '../eventbus.js';

  const axios = require('axios').default;

  export default {
    name: 'HelloWorld',
    components: {RealtimeResults, ResultTable},
    props: {
      msg: String,
      currentSessionID: String
    },
    data: function () {
      return {
        clicked: false,
        counter: 10,
        url_overall: API_URL + '/api/DataAnalytics',
        url_session: undefined,
        sessionTimeout: false
      }
    },
    methods: {
      startCountdown() {
        this.clicked = true;
        let startTime = Date.now();
        this.url_session = API_URL + '/api/DataAnalyticsSession?session=' + this.currentSessionID + '&begin=' + startTime;
        EventBus.$emit('startgame', startTime);
        this.countdownTimer();
      },
      async countdownTimer() {
        if (this.counter !== 0) {
          setTimeout(() => {
            this.counter--;
            this.countdownTimer();
          }, 1000);
        } else {
          console.log(this.url_session);
          await this.$refs.session.getData();
          await this.$refs.overall.getData();
        }
      },
      async deleteAccelerometerData() {
        try {
          await axios.post(API_URL + '/api/DeleteOldAccelerometerData');
          console.log("AccelerometerData from current session deleted")
        } catch (e) {
          console.log("Error deleting accelerometer data: " + e)
        }
      }
    },
    created() {
      setTimeout(() => {
        this.sessionTimeout = true;
        this.deleteAccelerometerData();
      }, 5 * 60 * 1000)
    }
  }
</script>

<style scoped>
  summary {
    font-size: large;
    text-align: center;
  }

  @media (min-width: 2000px) {
    .realtime {
      width: 2000px;
    }
  }

  @media (min-width: 3000px) {
    .realtime {
      width: 3000px;
    }
  }

  .countdown-wrapper {
    font-size: xx-large;
  }

  .start {
    font-family: monospace;
  }

  .session-timeout {
    font-weight: bolder;
    font-size: x-large;
    font-family: 'Times New Roman',sans-serif;
  }
</style>

