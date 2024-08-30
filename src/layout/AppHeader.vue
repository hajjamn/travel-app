<script>
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
  },
  methods: {
    async logout() {
      try {
        await this.$axios.post("/logout");
        window.location.href = "/login";
      } catch (error) {
        console.error(
          "Error during logout:",
          error.response ? error.response.data : error.message
        );
      }
    },
  },
};
</script>

<template>
  <header>
    <section>
      <div class="container header-container">
        <div class="row align-items-center justify-content-between">
          <RouterLink to="/" class="col-3 logos home-hover">
            <div class="logo-circle">
              <div class="dropdown-item">
                <img src="/public/logo1.png" alt="" class="logo-img" />
              </div>
            </div>
            <div class="logo-text logo-text-b ms-4">
              <img src="/public/logo3.png" alt="" />
            </div>
            <div class="logo-text logo-text-w ms-4">
              <img src="/public/logo3-w.png" alt="" />
            </div>
          </RouterLink>
          <div class="col-auto">
            <div class="dropdown">
              <button
                class="btn btn-transparent dropdown-toggle custom-dropdown-toggle me-5"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <font-awesome-icon :icon="['fas', 'bars']" />
              </button>
              <ul class="dropdown-menu">
                <template v-if="name && email">
                  <li>
                    <div class="name-dropdown">
                      Hi <strong>{{ name }}</strong
                      >!
                    </div>
                  </li>
                  <li>
                    <div class="email-dropdown">{{ email }}</div>
                  </li>
                  <li>
                    <button class="btn btn-brand mt-3" @click="logout">
                      Logout
                    </button>
                  </li>
                </template>
                <template v-else>
                  <li>
                    <RouterLink to="/login" class="dropdown-item"
                      >Login</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink to="/registration" class="dropdown-item"
                      >Registration</RouterLink
                    >
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<style scoped>
header {
  background-color: var(--brand-color);
}

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

.email-dropdown {
  color: white !important;
  font-size: 14px;
  background-color: none !important;
  text-decoration: none;
  text-align: center;
}

.name-dropdown {
  color: white !important;
  font-size: 20px;
  background-color: none !important;
  text-decoration: none;
  text-align: center;
}

.home-hover {
  position: relative;
}

.logo-text {
  position: absolute;
  left: 120px;
}

.logo-text-w {
  transition: 0.3s;
}

.home-hover:hover .logo-text-w {
  opacity: 0;
}

.logo-text-b {
  display: none;
}

.home-hover:hover .logo-text-b {
  display: block;
}

/* Questo e' l'effettivo dropdown */
.dropdown {
  position: relative;
  /* Ensure the dropdown menu is positioned relative to this container */
}

.dropdown-menu {
  position: fixed !important;
  top: 70px !important;
  left: auto !important;
  background-color: white;
  z-index: 1000 !important;
  min-width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: var(--brand-color);
  text-align: center;
  border-radius: 20px !important;
  padding: 20px;
}

.dropdown-menu li {
  width: 180px !important;
  display: flex;
  align-items: center;
}

.dropdown-item {
  border-radius: 10px !important;
  width: 180px !important;
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
  object-fit: contain;
}

.logo-circle img {
  height: 80px;
}

/* Previenel'overflow orizzontale */
.container {
  max-width: 100%;
  overflow-x: hidden;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
