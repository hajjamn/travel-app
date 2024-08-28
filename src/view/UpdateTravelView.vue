<script>
export default {
  name: "UpdateTravel",
  props: ["id"],
  data() {
    return {
      travel: null, // Holds travel data once it's available
    };
  },
  created() {
    // Retrieve the travel data string from the route query parameters
    const travelDataString = this.$route.query.travelData;
    console.log("Raw travel data from query string:", travelDataString);

    if (travelDataString) {
      try {
        // Parse the JSON string into an actual JavaScript object
        const travelData = JSON.parse(travelDataString);
        this.travel = travelData.data.travel;
        console.log(this.travel);

        // Log the parsed object for debugging
        console.log("Parsed travel data object:", travelData);

        // Now, safely access travel ID
        // const travelId = travelData.data.travel[0]._id;
        // console.log("Travel ID:", travelId);

        // Assuming you want the first entry in the "travel" array
        // if (
        //   travelData.data &&
        //   travelData.data.travel &&
        //   travelData.data.travel.length > 0
        // ) {
        //   this.travel = travelData.data.travel[0]; // Access the first travel item
        //   console.log("Fetched travel data:", this.travel);
        // } else {
        //   console.error("Travel data is missing in the response.");
        // }
      } catch (error) {
        // If parsing fails (e.g., if 'travelData' is not valid JSON), log an error to the console
        console.error("Error parsing travel data:", error);
      }
    }
  },
  methods: {
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
  },
};
</script>

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
    <h1>Start: {{ travel.destination || "No destination available" }}</h1>
  </div>
  <div v-else>
    <h3>Travel is loading...</h3>
  </div>
</template>
