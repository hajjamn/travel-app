<template>
    <h2>Update Travel Information</h2>
    <div v-if="travel">
        <form action="/.netlify/functions/update" method="POST" @submit.prevent="submitForm">
            <!-- Hidden field to store travel ID -->
            <input type="hidden" name="travel_id" :value="travel._id">

            <label for="destination">Destination:</label>
            <input type="text" v-model="travel.destination" placeholder="Enter new destination" required><br><br>

            <label for="start_date">Start Date:</label>
            <input type="date" v-model="travel.start_date" required><br><br>

            <label for="end_date">End Date:</label>
            <input type="date" v-model="travel.end_date" required><br><br>
            <button type="submit">Update</button>
        </form>
    </div>
    <div v-else>
        <h3>Travel is loading...</h3>
    </div>

</template>

<script>

export default {
    name: 'UpdateTravel',
    props: ['id'],
    data() {
        return {
            travel: null,
            travelId: this.$route.params.id,
            responseData: Object
        };
    },
    created() {
        const travelData = this.$route.query.travelData;
        const travelId = this.$route.params.id;
        console.log(this.$route.params);
        if (travelData) {
            try {
                // Parse the travelData only if it's defined
                const parsedTravelData = JSON.parse(travelData);
                console.log("Fetched travel data:", parsedTravelData);

                // Use the parsed travel data as needed in your component
                this.travel = parsedTravelData;
            } catch (error) {
                console.error("Error parsing travel data:", error);
            }
        } else if (travelId) {
            // If no travelData is found, fetch the travel data using the travelId
            console.log("Fetching travel data using travelId:", travelId);

            this.fetchTravel(travelId); // Fetch travel data from server

        } else {
            console.error("No travel data or travelId found.");
        }
    },
    methods: {
        async submitForm() {
            try {
                await this.$axios.post('/.netlify/functions/update-travel', this.travel);
                alert('Travel updated successfully!');
            } catch (error) {
                console.error('Error updating travel:', error);
                alert('Error updating travel.');
            }
        },
    }
};


</script>
