<template>
    <table>
      <thead>
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Energy</th>
        <th v-if=overall>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="list.length <= 0">Loading...</tr>
      <tr v-if="list !== undefined || list.length > 0" v-for="(item, index) in list">
        <td>{{ index+1}}</td>
        <td>{{ item.deviceID }}</td>
        <td>{{ item.energy }}</td>
        <td v-if=overall>{{ getDateFromSession(item.sessionID) }}</td>
      </tr>
      </tbody>
    </table>
</template>

<script>

  const axios = require('axios').default
  export default {
    name: "ResultTable",
    props: {
      url: String,
      overall: Boolean
    },
    data: function () {
      return {
        list: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      async getData() {
        try {
          let response = await axios.get(this.url)
          console.log(response.data)
          this.list = response.data
        } catch (e) {
          console.log("Error getting data: " + e)
        }
      },
      getDateFromSession(sessionID) {
        return sessionID.slice(7, 9) + "/" + sessionID.slice(5, 7) + "/" + sessionID.slice(1, 5)
      }
    }
  }
</script>

<style scoped>
  td {
    padding-right: 10px;
  }

  table {
      margin-left:auto;
      margin-right:auto;
  }
  /*.table {
    overflow: auto;
    max-height: 500px;
  }*/
</style>
