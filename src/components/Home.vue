<script>
import { RouterLink } from "vue-router";

export default {
  name: "AppContent",
  data() {
    return {
      responseData: {}, // Initialize as an empty object
      today: new Date()
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-travel-app-data")
        .then((response) => {
          // Assuming the date format in the response is 'YYYY-MM-DD'
          this.responseData = response.data.data;
          this.responseData.travels.forEach(travel => {
            const startDate = new Date(travel.start_date);
            travel.daysUntilStart = Math.ceil((startDate - this.today) / (1000 * 60 * 60 * 24));
          });
        })
        .catch((error) => {
          console.error("Error fetching travel data:", error);
        });
    },
    query(collection, travelId) {
      this.$axios
        .get("/fetch-travel", {
          params: {
            collection: collection,
            query: travelId,
            id: travelId,
          },
        })
        .then((response) => {
          const travel = response.data;
          if (travel) {
            this.$router.push({
              name: "updateTravelView",
              params: {
                id: travelId,
              },
              query: {
                travelData: JSON.stringify(travel),
              },
            });
          } else {
            console.log(`No travel found with ID: ${travelId}`);
          }
        })
        .catch((error) => {
          console.error("Error querying travel:", error);
          // Redirect only if there's no critical error
          this.$router.push({
            name: "updateTravelView",
            params: {
              id: travelId,
            },
          });
        });
    },
    queryDelete(collection, travelId) {
      this.$axios
        .get("/delete-travel", {
          params: {
            collection: collection,
            query: travelId,
            id: travelId, // Ensure this matches what your server expects
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.message) {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting travel:",
            error.response ? error.response.data : error.message
          );
        });
    },
  },
  created() {
    this.fetchData(); // Only call once in created
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row align-items-center flex-column justify-content-between h-100">
          <div class="col-auto text-center">
            <h3 class="text-start align-self-start">
              Here is your planned vacay:
            </h3>
          </div>
          <div class="row text-center">
            <div class="col-12 mb-3" v-for="travel in responseData.travels" :key="travel._id">
              <div class="card my-card">
                <div class="card-header my-card-header-future">
                  <h2>{{ travel.destination }}</h2>
                  <font-awesome-icon class="fs-3" :icon="['fas', 'gear']" />
                </div>
                <div class="card-body my-card-body text-start">
                  <p><em>{{ travel.start_date }} - {{ travel.end_date }}</em></p>
                  <p>Start in <strong>{{ travel.daysUntilStart }}</strong> days</p>
                  <p>Budget <strong>{{ travel.budget }}</strong></p>
                </div>
                <!-- Questi dovrebbero uscire dall'ingranaggio -->
                <!-- <div class="card-footer">
                  <button class="btn btn-secondary" @click="query('travels', travel._id)">
                    Edit
                  </button>
                  <button class="btn btn-warning" @click="queryDelete('travels', travel._id)">
                    Delete
                  </button>
                </div> -->
              </div>
            </div>
            <div class="col-auto m-auto">
              <RouterLink to="/new-travel" class="btn btn-add">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
/* Add your styles here */
</style>
