<script>
export default {
  data() {
    return {
      newUser: {
        email: "",
        username: "",
        password: "",
      },
      showErrorAlert: false,
    };
  },
  methods: {
    query(dataUser) {
      // Make a GET request to the serverless function, passing form data as params
      this.$axios
        .get("registration", {
          params: { dataUser },
        })
        .then((response) => {
          // Print response in the console
          console.log(response.data.message);
        })
        .catch((error) => {
          // Print error in the console
          this.showErrorAlert = error.response.data.showErrorAlert;
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
        });
    },
  },
};
</script>

<template>
  <section>
    <div class="container">
      <div class="row flex-column justify-content-center align-items-center text-center">
        <h1>Ciao</h1>
        <h2 v-if="showErrorAlert">ERRORE</h2>
        <form @submit.prevent="query(newUser)" class="d-flex flex-column justify-content-center align-items-center">
          <div class="col-6 mb-3">
            <label for="email" class="d-block">Your email</label>
            <input type="email" id="email" v-model="newUser.email" placeholder="your@email.com" /><br />
          </div>
          <div class="col-6 mb-3">
            <label for="username" class="d-block">Username</label>
            <input type="text" id="username" v-model="newUser.username" placeholder="user" /><br />
          </div>
          <div class="col-6 mb-3">
            <label for="password" class="d-block">Password</label>
            <input type="password" id="password" v-model="newUser.password" /><br />
          </div>


          <input type="submit" value="Submit" />
        </form>
        <!-- <div>
          <button @click="query(newUser)">Test</button>
        </div> -->
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
