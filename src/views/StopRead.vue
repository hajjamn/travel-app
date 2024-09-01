<template>
    <div class="container py-5">
        <div v-if="stop">
            <h1>{{ stop.title }}</h1>
            <RouterLink :to="{ name: 'stopUpdate', params: { id: stop._id } }" class="btn btn-brand">
                Update Stop
            </RouterLink>
            <button class="btn btn-brand ms-3" @click="deleteStop(stop._id)">Delete</button>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>Loading stop details...</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "StopRead",
    props: {
        id: {
            type: String,
            required: true,
        },
        travelId: {
            type: String,
            required: true,
        },
        dayNumber: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            stop: null,
            error: null,
        };
    },
    created() {
        this.fetchStop();
    },
    methods: {
        async fetchStop() {
            try {
                const response = await this.$axios.get("/fetch-stop", {
                    params: {
                        collection: "stops",
                        id: this.id,
                    },
                });
                this.stop = response.data.data;
            } catch (error) {
                console.error("Error fetching stop:", error);
                this.error = "Failed to load stop details. Please try again later.";
            }
        },
        async deleteStop(stopId) {
            try {
                const response = await this.$axios.get("/delete-stop", {
                    params: { id: stopId },
                });

                if (response.data.message) {
                    alert(response.data.message);

                    // Redirect to the dayRead route
                    this.$router.push({
                        name: 'dayRead',
                        params: {
                            id: this.travelId,
                            dayNumber: this.dayNumber
                        }
                    });
                }
            } catch (error) {
                console.error(
                    "Error deleting stop:",
                    error.response ? error.response.data : error.message
                );
            }
        },
    },
};
</script>
