<script>
export default {
  name: "TravelShow",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      travel: {},
      days: [],
      stops: [],
    };
  },
  created() {
    this.fetchTravelDetails();
  },
  methods: {
    fetchTravelDetails() {
      this.$axios
        .get("/fetch-travel", {
          params: { id: this.id, collection: 'travels' },
        })
        .then((response) => {
          const data = response.data.data;
          this.travel = data.travel;
          this.days = data.days;
          this.stops = data.stops;
        })
        .catch((error) => {
          console.error("Error fetching travel details:", error);
        });
    },
  },
};
</script>


<template>
  <div class="container">
    <h1>{{ travel.destination }}</h1>
    <p><strong>Start Date:</strong> {{ travel.start_date }}</p>
    <p><strong>End Date:</strong> {{ travel.end_date }}</p>
    <p><strong>Budget:</strong> {{ travel.budget }}</p>
    <h2>Itinerary</h2>
    <ul>
      <li v-for="(day, index) in days" :key="day._id">Day {{ index + 1 }} - {{ day.date }}</li>
    </ul>
    <h2>Stops</h2>
    <ul>
      <li v-for="(stop, index) in stops" :key="stop._id">Stop {{ index + 1 }} - {{ stop.title }}</li>
    </ul>
    <RouterLink :to="{ name: 'updateTravelView', params: { id: travel._id } }" class="btn btn-brand">
      Update Travel
    </RouterLink>
  </div>
</template>
