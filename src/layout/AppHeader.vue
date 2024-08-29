<script>
export default {
  props: ["name", "email"],
  data() {
    return {};
  },
};
</script>
<template>
  <header>
    <section>
      <div class="container header-container">
        <div class="row align-items-center justify-content-between">
          <div class="col-9 logos">
            <div class="logo-circle">
              <RouterLink to="/" class="dropdown-item">
                <img src="/public/logo1.png" alt="" class="logo-img" />
              </RouterLink>
            </div>
            <div class="logo-text ms-4">
              <img src="/public/logo3.png" alt="" />
            </div>
          </div>
          <div class="col-auto">
            <!-- Il menu fa casino. Andrebbe fatto custom su js. Poi lo faro' -->
            <div class="dropdown">
              <button class="btn btn-transparent dropdown-toggle custom-dropdown-toggle me-5" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <font-awesome-icon :icon="['fas', 'bars']" />
              </button>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink to="/login" class="dropdown-item">Login</RouterLink>
                </li>
                <li>
                  <RouterLink to="/registration" class="dropdown-item">Registration</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<style scoped>
.header-container {
  padding-top: 15px;
  padding-bottom: 15px;
}

/* Qui sto levando la freccina dopo il dropdown menu che fa cagare */
.custom-dropdown-toggle::after {
  display: none;
}

/* Personalizzo il bottoncino del dropdown */
.btn-transparent {
  background-color: transparent;
  border: none;
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  font-size: 60px;
}

/* Questo e' l'effettivo dropdown */
.dropdown {
  position: relative;
  /* Ensure the dropdown menu is positioned relative to this container */
}

.dropdown-menu {
  position: absolute;
  /* Position the dropdown menu absolutely */
  top: 100%;
  /* Position it directly below the button */
  right: 0;
  /* Align it to the right side of the button */
  background-color: white;
  z-index: 1000;
  /* Ensure it appears above other content */
  min-width: 200px;
  /* Optional: Adjust based on your design */
}

/* Gestisce il layout delle immagini del logo */
.logos {
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* Assicura che le immagini del logo siano contenute */
.logos img {
  height: 105px;
}

/* Cerchio bianco intorno all'immagine del logo */
.logo-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 110px;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
}

.logo-img {
  width: 100%;
  height: auto;
  /* Questo non e' necessarissimo */
  border-radius: 50%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.logo-circle img {
  height: 100%;
}

/* Previenel'overflow orizzontale */
.container {
  max-width: 100%;
  overflow-x: hidden;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
