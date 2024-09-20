<script>
export default {
    name: "UpdateStop",
    props: ["id"],
    data() {
        return {
            stop: null,
        };
    },
    created() {
        this.fetchStop();
        console.log("this.stop:", this.stop);
    },
    methods: {
        async fetchStop() {
            try {
                const stopId = this.$route.params.id;

                console.log("Fetching stop with ID:", stopId);

                if (!stopId) {
                    throw new Error("No stop ID provided in the route");
                }

                // const response = await this.$axios.get(`/fetch-stop?collection=stops&id=${stopId}`);
                const response = await this.$axios.get("/fetch-stop", {
                    params: {
                        collection: 'stops',
                        id: stopId,  // Use the travel ID from route params
                    },
                });

                console.log("Full response:", response);

                if (response.status === 200 && response.data && response.data.data) {
                    this.stop = response.data.data;

                } else {
                    console.error("Unexpected response structure or status:", response);
                }
            } catch (error) {
                console.error("Error fetching stop:", error);
            }
        },
        async updateStop() {
            try {
                const response = await this.$axios.post("/update-stop", {
                    stop: this.stop,
                });

                if (response.data.message) {
                    alert("Stop updated successfully!");
                }

                this.$router.push({ name: "home" });
            } catch (error) {
                console.error("Error updating stop:", error);
            }
        }
    }
}
</script>

<template>
    <h1>Update Stop Information</h1>

    <div v-if="stop">
        <form @submit.prevent="updateStop">
            <label for="title">Stop Title:</label>
            <input v-model="stop.title" type="text" id="title" required /><br /><br />

            <label for="latitude">Latitude:</label>
            <input v-model="stop.coordinates.latitude" type="number" step="0.0001" id="latitude" required /><br /><br />

            <label for="longitude">Longitude:</label>
            <input v-model="stop.coordinates.longitude" type="number" step="0.0001" id="longitude"
                required /><br /><br />

            <button type="submit">Update Stop</button>
        </form>
    </div>

    <div v-else>
        <p>Loading stop data...</p>
    </div>
</template>