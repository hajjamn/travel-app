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
  <div>
    <h1>{{ travel.destination }}</h1>
    <p><strong>Start Date:</strong> {{ travel.start_date }}</p>
    <p><strong>End Date:</strong> {{ travel.end_date }}</p>
    <p><strong>Budget:</strong> {{ travel.budget }}</p>
    <h2>Itinerary</h2>
    <ul>
      <li v-for="day in days" :key="day._id">{{ day.name }} - {{ day.description }}</li>
    </ul>
    <h2>Stops</h2>
    <ul>
      <li v-for="stop in stops" :key="stop._id">{{ stop.location }} - {{ stop.description }}</li>
    </ul>
    <RouterLink :to="{ name: 'updateTravelView', params: { id: travel._id } }" class="btn btn-brand">
      Update Travel
    </RouterLink>
  </div>
</template>
