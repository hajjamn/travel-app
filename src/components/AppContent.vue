<script>
export default {
  name: 'AppContent',
  data() {
    return {
      responseData: Object
    };
  },
  methods: {
    test() {
      this.$axios.get('/hello')
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
</script>

<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row aling-items-center flex-column justify-content-center h-100">
          <div class="col-auto text-center">
            <h1>Hello Vue <font-awesome-icon :icon="['fab', 'vuejs']" /></h1>
            <button class="btn btn-warning" @click="test">Test</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>


<style></style>
