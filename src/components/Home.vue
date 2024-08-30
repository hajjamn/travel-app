<script>
import { RouterLink } from "vue-router";

export default {
  name: "AppContent",
  data() {
    return {
      responseData: {}, // Initialize as an empty object
      today: new Date(),
      futureTravels: [],
      pastTravels: [],
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-travel-app-data")
        .then((response) => {
          this.responseData = response.data.data;
          // Reset dei viaggi
          this.futureTravels = [];
          this.pastTravels = [];
          // Separate travels into future and past
          // console.log(this.responseData.travels)
          this.responseData.travels.forEach((travel) => {
            const startDate = new Date(travel.start_date);
            travel.daysUntilStart = Math.ceil(
              (startDate - this.today) / (1000 * 60 * 60 * 24)
            );

            // Classify the travel based on its start date
            if (startDate >= this.today) {
              this.futureTravels.push(travel);
            } else {
              this.pastTravels.push(travel);
            }
          });

          // Ensure reactivity by reassigning the arrays
          this.futureTravels = [...this.futureTravels];
          this.pastTravels = [...this.pastTravels];
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
          // console.log(response.data);
          if (response.data.message) {
            alert(response.data.message);
          }
          this.fetchData();
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

          <!-- No travels section -->
          <div v-if="futureTravels.length == 0 && pastTravels.length == 0"
            class="row text-center justify-content-center">
            <h3 class="text-start alignt-self-start">You have no vacays planned</h3>
            <div class="col-9 mt-3">
              <div class="card logo-card p-3 align-items-center justify-content-center">
                <div class="col-12">
                  <h2>Start planning your vacay now!</h2>
                </div>
                <div class="col-9 align-self-center">
                  <RouterLink to="/new-travel" class="logo-circle mx-auto my-3">
                    <img src="/public/logo1.png" alt="" class="logo-img" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Future Travels Section -->
          <div v-if="futureTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">
              Here is your planned vacay:
            </h3>
            <div class="col-12 mb-3" v-for="travel in futureTravels" :key="travel._id">
              <div class="card my-card">
                <div class="card-header my-card-header-future">
                  <h2>{{ travel.destination }}</h2>
                  <font-awesome-icon class="fs-3" :icon="['fas', 'gear']" @click="query('travels', travel._id)" />
                </div>
                <div class="card-body my-card-body text-start">
                  <p>
                    <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                  </p>
                  <p>
                    Start in <strong>{{ travel.daysUntilStart }}</strong> days
                  </p>
                  <p>
                    Budget <strong>{{ travel.budget }}</strong>
                  </p>
                </div>
                <div class="card-footer">
                  <button class="btn btn-secondary" @click="query('travels', travel._id)">
                    Edit
                  </button>
                  <button class="btn btn-warning" @click="queryDelete('travels', travel._id)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add travel button -->
          <div v-if="futureTravels.length != 0 || pastTravels.length != 0" class="col-auto m-auto text-center">
            <RouterLink to="/new-travel" class="btn btn-add fs-1 px-3">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </RouterLink>
          </div>

          <!-- Past Travels Section -->
          <div v-if="pastTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Your past vacays:</h3>
            <div class="row text-center">
              <div class="col-12 mb-3" v-for="travel in pastTravels" :key="travel._id">
                <div class="card my-card">
                  <div class="card-header my-card-header-past">
                    <h2>{{ travel.destination }}</h2>
                    <font-awesome-icon class="fs-3" :icon="['fas', 'gear']" @click="query('travels', travel._id)" />
                  </div>
                  <div class="card-body my-card-body text-start">
                    <p>
                      <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                    </p>
                    <p>
                      Budget <strong>{{ travel.budget }}</strong>
                    </p>
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-secondary" @click="query('travels', travel._id)">
                      Edit
                    </button>
                    <button class="btn btn-warning" @click="queryDelete('travels', travel._id)">
                      Delete
                    </button>
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

<style scoped>
.logos {
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* Assicura che le immagini del logo siano contenute */
.logos img {
  height: 105px;
}

/* Cerchio bianco intorno all'immagine del logo */
.logo-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 110px;
  background-color: var(--brand-color);
  border-radius: 50%;
  padding: 5px;
}

.logo-img {
  width: 100%;
  height: auto;
  /* Questo non e' necessarissimo */
  object-fit: contain;
}

.logo-circle img {
  height: 80px;
}

.logo-card {
  background-color: var(--neutral-gray);
}
</style>
