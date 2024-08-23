<template>
    <h2>Update Travel Information</h2>
    <div v-if="travel">
        <form action="/.netlify/functions/update" method="POST" @submit.prevent="submitForm">
            <!-- Hidden field to store travel ID -->
            <input type="hidden" name="travel_id" :value="travel._id">

            <label for="destination">Destination:</label>
            <input type="text" v-model="travel.destination" name="destination" id="destination" required><br><br>

            <label for="start_date">Start Date:</label>
            <input type="date" v-model="travel.start_date" name="start_date" id="start_date" required><br><br>

            <label for="end_date">End Date:</label>
            <input type="date" v-model="travel.end_date" name="end_date" id="end_date" required><br><br>
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
            travel: null, // Holds travel data once it's available
            travelId: this.$route.params.id, // Retrieve travelId from route params
            responseData: Object // Unused for now, but you can use it for additional server responses
        };
    },
    created() {
        // Check if travelData is available via query string in the route
        const travelData = this.$route.query.travelData;
        console.log('Raw travelData from query:', travelData);
        const travelId = this.$route.params.id;
        console.log('Route params:', this.$route.params);
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
                console.log('Submitting travel data:', this.travel);
                await this.$axios.post('update-travel', this.travel);
                alert('Travel updated successfully!');
            } catch (error) {
                console.error('Error updating travel:', error);
                alert('Error updating travel.');
            }
        },

        async fetchTravel(travelId) {
            try {
                const response = await this.$axios.get('fetch-travel', {
                    params: { id: travelId },
                });
                console.log('Fetched travel data from server:', response.data);
                this.travel = response.data; // Assign the fetched travel data to `travel`
                console.log("Parsed travel data:", this.travel);
            } catch (error) {
                console.error('Error fetching travel data', error);
            }
        },
    }
};


</script>
