<script>
import { RouterLink } from "vue-router";

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
    query(collection, travelId) {
      // 'collection' in this case is likely the name of the collection (travels),
      // and 'travelId' is the unique identifier of the travel record (travel._id)

      // Make an HTTP GET request using Axios to a serverless function ('fetch-travel')
      this.$axios
        .get("fetch-travel", {
          // Pass parameters in the request, including:
          // - 'collection' (the collection name, 'travels')
          // - 'query' (the travelId, which is likely the identifier for the specific travel entry)
          // - 'id' (another reference to the travelId)
          params: {
            collection: collection,
            query: travelId,
            id: travelId,
          },
        })
        .then((response) => {
          // If the request is successful, log the response data to the console
          console.log(response.data);

          // Store the response data in a local constant 'travel'
          const travel = response.data;

          // Check if the travel data exists
          if (travel) {
            // If travel data is found, navigate to the 'updateTravelView' route.
            // Pass the travel ID via route parameters and the travel data itself via the query string.
            this.$router.push({
              name: "updateTravelView", // Target route name
              params: {
                id: travelId, // Pass travel ID as a route parameter ( /updateTravelView/:id)
              },
              query: {
                travelData: JSON.stringify(travel), // Pass the travel data as a query parameter (stringified JSON)
              },
            });
          } else {
            // If no travel data is found for the given ID, log a message
            console.log(`No travel found with ID: ${travelId}`);
          }
        })
        .catch((error) => {
          // If there's an error during the request, log the error message
          console.log(error);

          // Even if there's an error, navigate to the 'updateTravelView' route, passing the travel ID via route parameters
          this.$router.push({
            name: "updateTravelView", // Target route name
            params: {
              id: travelId, // Pass travel ID as a route parameter
            },
          });
        });
    },
  },
  created() {
    //when app is created prints the results from calling the fetchData function
    this.fetchData();
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div
          class="row aling-items-center flex-column justify-content-between h-100"
        >
          <div class="col-auto text-center">
            <h1>
              Your Travels! <font-awesome-icon :icon="['fab', 'vuejs']" />
            </h1>
          </div>
          <div class="col-auto my-4">
            <RouterLink to="/new-travel" class="btn btn-brand"
              >Start a new Journey</RouterLink
            >
          </div>
          <div class="row text-center">
            <div
              class="col-4"
              v-for="travel in responseData.travels"
              :key="travel._id"
            >
              <div class="card">
                <div class="card-header">
                  <h2>{{ travel.destination }}</h2>
                </div>
                <div class="card-body">
                  <p>{{ travel.start_date }} / {{ travel.end_date }}</p>
                </div>
                <div class="card-footer">
                  <div
                    class="btn btn-secondary"
                    @click="query('travels', travel._id)"
                  >
                    Edit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
