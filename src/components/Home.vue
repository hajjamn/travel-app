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
      currentTravels: [], // New array for current travels
      openTravelId: null
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-travel-app-data")
        .then((response) => {
          this.responseData = response.data.data;
          // Reset arrays
          this.futureTravels = [];
          this.pastTravels = [];
          this.currentTravels = []; // Reset current travels

          // Separate travels into future, past, and current
          this.responseData.travels.forEach((travel) => {
            const startDate = new Date(travel.start_date);
            const endDate = new Date(travel.end_date);

            // Determine if the travel is current
            const isCurrent = this.today >= startDate && this.today <= endDate;
            travel.daysUntilStart = Math.ceil((startDate - this.today) / (1000 * 60 * 60 * 24));

            if (isCurrent) {
              console.log("Current Travel Identified:", travel);
              this.currentTravels.push(travel);
            } else if (startDate >= this.today) {
              this.futureTravels.push(travel);
            } else {
              this.pastTravels.push(travel);
            }
          });

          // Ensure reactivity by reassigning the arrays
          this.futureTravels = [...this.futureTravels];
          this.pastTravels = [...this.pastTravels];
          this.currentTravels = [...this.currentTravels];
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
    toggleEditMode(travelId) {
      // Toggle open travel ID
      this.openTravelId = this.openTravelId === travelId ? null : travelId;
    }
  },
  created() {
    this.fetchData();
  },
};
</script>


<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row align-items-center flex-column justify-content-between h-100">

          <!-- No travels section -->
          <div v-if="futureTravels.length == 0 && pastTravels.length == 0 && currentTravels.length == 0"
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

          <!-- Current Travels Section -->
          <div v-if="currentTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Current Travels:</h3>
            <div class="row text-center">
              <div class="col-12 mb-3" v-for="travel in currentTravels" :key="travel._id">
                <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                  <div
                    class="card-header my-card-header my-card-header-current d-flex align-items-center justify-content-between">
                    <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                      <h2 class="travel-title">{{ travel.destination }}</h2>
                    </RouterLink>
                    <div class="d-flex align-items-center position-relative">
                      <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                        @click="toggleEditMode(travel._id)" />
                      <!-- Options slider for Edit and Delete -->
                      <transition name="slide-fade">
                        <div v-if="openTravelId === travel._id" class="options-slider">
                          <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                            Edit
                          </button>
                          <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                            Delete
                          </button>
                        </div>
                      </transition>
                    </div>
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
              <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                <div
                  class="card-header my-card-header my-card-header-future d-flex align-items-center justify-content-between">
                  <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                    <h2 class="travel-title">{{ travel.destination }}</h2>
                  </RouterLink>
                  <div class="d-flex align-items-center position-relative">
                    <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                      @click="toggleEditMode(travel._id)" />
                    <!-- Options slider for Edit and Delete -->
                    <transition name="slide-fade">
                      <div v-if="openTravelId === travel._id" class="options-slider">
                        <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                          Edit
                        </button>
                        <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                          Delete
                        </button>
                      </div>
                    </transition>
                  </div>
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
              </div>
            </div>
          </div>

          <!-- Add travel button -->
          <div v-if="futureTravels.length != 0 || pastTravels.length != 0 || currentTravels.length != 0"
            class="col-auto m-auto text-center">
            <RouterLink to="/new-travel" class="btn btn-add fs-1 px-3">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </RouterLink>
          </div>

          <!-- Past Travels Section -->
          <div v-if="pastTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Your past vacays:</h3>
            <div class="row text-center">
              <div class="col-12 mb-3" v-for="travel in pastTravels" :key="travel._id">
                <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                  <div
                    class="card-header my-card-header my-card-header-past d-flex align-items-center justify-content-between">
                    <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                      <h2 class="travel-title">{{ travel.destination }}</h2>
                    </RouterLink>
                    <div class="d-flex align-items-center position-relative">
                      <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                        @click="toggleEditMode(travel._id)" />
                      <!-- Options slider for Edit and Delete -->
                      <transition name="slide-fade">
                        <div v-if="openTravelId === travel._id" class="options-slider">
                          <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                            Edit
                          </button>
                          <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                            Delete
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="card-body my-card-body text-start">
                    <p>
                      <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                    </p>
                    <p>
                      Budget <strong>{{ travel.budget }}</strong>
                    </p>
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
.card-header .travel-title {
  text-decoration: none !important;
  color: white;
}

.card-header .travel-title:hover {
  color: var(--brand-color);
}

.logos {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.logos img {
  height: 105px;
}

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
  object-fit: contain;
}

.logo-circle img {
  height: 80px;
}

.logo-card {
  background-color: var(--neutral-gray);
}

/* Transition of options */

.gear-icon {
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.card-open .gear-icon {
  transform: translateX(-200%);
}

.options-slider {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transform: translateX(100%);
  opacity: 0;
}

.card-open .options-slider {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
