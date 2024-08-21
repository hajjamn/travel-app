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
        <h1>Let's Go on Your Next Adventure!</h1>
      </div>
    </div>
    <div class="container">
      <div class="card py-5 px-3">
        <form @submit.prevent>
          <div class="row align-items-center justify-content-center">
            <div class="col-4">
              <label for="destination">Choose your destination</label>
              <input type="text" id="destination" v-model="destination">
            </div>
            <div class="col-4">
              <label for="start_date">Choose your start_date</label>
              <input type="date" id="start_date" v-model="start_date">
            </div>
            <div class="col-4">
              <label for="end_date">Choose your end_date</label>
              <input type="date" id="end_date" v-model="end_date">
            </div>
            <div class="col-auto mt-5">
              <button class="btn btn-warning" @click="createTravel()">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
