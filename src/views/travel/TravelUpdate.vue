<script>
export default {
  name: "UpdateTravel",
  props: ["id"],
  data() {
    return {
      travel: null, // Holds travel data
      days: [], // Holds the list of days for the travel
      stops: [],
      selectedDay: "", // Holds the ID of the selected day
      newStop: {
        title: "",
      }, // Holds new stop data (excluding day_id)
      /* Roba di tomtom */
      latitude: 0,
      longitude: 0,
      address: "",
      ttSearchBox: null,
      searchBoxHTML: null,
      markers: [],
    };
  },
  created() {
    // Fetch travel and days together using the existing fetch-travel API
    this.fetchTravelAndDays();
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    editStop(stopId) {
      this.$router.push({
        name: "stopUpdate",
        params: { id: stopId }, // Pass the stop ID as a route parameter
      });
    },
    deleteStop(collection, stopId) {
      this.$axios
        .get("/delete-stop", {
          params: {
            collection: collection,
            query: stopId,
            id: stopId, // Ensure this matches what your server expects
          },
        })
        .then((response) => {
          if (response.data.message) {
            alert(response.data.message);
          }
          this.fetchTravelAndDays();
        })
        .catch((error) => {
          console.error(
            "Error deleting travel:",
            error.response ? error.response.data : error.message
          );
        });
    },
    async fetchTravelAndDays() {
      try {
        const travelId = this.$route.params.id;

        console.log("Fetching travel with ID:", travelId);

        if (!travelId) {
          throw new Error("No travel ID provided in the route");
        }

        const response = await this.$axios.get("/fetch-travel", {
          params: {
            collection: 'travels',
            id: travelId,
          },
        });

        console.log("Full Response:", response);

        if (response.status === 200 && response.data) {
          const { travel, days, stops } = response.data.data;
          this.travel = travel;
          this.days = days;
          this.stops = stops;

          console.log("Fetched days:", this.days);
          console.log("Fetched stops:", this.stops);
        } else {
          console.error("Unexpected response structure or status:", response);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error Response:", error.response);
        } else {
          console.error("Error without response:", error);
        }
      }
    },
    async createStop() {
      try {
        const stopData = {
          travel_id: this.travel._id,
          day_id: this.selectedDay,
          title: this.newStop.title,
          latitude: this.latitude,
          longitude: this.longitude,
        };

        console.log("Stop data being sent:", stopData);

        const response = await this.$axios.post("/create-stop", stopData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response from server:", response.data);

        if (response.data.message) {
          alert("Stop created successfully!");
          this.fetchTravelAndDays();
        }
      } catch (error) {
        console.error("Error creating stop:", error);
        alert("Error creating stop.");
      }
    },
    async submitForm() {
      try {
        console.log("Submitting travel data:", this.travel);

        // Assuming 'update-travel' expects POST request with travel data
        await this.$axios.post("update-travel", { travel: this.travel }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert("Travel updated successfully!");

        // After the update, navigate back to the show and refetch the data
        this.$router.push({ name: 'travelRead', params: { id: this.travel._id } });

        // Optionally, you could emit an event to refresh data on Home
        this.$emit("travel-updated");
      } catch (error) {
        console.error("Error updating travel:", error);
        alert("Error updating travel.");
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
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
};
</script>

<template>
  <div class="container py-5">
    <h2>Update Travel Information</h2>
    <div v-if="travel">
      <form @submit.prevent="submitForm" method="POST">
        <label for="destination">Destination:</label>
        <input type="text" v-model="travel.destination" name="destination" id="destination" required /><br /><br />

        <label for="start_date">Start Date:</label>
        <input type="date" v-model="travel.start_date" name="start_date" id="start_date" required /><br /><br />

        <label for="end_date">End Date:</label>
        <input type="date" v-model="travel.end_date" name="end_date" id="end_date" required /><br /><br />

        <label for="budget">Budget:</label>
        <input type="number" v-model="travel.budget" name="budget" id="budget" step="0.01" required /><br /><br />

        <button type="submit">Update</button>
      </form>

      <!-- Stop Creation Form -->
      <h3>Create a New Stop</h3>
      <form @submit.prevent="createStop">
        <label for="stop_title">Stop Title:</label>
        <input v-model="newStop.title" type="text" id="stop_title" required /><br /><br />

        <!-- Day Selection Dropdown -->
        <label for="day_select">Select Day:</label>
        <select v-model="selectedDay" @change="onDaySelect" id="day_select" required>
          <option v-for="day in days" :key="day._id" :value="day._id">
            {{ formatDate(day.date) }}
          </option>
        </select><br /><br />

        <!-- Coordinates Inputs -->
        <label for="latitude">Latitude:</label>
        <input v-model="latitude" type="number" id="latitude" step="0.0001" required disabled /><br /><br />

        <label for="longitude">Longitude:</label>
        <input v-model="longitude" type="number" id="longitude" step="0.0001" required disabled /><br /><br />

        <button type="submit">Add Stop</button>
      </form>
      <div>
        <div v-for="stop in stops" :key="stop._id">
          <strong>{{ stop.title }}</strong>
          <button class="btn btn-secondary" @click="editStop(stop._id)">edit stop</button>
          <button class="btn btn-brand" @click="deleteStop('stops', stop._id)">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>Travel is loading...</h3>
    </div>
    <!-- MAP -->
    <section>
      <div class="container-map-search">
        <div id="search-map" class="map-flex">
          <div id="searchbar" class="searchbar-style"></div>
          <div id="map"></div>
        </div>
      </div>
    </section>
  </div>
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
</style>
