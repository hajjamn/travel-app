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
    };
  },
  created() {
    this.fetchTravelDetails();
  },
  methods: {
    fetchTravelDetails() {
      this.$axios
        .get("/fetch-travel", {
          params: { id: this.id },
        })
        .then((response) => {
          const data = response.data.data;
          this.travel = data.travel;
          this.days = data.days;
        })
        .catch((error) => {
          console.error("Error fetching travel details:", error);
        });
    },
  },
};
</script>


<template>
  <div class="container py-5">
    <div v-if="travel">
      <h1>{{ travel.destination }}</h1>
      <p><strong>Start Date:</strong> {{ new Date(travel.start_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', year: 'numeric'
    }) }}</p>
      <p><strong>End Date:</strong> {{ new Date(travel.end_date).toLocaleDateString('en-GB', {
      day: '2-digit', month:
        '2-digit', year: 'numeric'
    }) }}</p>
      <p><strong>Budget:</strong> {{ travel.budget }}</p>

      <h2>Itinerary</h2>
      <ul>
        <li class="day-list-item" v-for="(day, index) in days" :key="day._id">
          <RouterLink :to="{ name: 'dayRead', params: { id: travel._id, dayNumber: index + 1 } }">
            <h3 class="day-title">
              Day {{ index + 1 }}: {{ new Date(day.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit',
      year: 'numeric'
    }) }}
            </h3>
          </RouterLink>
          <strong>Stops</strong>
          <ol>
            <li v-for="stop in day.stops" :key="stop._id">{{ stop.title }}</li>
          </ol>
        </li>
      </ul>

      <RouterLink :to="{ name: 'travelUpdate', params: { id: travel._id } }" class="btn btn-brand">
        Update Travel
      </RouterLink>
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <p>Loading travel details...</p>
    </div>
  </div>
</template>

<style scoped>
.day-list-item .day-title {
  text-decoration: none !important;
  color: black;
}

.day-list-item .day-title:hover {
  color: var(--brand-color);
}
</style>
