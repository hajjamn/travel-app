<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">
        <div class="row aling-items-center flex-column justify-content-center h-100">
          <div class="col-auto text-center">
            <h1>Hello Vue <font-awesome-icon :icon="['fab', 'vuejs']" /></h1>
            <button class="btn btn-primary" @click="logMongoDBUri">Log MongoDB URI</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AppContent',
  inject: ['mongodbUri'],
  data() {
    return {};
  },
  methods: {
    logMongoDBUri() {
      console.log(this.mongodbUri);
    }
  }
}
</script>

<style></style>
