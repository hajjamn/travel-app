<script>
export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      showErrorAlert: false,
    };
  },
  methods: {
    query(dataUser) {
      this.$axios
        .get("login", {
          params: { dataUser },
        })
        .then((response) => {
          // Print response in the console
          console.log(response.headers);
          if (response.data.message === "Login successful") {
            // Navigate to another page, e.g., a dashboard
            this.$router.push("/dashboard");
          }
        })
        .catch((error) => {
          // Show error alert on UI
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
  <h1>Login</h1>
  <h2 v-if="showErrorAlert">ERRORE</h2>
  <form @submit.prevent="query(user)">
    <label for="email">Your email</label>
    <input
      type="email"
      id="email"
      v-model="user.email"
      placeholder="your@email.com"
    /><br />
    <label for="password">Password</label>
    <input type="password" id="password" v-model="user.password" /><br />
    <input type="submit" value="Submit" />
  </form>
  <div>
    <button @click="query(user)">Test</button>
  </div>
</template>

<style lang="scss" scoped></style>
