<script>
import { RouterLink, RouterView } from "vue-router";

export default {
  components: {},
  data() {
    return {};
  },
};
</script>

<template>
  <header>
    <section class="bg-dark">
      <div class="container py-5 text-white">
        <div class="row aling-items-center justify-content-between">
          <div class="col-auto">
            <h1 class="text-center mb-3">PlanAVacay</h1>
          </div>
          <div class="col-auto">
            <RouterLink to="/" class="btn btn-warning me-3">Home</RouterLink>
            <RouterLink to="/registration" class="btn btn-warning me-3"
              >Registration</RouterLink
            >
            <RouterLink to="/login" class="btn btn-warning">Login</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<style></style>
