<template>
  <div class="realtimeDataWrapper">
    <div class="realtimeData">
        <div v-for="(player, index) in players" :key="index">
          <div class="realtimePlayer">
              <RealtimePlayer :deviceID=player></RealtimePlayer>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import RealtimePlayer from "./RealtimePlayer";
  import {EventBus} from '../eventbus.js';

  const signalR = require('@aspnet/signalr');
  const axios = require('axios').default;

  export default {
    name: "RealtimeResults",
    components: {
      RealtimePlayer
    },
    data: function () {
      return {
        ready: false,
        players: []
      };
    },
    mounted() {
      this.getSignalRConnectionInfo().then(info => this.getConnectionInfo(info))
    },
    methods: {
      getConnectionInfo(info) {
        console.log("connInfo " + this.players)
        console.log(info.url + "  token  " + info.accessToken)
        this.ready = true;
        const options = {
          accessTokenFactory: () => info.accessToken
        };

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(info.url, options)
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connection.on('newMessage', (message) => {
          console.log("Connection from SignalR with message: ")
          console.log(message)
          console.log("connInfoON " + this.players)
          //Problem: SignalR schickt Nachrichten teilweise gleichzeitig raus => Fehler beim Parsen
          //Lösung: Liste
          let json = JSON.parse("[" + message + "]")
          let deviceID = json[0].deviceID
          if (this.players.indexOf(deviceID) === -1) {
            //this is first time for a player
            this.players.push(deviceID);
          }
          console.log("Before Event schmeiß")
          EventBus.$emit('receivemessage', json);
          console.log("Nach Event schmeiß")
        });


        connection.onclose(() => console.log('disconnected'));

        console.log('connecting...');
        connection.start()
          .then(() => console.log('connected!'))
          .catch(console.error);

      },
      getAxiosConfig() {
        const config = {
          headers: {}
        };
        return config;
      },
      async getSignalRConnectionInfo() {
        return axios.post(API_URL + '/api/negotiate', null, this.getAxiosConfig())
          .then(resp => resp.data);
      }
    }
  }
</script>

<style scoped>
  .realtimeDataWrapper{
    text-align: center;
  }

  .realtimePlayer{
    display: grid;
  }
  .realtimeData{
    display: grid;
    grid-template-columns: repeat(auto-fill, 900px);
  }

  @media(min-width: 1850px){
    .realtimeData{
      grid-gap: 30px;
    }
  }
</style>
