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
    test() {
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
    query(collection, travelId) {
      //collection in this case is travels and the query is the travel._id
      this.$axios
        .get("fetch-travel", {
          //make a call to our serverless function passing params
          params: {
            collection: collection,
            query: travelId,
            id: travelId,
          },
        })
        .then((response) => {
          //print response in console
          console.log(response.data);
          //store data
          const travel = response.data;

          if (travel) {
            //pass data using route 'state' and navigate to updateTravelView
            this.$router.push({
              name: 'updateTravelView',
              params: {
                id: travelId,
              },
              query: {
                travelData: JSON.stringify(travel), //pass the travel data as a quey parameter
              },
            });
          } else {
            console.log(`No travel found with ID: ${travelId}`);
          }
        })
        .catch((error) => {
          //print error
          console.log(error);

          this.$router.push({
            name: 'updateTravelView',
            params: {
              id: travelId,
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
    //when app is created prints the results from calling the test function
    this.test();
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row aling-items-center flex-column justify-content-between h-100">
          <div class="col-auto text-center">
            <h1>Hello Vue <font-awesome-icon :icon="['fab', 'vuejs']" /></h1>
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
                    Edit
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
