<script>
import { store } from "./store.js";
import AppHeader from "./layout/AppHeader.vue";
import AppContent from "./layout/AppContent.vue";
import AppFooter from "./layout/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppContent,
    AppFooter,
  },
  data() {
    return {
      store,
      userLog: {
        username: "",
        email: "",
      },
    };
  },
  created() {
    this.$axios
      .get("fetch-token")
      .then((response) => {
        // Print response in the console
        /* console.log(response); */
        this.userLog.username = response.data.user.name;
        this.userLog.email = response.data.user.email;
        if (response.data.message === "Login successful") {
          // Navigate to another page, e.g., a dashboard
          this.$router.push("Home");
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
};
</script>

<template>
  <div id="app">
    <AppHeader :name="userLog.username" :email="userLog.email"></AppHeader>
    <AppContent></AppContent>
    <!-- <AppFooter></AppFooter> -->
  </div>
</template>

<style lang="scss">
@use "bootstrap";
@use "./assets/style/general.scss";
</style>
