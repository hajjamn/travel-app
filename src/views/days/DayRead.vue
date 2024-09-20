<script>
export default {
    name: "DayRead",
    props: {
        id: {
            type: String, // This will be the travel ID
            required: true,
        },
        travelId: {
            type: String, // This should be the same as the id in this case
            required: true,
        },
        dayNumber: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            day: {},
            error: null,
        };
    },
    created() {
        this.fetchDay();
    },
    methods: {
        async fetchDay() {
            try {
                const response = await this.$axios.get("/fetch-day", {
                    params: {
                        id: this.id, // This should match the parameter in the API
                    },
                });
                this.day = response.data.data;
            } catch (error) {
                console.error("Error fetching day:", error);
                this.error = "Failed to load day details. Please try again later.";
            }
        },
    },
};
</script>

<template>
    <div class="container py-5">
        <!-- Non so perche' non funziona -->
        <!-- <RouterLink :to="{ name: 'travelRead', params: { id: travelId } }" class="btn btn-secondary mb-3">
            Back to Travel
        </RouterLink> -->
        <div v-if="day">
            <h1>Day {{ day.day_number }}</h1>
            <p><strong>Date:</strong> {{ new Date(day.date).toLocaleDateString() }}</p>

            <div v-if="day.stops && day.stops.length > 0">
                <h2>Stops</h2>
                <ul>
                    <li v-for="stop in day.stops" :key="stop._id">
                        <RouterLink
                            :to="{ name: 'stopRead', params: { id: stop._id, travelId: travelId, dayNumber: day.day_number } }">
                            <strong>{{ stop.title }}</strong>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>Loading day details...</p>
        </div>
    </div>
</template>