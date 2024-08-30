<script>
export default {
  data() {
    return {
      destination: '',
      start_date: '',
      end_date: '',
    };
  },
  methods: {
    createTravel() {
      //collection in this case is travels and the query is the travel._id
      this.$axios
        .get("create-travel", {
          params: {
            destination: this.destination,
            start_date: this.start_date,
            end_date: this.end_date
          },
        })
        .then((response) => {
          //print response in console
          console.log(response.data);
          this.$router.push('/');
        })
        .catch((error) => {
          //print error
          console.log(error);
        });
    },
    test() {
      console.log(this.destination, this.start_date, this.end_date)
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
      <form @submit.prevent>
        <div class="row align-items-center justify-content-center">
          <div class="col-12">
            <div class="card p-3">
              <label for="destination">Name</label>
              <input type="text" id="destination" v-model="destination" placeholder="Your vacay name">
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
          <div class="col-auto mt-5">
            <button class="btn btn-brand" @click="createTravel()">Confirm planning</button>
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
