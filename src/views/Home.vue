<script>
import TravelCard from "../components/travel/TravelCard.vue";

export default {
  name: "Home",
  components: {
    TravelCard, // Register the TravelCard component
  },
  data() {
    return {
      responseData: {}, // Response data from API
      today: new Date(),
      futureTravels: [], // Future travels array
      pastTravels: [],   // Past travels array
      currentTravels: [], // Current travels array
    };
  },
  methods: {
    fetchAllTravels() {
      this.$axios
        .get("/fetch-all-travels")
        .then((response) => {
          this.responseData = response.data.data;

          // Reset the travel arrays
          this.futureTravels = [];
          this.pastTravels = [];
          this.currentTravels = [];

          // Classify travels into current, future, and past
          this.responseData.travels.forEach((travel) => {
            const startDate = new Date(travel.start_date);
            const endDate = new Date(travel.end_date);
            const isCurrent = this.today >= startDate && this.today <= endDate;
            travel.daysUntilStart = Math.ceil(
              (startDate - this.today) / (1000 * 60 * 60 * 24)
            );

            if (isCurrent) {
              this.currentTravels.push(travel);
            } else if (startDate >= this.today) {
              this.futureTravels.push(travel);
            } else {
              this.pastTravels.push(travel);
            }
          });

          this.futureTravels = [...this.futureTravels];
          this.pastTravels = [...this.pastTravels];
          this.currentTravels = [...this.currentTravels];
        })
        .catch((error) => {
          console.error("Error fetching travel data:", error);
        });
    },
    updateTravel(travelId) {
      this.$router.push({
        name: "travelUpdate",
        params: { id: travelId },
      });
    },
    deleteTravel(travelId) {
      this.$axios
        .get("/delete-travel", {
          params: { id: travelId },
        })
        .then((response) => {
          if (response.data.message) {
            alert(response.data.message);
          }
          this.fetchAllTravels();
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
    this.fetchAllTravels();
  },
};
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row align-items-center flex-column justify-content-between h-100">

          <!-- No travels section -->
          <div v-if="futureTravels.length === 0 && pastTravels.length === 0 && currentTravels.length === 0"
            class="row text-center justify-content-center">
            <h3 class="text-start align-self-start">You have no vacays planned</h3>
            <div class="col-9 mt-3">
              <div class="card logo-card p-3 align-items-center justify-content-center">
                <div class="col-12">
                  <h2>Start planning your vacay now!</h2>
                </div>
                <div class="col-9 align-self-center">
                  <RouterLink :to="{ name: 'travelCreate' }" class="logo-circle mx-auto my-3">
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
                <TravelCard :travel="travel" cardType="current" @edit="updateTravel" @delete="deleteTravel" />
              </div>
            </div>
          </div>

          <!-- Future Travels Section -->
          <div v-if="futureTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Here is your planned vacay:</h3>
            <div class="col-12 mb-3" v-for="travel in futureTravels" :key="travel._id">
              <TravelCard :travel="travel" cardType="future" @edit="updateTravel" @delete="deleteTravel" />
            </div>
          </div>

          <!-- Past Travels Section -->
          <div v-if="pastTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Your past vacays:</h3>
            <div class="col-12 mb-3" v-for="travel in pastTravels" :key="travel._id">
              <TravelCard :travel="travel" cardType="past" @edit="updateTravel" @delete="deleteTravel" />
            </div>
          </div>

          <!-- Add travel button -->
          <div v-if="futureTravels.length > 0 || pastTravels.length > 0 || currentTravels.length > 0"
            class="col-auto m-auto text-center">
            <RouterLink :to="{ name: 'travelCreate' }" class="btn btn-add fs-1 px-3">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Add styles for logo and buttons */
.logo-circle {
  width: 110px;
  height: 110px;
  background-color: var(--brand-color);
  border-radius: 50%;
}

.logo-img {
  height: 80px;
  object-fit: contain;
}

.logo-card {
  background-color: var(--neutral-gray);
}

/* Add button styles */
.btn-add {
  color: var(--brand-color) !important;
  background-color: var(--neutral-gray) !important;
  border-radius: 50% !important;
  width: 60px;
  height: 60px;
}
</style>
