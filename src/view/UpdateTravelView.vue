<template>
  <h2>Update Travel Information</h2>
  <div v-if="travel">
    <form @submit.prevent="submitForm" method="POST">
      <label for="destination">Destination:</label>
      <input type="text" v-model="travel.destination" name="destination" id="destination" required /><br /><br />

      <label for="start_date">Start Date:</label>
      <input type="date" v-model="travel.start_date" name="start_date" id="start_date" required /><br /><br />

      <label for="end_date">End Date:</label>
      <input type="date" v-model="travel.end_date" name="end_date" id="end_date" required /><br /><br />
      <button type="submit">Update</button>
    </form>

    <!-- Stop Creation Form -->
    <h3>Create a New Stop</h3>
    <form @submit.prevent="createStop">
      <label for="stop_title">Stop Title:</label>
      <input v-model="newStop.title" type="text" id="stop_title" required /><br /><br />

      <!-- Day Selection Dropdown -->
      <label for="day_select">Select Day:</label>
      <select v-model="selectedDay" @change="onDaySelect" id="day_select" required>
        <option v-for="day in days" :key="day._id" :value="day._id">
          {{ formatDate(day.date) }}
        </option>
      </select><br /><br />

      <!-- Coordinates Inputs -->
      <label for="latitude">Latitude:</label>
      <input v-model="newStop.latitude" type="number" id="latitude" step="0.0001" required /><br /><br />

      <label for="longitude">Longitude:</label>
      <input v-model="newStop.longitude" type="number" id="longitude" step="0.0001" required /><br /><br />

      <button type="submit">Add Stop</button>
    </form>

    <h1>Inizio: {{ travel.destination || "No destination available" }}</h1>
    <div>
      <h2 v-for="stop in stops" :key="stop._id">{{ stop.title }}</h2>
    </div>
  </div>
  <div v-else>
    <h3>Travel is loading...</h3>
  </div>
</template>

<script>
export default {
  name: "UpdateTravel",
  props: ["id"],
  data() {
    return {
      travel: null, // Holds travel data
      days: [], // Holds the list of days for the travel
      stops: [],
      selectedDay: "", // Holds the ID of the selected day
      newStop: {
        title: "",
        latitude: 0,
        longitude: 0,
      }, // Holds new stop data (excluding day_id)
    };
  },
  created() {
    // Fetch travel and days together using the existing fetch-travel API
    this.fetchTravelAndDays();

  },
  mounted() {
    this.fetchStops();
  },
  methods: {
    async fetchTravelAndDays() {
      try {
        // Fetch 'id' from route parameters
        const travelId = this.$route.params.id;

        console.log("Fetching travel with ID:", travelId);  // Log the ID to ensure it's not undefined

        // If ID is still undefined, something is wrong with the routing or URL
        if (!travelId) {
          throw new Error("No travel ID provided in the route");
        }

        const response = await this.$axios.get("/fetch-travel", {
          params: {
            collection: 'travels',
            id: travelId,  // Use the travel ID from route params
          },
        });

        console.log("Full Response:", response);  // Log the entire response

        if (response.status === 200 && response.data) {
          const { travel, days, stops } = response.data.data;
          this.travel = travel;
          this.days = days;
          this.stops = stops;

          console.log("Fetched days:", this.days); // Debugging output
          console.log("Fetched stops:", this.stops);
        } else {
          console.error("Unexpected response structure or status:", response);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error Response:", error.response);  // Log the full error response
        } else {
          console.error("Error without response:", error);
        }
      }
    },

    async createStop() {
      try {
        const stopData = {
          travel_id: this.travel._id,
          day_id: this.selectedDay,
          title: this.newStop.title,
          latitude: this.newStop.latitude,
          longitude: this.newStop.longitude,
        };

        console.log("Stop data being sent:", stopData);

        const response = await this.$axios.post("/create-stop", stopData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response from server:", response.data); // Log server response

        if (response.data.message) {
          alert("Stop created successfully!");
        }
      } catch (error) {
        console.error("Error creating stop:", error);
        alert("Error creating stop.");
      }
    },

    async submitForm() {
      // Removed the 'travel' parameter
      try {
        console.log("Submitting travel data:", this.travel);

        // Assuming 'update-travel' expects POST request with travel data
        await this.$axios.post("update-travel", { travel: this.travel }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert("Travel updated successfully!");

        // After the update, navigate back to Home and refetch the data
        this.$router.push({ name: "home" });

        // Optionally, you could emit an event to refresh data on Home
        this.$emit("travel-updated");
      } catch (error) {
        console.error("Error updating travel:", error);
        alert("Error updating travel.");
      }
    },
    formatDate(dateString) {
      // Format the date string into a human-readable format
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    },
    async fetchStops() {
      try {
        const response = await this.$axios.get(`http://localhost:8888/get-stop?travel_id=${this.travelId}`);
        this.stops = response;
        console.log(this.stops);
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    }
  },
};
</script>