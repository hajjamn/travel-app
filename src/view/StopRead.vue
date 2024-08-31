<script>
export default {
    name: "StopRead",
    props: {
        id: {
            type: String,
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
                        collection: "stops", // Assuming the collection name is "stops"
                        id: this.id,
                    },
                });
                this.stop = response.data.data;
            } catch (error) {
                console.error("Error fetching stop:", error);
                this.error = "Failed to load stop details. Please try again later.";
            }
        },
    },
};
</script>

<template>
    <div class="container py-5">
        <div v-if="stop">
            <h1>{{ stop.title }}</h1>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>Loading stop details...</p>
        </div>
    </div>
</template>
