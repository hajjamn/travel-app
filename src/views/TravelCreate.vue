<script>
export default {
  data() {
    return {
      destination: '',
      start_date: '',
      end_date: '',
      budget: '',  // Add a budget field
    };
  },
  methods: {
    createTravel() {
      this.$axios
        .get("create-travel", {
          params: {
            destination: this.destination,
            start_date: this.start_date,
            end_date: this.end_date,
            budget: this.budget,  // Include budget in the request
          },
        })
        .then((response) => {
          console.log(response.data);
          this.$router.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    test() {
      console.log(this.destination, this.start_date, this.end_date, this.budget);
    }
  },
};
</script>

<template>
  <section>
    <div class="container py-3">
      <div class="row text-center">
        <h1>Your next vacay</h1>
      </div>
    </div>
    <div class="container py-5">
      <form @submit.prevent="createTravel">
        <div class="row align-items-center justify-content-center">
          <div class="col-12">
            <div class="card p-3">
              <label for="destination">Destination</label>
              <input type="text" id="destination" v-model="destination" placeholder="Your vacay destination">
            </div>
          </div>
          <div class="col-6 mt-3">
            <div class="card p-3">
              <label for="start_date">Starting date:</label>
              <input type="date" id="start_date" v-model="start_date">
            </div>
          </div>
          <div class="col-6 mt-3">
            <div class="card p-3">
              <label for="end_date">Ending date:</label>
              <input type="date" id="end_date" v-model="end_date">
            </div>
          </div>
          <div class="col-12 mt-3">
            <div class="card p-3">
              <label for="budget">Budget:</label>
              <input type="number" id="budget" v-model="budget" placeholder="Your budget">
            </div>
          </div>
          <div class="col-auto mt-5">
            <button class="btn btn-brand" @click="createTravel">Confirm planning</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.card {
  background-color: var(--neutral-gray);
}
</style>
