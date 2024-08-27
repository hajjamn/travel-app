<script>
import { RouterLink } from "vue-router";

export default {
  name: "AppContent",
  data() {
    return {
      responseData: {}, // Initialize as an empty object
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-travel-app-data")
        .then((response) => {
          this.responseData = response.data.data;
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
        <div
          class="row align-items-center flex-column justify-content-between h-100"
        >
          <div class="col-auto text-center">
            <h1>
              Your Travels! <font-awesome-icon :icon="['fab', 'vuejs']" />
            </h1>
          </div>
          <div class="col-auto my-4">
            <RouterLink to="/new-travel" class="btn btn-brand">
              Start a new Journey
            </RouterLink>
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
                  <button
                    class="btn btn-secondary"
                    @click="query('travels', travel._id)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-warning"
                    @click="queryDelete('travels', travel._id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
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
