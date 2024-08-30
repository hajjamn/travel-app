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
                window.location.href = "/";

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
    <div class="container py-5">
      <div class="row flex-column align-items-center justify-content-center">
        <div class="col-auto text-center">
          <h1>Login</h1>
        </div>
        <div class="col-auto text-center">
          <h2 v-if="showErrorAlert">ERRORE</h2>
        </div>
        <form @submit.prevent="query(user)" class="d-flex flex-column justify-content-center align-items-center">
          <div class="log-form-container">
            <div class="col-auto text-center">
              <label for="email" class="d-block">Your email</label>
              <input
                type="email"
                id="email"
                class="input-bar"
                v-model="user.email"
                placeholder="your@email.com"
              /><br />
            </div>
            <div class="col-auto text-center mt-3">
              <label for="password" class="d-block">Password</label>
              <input
                type="password"
                id="password"
                class="input-bar"
                v-model="user.password"
              /><br />
            </div>
          </div>
          <div class="col-auto text-center mt-4">
            <input class="btn btn-brand" type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.log-form-container {
  background-color: var(--brand-color);
  padding: 30px;
  margin: 20px;
  border-radius: 25px;
  color: white;
}

.input-bar {
  border: none;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 3px;
}

</style>
