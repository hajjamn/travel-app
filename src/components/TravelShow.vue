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
          console.log('I giorni sono: ', this.days)
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
    <h1>{{ travel.destination }}</h1>
    <p><strong>Start Date:</strong> {{ travel.start_date }}</p>
    <p><strong>End Date:</strong> {{ travel.end_date }}</p>
    <p><strong>Budget:</strong> {{ travel.budget }}</p>
    <h2>Itinerary</h2>
    <ul>
      <li v-for="(day, index) in days" :key="day._id">
        <h3>
          Day {{ index + 1 }}: {{ new Date(day.date).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year:
              'numeric'
          }) }}
        </h3>
        <strong>Stops</strong>
        <ol>
          <li v-for="stop in day.stops">{{ stop.title }}</li>
        </ol>
      </li>
    </ul>
    <RouterLink :to="{ name: 'updateTravelView', params: { id: travel._id } }" class="btn btn-brand">
      Update Travel
    </RouterLink>
  </div>
</template>
