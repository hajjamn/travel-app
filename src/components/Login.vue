<script>
export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      userLog: {
        username: "",
        email: "",
      },
      showErrorAlert: false,
    };
  },
  created() {
    this.$axios
      .get("fetch-token")
      .then((response) => {
        // Print response in the console
        console.log(response);
        this.userLog.username = response.data.user.name;
        if (response.data.message === "Login successful") {
          // Navigate to another page, e.g., a dashboard
          // this.$router.push("/dashboard");
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
  methods: {
    async logout() {
      try {
        await this.$axios.post("/logout");
        this.userLog.username = "";
        // location.reload();
      } catch (error) {
        console.error(
          "Error during logout:",
          error.response ? error.response.data : error.message
        );
      }
    },
    query(dataUser) {
      this.$axios
        .get("login", {
          params: { dataUser },
        })
        .then((response) => {
          // Print response in the console
          // console.log(response.headers);
          if (response.data.message === "Login successful") {
            this.$axios
              .get("fetch-token")
              .then((response) => {
                // Print response in the console
                // console.log(response);
                this.userLog.username = response.data.user.name;
                if (response.data.message === "Login successful") {
                  // Navigate to another page, e.g., a dashboard
                  // this.$router.push("/dashboard");
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
            // location.reload();
            // Navigate to another page, e.g., a dashboard
            // this.$router.push("/dashboard");
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
  <div v-if="userLog.username === ''">
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
  </div>
  <div v-else>
    <span class="fs-4">You are logged in as {{ userLog.username }}!</span>
    <br />
    <button class="btn btn-brand mt-3" @click="logout">Logout</button>
  </div>
</template>

<style lang="scss" scoped></style>
