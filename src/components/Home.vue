<script>
import { RouterLink } from 'vue-router';

export default {
  name: "AppContent",
  data() {
    return {
      responseData: Object,
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-travel-app-data")
        //make a call to our serverless function
        .then((response) => {
          console.log(response.data);
          this.responseData = response.data.data;
          console.log(this.responseData);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    query(collection, query) {
      //collection in this case is travels and the query is the travel._id
      this.$axios
        .get("fetch-travel", {
          //make a call to our serverless function passing params
          params: {
            collection: collection,
            query: query,
            id: query,
          },
        })
        .then((response) => {
          //print response in console
          console.log(response.data);
        })
        .catch((error) => {
          //print error
          console.log(error);

          this.$router.push({
            name: 'updateTravelView',
            params: {
              id: query,
            },
          });
        });
    },
    createTravel() {
      //collection in this case is travels and the query is the travel._id
      this.$axios
        .get("create-travel")
        .then((response) => {
          //print response in console
          console.log(response.data);
        })
        .catch((error) => {
          //print error
          console.log(error);
        });
    },
  },
  created() {
    //when app is created prints the results from calling the fetchData function
    this.fetchData();
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row aling-items-center flex-column justify-content-between h-100">
          <div class="col-auto text-center">
            <h1>Your Travels! <font-awesome-icon :icon="['fab', 'vuejs']" /></h1>
          </div>
          <div class="col-auto my-4">
            <RouterLink to="/new-travel" class="btn btn-warning">Start a new Journey</RouterLink>
          </div>
          <div class="row text-center">
            <div class="col-4" v-for="travel in responseData.travels" :key="travel._id">
              <div class="card">
                <div class="card-header">
                  <h2>{{ travel.destination }}</h2>
                </div>
                <div class="card-body">
                  <p>{{ travel.start_date }} / {{ travel.end_date }}</p>
                </div>
                <RouterLink :to="{ name: 'updateTravelView', params: { id: travel._id } }">Edit</RouterLink>
                <div class="card-footer">
                  <div class="btn btn-secondary" @click="query('travels', travel._id)">
                    Test query
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <div class="btn btn-secondary" @click="createTravel">
              Test query create
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
