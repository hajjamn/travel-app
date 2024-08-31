<script>
import { RouterLink } from "vue-router";

export default {
  name: "AppContent",
  data() {
    return {
      responseData: {}, // Initialize as an empty object
      today: new Date(),
      futureTravels: [],
      pastTravels: [],
      currentTravels: [], // New array for current travels
      openTravelId: null,
      /* Roba di tomtom */
      latitude: 0,
      longitude: 0,
      address: "",
      ttSearchBox: null,
      searchBoxHTML: null,
      markers: [],
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/fetch-all-travels")
        .then((response) => {
          this.responseData = response.data.data;
          // Reset arrays
          this.futureTravels = [];
          this.pastTravels = [];
          this.currentTravels = []; // Reset current travels

          // Separate travels into future, past, and current
          this.responseData.travels.forEach((travel) => {
            const startDate = new Date(travel.start_date);
            const endDate = new Date(travel.end_date);

            // Determine if the travel is current
            const isCurrent = this.today >= startDate && this.today <= endDate;
            travel.daysUntilStart = Math.ceil((startDate - this.today) / (1000 * 60 * 60 * 24));

            if (isCurrent) {
              console.log("Current Travel Identified:", travel);
              this.currentTravels.push(travel);
            } else if (startDate >= this.today) {
              this.futureTravels.push(travel);
            } else {
              this.pastTravels.push(travel);
            }
          });

          // Ensure reactivity by reassigning the arrays
          this.futureTravels = [...this.futureTravels];
          this.pastTravels = [...this.pastTravels];
          this.currentTravels = [...this.currentTravels];
        })
        .catch((error) => {
          console.error("Error fetching travel data:", error);
        });
    },
    /* query(collection, travelId) {
      this.$axios
        .get("/fetch-travel", {
          params: {
            collection: collection,
            query: travelId,
            id: travelId,
          },
        })
        .then((response) => {
          const travel = response.data;
          if (travel) {
            this.$router.push({
              name: "updateTravelView",
              params: {
                id: travelId,
              },
              query: {
                travelData: JSON.stringify(travel),
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error querying travel:", error);
          // Redirect only if there's no critical error
          this.$router.push({
            name: "updateTravelView",
            params: {
              id: travelId,
            },
          });
        });
    }, */
    queryDelete(collection, travelId) {
      this.$axios
        .get("/delete-travel", {
          params: {
            collection: collection,
            query: travelId,
            id: travelId, // Ensure this matches what your server expects
          },
        })
        .then((response) => {
          if (response.data.message) {
            alert(response.data.message);
          }
          this.fetchData();
        })
        .catch((error) => {
          console.error(
            "Error deleting travel:",
            error.response ? error.response.data : error.message
          );
        });
    },
    toggleEditMode(travelId) {
      // Toggle open travel ID
      this.openTravelId = this.openTravelId === travelId ? null : travelId;
    },

    initializeMap() {
      // tt è l'oggetto con tutte le info di tomtom,
      // tt.map ha le info della mappa
      // tt.services ha tutte le informazioni aggiuntive (ricerca, distanza, ecc...)

      // Se tt, tt.map, tt.services NON sono undefined => crea la mappa
      if (
        typeof tt !== "undefined" &&
        typeof tt.map !== "undefined" &&
        typeof tt.services !== "undefined"
      ) {
        // Inizializza la mappa con TomTom Key, indicazione di dove inserirla nel HTML, dove centrarla e zoom
        this.isSettingMap = true;
        let map = tt.map({
          key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
          container: "map",
          center: [0, 0],
          zoom: 15,
        });

        // inizializza il marker
        let marker = new tt.Marker({
          draggable: true,
        })
          // setta LAT e LON del marker e aggiungilo alla mappa
          .setLngLat([0, 0])
          .addTo(map);

        // Quando il marker viene spostato cambia la LAT e LON che vengono salvate
        marker.on("dragend", () => {
          let lngLat = marker.getLngLat();
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;

          // Servizi di TomTom (ricerca, distanza, ecc...)
          tt.services
            // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
            .reverseGeocode({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              position: lngLat,
            })
            // Imposta l'indirizzo (userAddress) e salvalo in this.address
            .then((response) => {
              let userAddress = response.addresses[0].address.freeformAddress;
              this.address = userAddress;
            })
            .catch((error) => {
              console.error("Reverse geocode error:", error);
            });
        });

        // Creiamo i 50 marker jankissimi
        for (let i = 0; i < 60; i++) {
          // Marker
          let element = document.createElement("div");
          element.id = `marker${i}`;
          element.classList = 'invisible';
          // Popup
          this.markers[i] = new tt.Marker({
            element: element,
            draggable: false,
          })
            // setta LAT e LON del marker e aggiungilo alla mappa
            .setLngLat([i, i])
            .addTo(map);
        }

        // Se e' stata mandata una query con le props allora prendi quelle coordinate e indirizzo
        if (this.$route.query.queryLatitude !== undefined) {
          // recupera i dati della query
          let queryLocation = [
            this.$route.query.queryLongitude,
            this.$route.query.queryLatitude,
          ];
          // centra la mappa e il marker su quelle coordinate
          map.setCenter(queryLocation);
          marker.setLngLat(queryLocation);
          this.latitude = queryLocation[1];
          this.longitude = queryLocation[0];
          this.address = this.$route.query.queryAddress;
          this.isSettingMap = false; // Set isSettingMap to false after setting query location
        }
        // Altrimenti, se necessaria la geolocalizzazione dello user
        else if (navigator.geolocation) {
          // Imposta la localizzazione dello user recuperando la sua posizione attuale
          navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            // Fai coincidere il centro della mappa e il marker con la posizione dello user (userPosition è un array con LAT e LON, è definita solo qui dentro)
            map.setCenter(userLocation);
            marker.setLngLat(userLocation);
            this.latitude = userLocation[1];
            this.longitude = userLocation[0];

            // Servizi di TomTom (ricerca, distanza, ecc...)
            tt.services
              // Chiama la funzione reverseGeocode() passando Key e coordinate salvate
              .reverseGeocode({
                key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
                position: userLocation,
              })
              // Imposta l'indirizzo (userAddress) e salvalo in this.address
              .then((response) => {
                let address = response.addresses[0].address.freeformAddress;
                this.address = address;
                this.isSettingMap = false; // Set isSettingMap to false here
              })
              .catch((error) => {
                console.error("Reverse geocode error:", error);
                this.isSettingMap = false; // Set isSettingMap to false on error
              });
          }, () => {
            this.isSettingMap = false; // Set isSettingMap to false if geolocation fails
          });
        } else {
          this.isSettingMap = false; // Set isSettingMap to false if no query or geolocation
        }

        // Inizializzazione searchbox
        let searchBoxOptions = {
          // Opzioni necessarie per la fuzzy search (Key, lingua, limite(?))
          searchOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
            limit: 5,
          },
          // Opzioni necessarie per l'autocompletamento (Key, lingua)
          autocompleteOptions: {
            key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
            language: "en-GB",
          },
          noResultsMessage: "No results found.",
        };

        // Se non esiste già un elemento con id 'advanced-search-input'
        if (!document.getElementById("advanced-search-input")) {
          // Inizializza una searchBox tramite plugin di TomTom, passando i tt.services e le opzioni per Fuzzy search e autocompletamento
          this.ttSearchBox = new tt.plugins.SearchBox(
            tt.services,
            searchBoxOptions
          );
          // Rendi la searchbox inizializzata un elemento HTML e inseriscilo come 'figlio' di #searchbar
          this.searchBoxHTML = this.ttSearchBox.getSearchBoxHTML();
          document.getElementById("searchbar").appendChild(this.searchBoxHTML);
          this.searchBoxHTML.id = "advanced-search-input";
        }

        // Prendi le informazioni selezionate dai suggerimenti e impostale come coordinate salvate, centratura della mappa e del marker
        this.ttSearchBox.on("tomtom.searchbox.resultselected", (data) => {
          let result = data.data.result;
          let lngLat = result.position;
          map.setCenter(lngLat);
          marker.setLngLat(lngLat);
          this.latitude = lngLat.lat;
          this.longitude = lngLat.lng;
          this.address = result.address.freeformAddress;
        });

        // Quando viene inserito un input nella searchbar
        this.searchBoxHTML.addEventListener("input", (event) => {
          // Imposta query come il valore inserito nell'input
          let query = event.target.value;
          tt.services
            // effettua fuzzy search
            .fuzzySearch({
              key: "VtdGJcQDaomboK5S3kbxFvhtbupZjoK0",
              query: query,
              language: "en-GB",
            })
            // In base alla risposta della fuzzy search setta le coordinate, centratura mappa, marker e indirizzo
            .then((response) => {
              if (response.results && response.results.length > 0) {
                let result = response.results[0];
                let lngLat = result.position;
                map.setCenter(lngLat);
                marker.setLngLat(lngLat);
                this.latitude = lngLat.lat;
                this.longitude = lngLat.lng;
                this.address = result.address.freeformAddress;
              }
            });
        });
      } else {
        console.error("TomTom SDK not loaded properly.");
        this.isSettingMap = false;
      }
    },


  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
      // Se hai effettuato una ricerca dalla home, fai la ricerca automatica con quei parametri
      if (this.$route.query.queryHomeSearch) {
        this.latitude = this.$route.query.queryLatitude
        this.longitude = this.$route.query.queryLongitude
        this.address = this.$route.query.queryAddress
        this.submitForm(1);
        console.log('Query home found')
      } else if (this.$route.query.queryBack) {
        this.beds = this.$route.query.queryBeds;
        this.rooms = this.$route.query.queryRooms;
        this.selectedServices = this.$route.query.queryServices;
        this.distance = this.$route.query.queryDistance;
        this.submitForm(this.$route.query.queryPage, this.$route.query.queryPosition);
        console.log('Query back con: ', this.$route.query.queryPage, this.$route.query.queryPosition)
      }
    });
  },
};
</script>


