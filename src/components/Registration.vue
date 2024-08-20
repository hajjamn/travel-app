<script>
export default {
  data() {
    return {
      newUser: {
        email: "",
        username: "",
        password: "",
      },
      showErrorAlert: false
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
          this.showErrorAlert = error.response.data.showErrorAlert
          console.error(
            "Error:",
            error.response ? error.response.data : error.message,
          );
        });
    },
  },
};
</script>

<template>
  <h1>Ciao</h1>
  <h2 v-if="showErrorAlert">ERRORE</h2>
  <form @submit.prevent="query(newUser)">
    <label for="email">Your email</label>
    <input type="email" id="email" v-model="newUser.email" placeholder="your@email.com" /><br />
    <label for="username">Username</label>
    <input type="text" id="username" v-model="newUser.username" placeholder="user" /><br />
    <label for="password">Password</label>
    <input type="password" id="password" v-model="newUser.password" /><br />
    <input type="submit" value="Submit" />
  </form>
  <div>
    <button @click="query(newUser)">Test</button>
  </div>
</template>

<style lang="scss" scoped></style>
