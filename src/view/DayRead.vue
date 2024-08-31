<script>
export default {
    name: "DayRead",
    props: {
        id: {
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
            day: {},
        };
    },
    created() {
        this.fetchDay();
    },
    methods: {
        fetchDay() {
            this.$axios
                .get("/fetch-day", {
                    params: { id: this.id },
                })
                .then((response) => {
                    this.day = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching day :", error);
                });
        },
    },
};
</script>

<template>
    <div class="container py-5">
        <h1>Day {{ dayNumber }}</h1>
        <!-- Display the  of the specific day -->
        <div v-if="day">
            <p><strong>Date:</strong> {{ new Date(day.date).toLocaleDateString() }}</p>
            <h2>Stops</h2>
            <ul>
                <li v-for="stop in day.stops" :key="stop._id">
                    <RouterLink :to="{ name: 'stopView', params: { id: stop._id } }">
                        <strong>{{ stop.title }}</strong>
                    </RouterLink>
                </li>
            </ul>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>Loading day details...</p>
        </div>
    </div>
</template>
