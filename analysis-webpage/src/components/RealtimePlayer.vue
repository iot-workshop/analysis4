<template>
  <GChart
    type="LineChart"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
  import {GChart} from 'vue-google-charts';
  import { EventBus } from '../eventbus.js';

  export default {
    name: "RealtimePlayer",
    components: {
      GChart
    },
    props: {
      deviceID: String
    },
    data: function () {
      return {
        firstTimestamp: 0,
        // Array will be automatically processed with visualization.arrayToDataTable function
        chartData: [
          ['Date', 'X-Axis', 'Y-Axis', 'Z-Axis', {type: 'string', role: 'annotation'}, {type: 'string', role: 'annotationText'}],
          [-1, 0, 0, 0, null, null]
        ],
        chartOptions: {
          title: this.deviceID,
          hAxis: {
            title: 'Time'
          },
          vAxis: {
            title: 'Acceleration'
          },
          width: 900,
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 10.0
          },
          annotations: {
            style: 'line'
          }
        }
      };
    },
    created() {
      console.log("Created method")
      EventBus.$on('receivemessage', (json) => {
        console.log("event received")
        console.log(json)
        if (this.deviceID === json[0].deviceID) {
          console.log(this.deviceID)
          if(this.firstTimestamp === 0){
            this.firstTimestamp = json[0].sendingTimestamp;
          }
          console.log("Push it")
          for (let element in json){
            this.chartData.push([json[element].sendingTimestamp - this.firstTimestamp, json[element].deviceCoordinateX, json[element].deviceCoordinateY, json[element].deviceCoordinateZ, null, null])
          }
        }
      });
      EventBus.$on('startgame', (startTime) => {
        console.log("start event received"+startTime)
        this.chartData.push([startTime-this.firstTimestamp, 0, 0, 0, 'start', 'Start-Annotation']);
        setTimeout(()=>{
          this.chartData.push([startTime-this.firstTimestamp+10000, 0, 0, 0, 'end', 'End-Annotation'])
        },10*1000);
      });
    }
  }
</script>

<style scoped>

</style>
