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
        // Retrieve 'travelData' from the URL query parameters using Vue's $route object
        const travelData = this.$route.query.travelData;

        // Retrieve 'id' from the URL path parameters (likely to represent a specific travel item)
        const travelId = this.$route.params.id;

        // Log the entire 'params' object from the URL, which includes all path parameters
        console.log(this.$route.params);

        // Check if 'travelData' exists in the query parameters
        if (travelData) {
            try {
                // If 'travelData' exists, try parsing it from a JSON string into an actual object
                const parsedTravelData = JSON.parse(travelData);

                // Log for debugging
                console.log("Fetched travel data:", parsedTravelData);

                // Store the parsed travel data into a component's property
                this.travel = parsedTravelData;
            } catch (error) {
                // If parsing fails (e.g., if 'travelData' is not valid JSON), log an error to the console
                console.error("Error parsing travel data:", error);
            }
        } else if (travelId) {
            // If no 'travelData' is found but a 'travelId' is present, it likely means the user is navigating directly 
            // to a URL like /travel/:id and we need to fetch the travel data based on that ID

            // Log the travelId for debugging purposes
            console.log("Fetching travel data using travelId:", travelId);

            // Call a method to fetch the travel data from a server using 'travelId'
            // this.fetchTravel(travelId);

        } else {
            // If neither 'travelData' and 'travelId' is found, log an error indicating there's no relevant data to work with
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