<template>
  <main>
    <section class="h-100">
      <div class="container py-5 h-100">

        <!-- MAP -->
        <section>
          <div class="container-map-search">
            <div id="search-map" class="map-flex">
              <div id="searchbar" class="searchbar-style"></div>
              <div id="map"></div>
            </div>
          </div>
        </section>



        <div class="row align-items-center flex-column justify-content-between h-100">

          <!-- No travels section -->
          <div v-if="futureTravels.length == 0 && pastTravels.length == 0 && currentTravels.length == 0"
            class="row text-center justify-content-center">
            <h3 class="text-start alignt-self-start">You have no vacays planned</h3>
            <div class="col-9 mt-3">
              <div class="card logo-card p-3 align-items-center justify-content-center">
                <div class="col-12">
                  <h2>Start planning your vacay now!</h2>
                </div>
                <div class="col-9 align-self-center">
                  <RouterLink to="/new-travel" class="logo-circle mx-auto my-3">
                    <img src="/public/logo1.png" alt="" class="logo-img" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Travels Section -->
          <div v-if="currentTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Current Travels:</h3>
            <div class="row text-center">
              <div class="col-12 mb-3" v-for="travel in currentTravels" :key="travel._id">
                <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                  <div
                    class="card-header my-card-header my-card-header-current d-flex align-items-center justify-content-between">
                    <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                      <h2 class="travel-title">{{ travel.destination }}</h2>
                    </RouterLink>
                    <div class="d-flex align-items-center position-relative">
                      <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                        @click="toggleEditMode(travel._id)" />
                      <!-- Options slider for Edit and Delete -->
                      <transition name="slide-fade">
                        <div v-if="openTravelId === travel._id" class="options-slider">
                          <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                            Edit
                          </button>
                          <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                            Delete
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="card-body my-card-body text-start">
                    <p>
                      <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                    </p>
                    <p>
                      Start in <strong>{{ travel.daysUntilStart }}</strong> days
                    </p>
                    <p>
                      Budget <strong>{{ travel.budget }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Future Travels Section -->
          <div v-if="futureTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">
              Here is your planned vacay:
            </h3>
            <div class="col-12 mb-3" v-for="travel in futureTravels" :key="travel._id">
              <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                <div
                  class="card-header my-card-header my-card-header-future d-flex align-items-center justify-content-between">
                  <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                    <h2 class="travel-title">{{ travel.destination }}</h2>
                  </RouterLink>
                  <div class="d-flex align-items-center position-relative">
                    <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                      @click="toggleEditMode(travel._id)" />
                    <!-- Options slider for Edit and Delete -->
                    <transition name="slide-fade">
                      <div v-if="openTravelId === travel._id" class="options-slider">
                        <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                          Edit
                        </button>
                        <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                          Delete
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="card-body my-card-body text-start">
                  <p>
                    <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                  </p>
                  <p>
                    Start in <strong>{{ travel.daysUntilStart }}</strong> days
                  </p>
                  <p>
                    Budget <strong>{{ travel.budget }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add travel button -->
          <div v-if="futureTravels.length != 0 || pastTravels.length != 0 || currentTravels.length != 0"
            class="col-auto m-auto text-center">
            <RouterLink to="/new-travel" class="btn btn-add fs-1 px-3">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </RouterLink>
          </div>

          <!-- Past Travels Section -->
          <div v-if="pastTravels.length > 0" class="row text-center">
            <h3 class="text-start align-self-start">Your past vacays:</h3>
            <div class="row text-center">
              <div class="col-12 mb-3" v-for="travel in pastTravels" :key="travel._id">
                <div class="card my-card" :class="{ 'card-open': openTravelId === travel._id }">
                  <div
                    class="card-header my-card-header my-card-header-past d-flex align-items-center justify-content-between">
                    <RouterLink :to="{ name: 'travelShow', params: { id: travel._id } }">
                      <h2 class="travel-title">{{ travel.destination }}</h2>
                    </RouterLink>
                    <div class="d-flex align-items-center position-relative">
                      <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                        @click="toggleEditMode(travel._id)" />
                      <!-- Options slider for Edit and Delete -->
                      <transition name="slide-fade">
                        <div v-if="openTravelId === travel._id" class="options-slider">
                          <button class="btn btn-secondary me-2" @click="query('travels', travel._id)">
                            Edit
                          </button>
                          <button class="btn btn-brand" @click="queryDelete('travels', travel._id)">
                            Delete
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <div class="card-body my-card-body text-start">
                    <p>
                      <em>{{ travel.start_date }} - {{ travel.end_date }}</em>
                    </p>
                    <p>
                      Budget <strong>{{ travel.budget }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* MAP */

#map {
  width: 100%;
  height: 500px;
}

#searchbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  width: 80%;
  max-width: 500px;
}

#search-map {
  position: relative;
}

/* Cards */

.card-header .travel-title {
  text-decoration: none !important;
  color: white;
}

.card-header .travel-title:hover {
  color: var(--brand-color);
}

.logos {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.logos img {
  height: 105px;
}

.logo-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 110px;
  background-color: var(--brand-color);
  border-radius: 50%;
  padding: 5px;
}

.logo-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.logo-circle img {
  height: 80px;
}

.logo-card {
  background-color: var(--neutral-gray);
}

/* Transition of options */

.gear-icon {
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.card-open .gear-icon {
  transform: translateX(-200%);
}

.options-slider {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transform: translateX(100%);
  opacity: 0;
}

.card-open .options-slider {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
