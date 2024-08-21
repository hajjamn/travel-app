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
    // props: ['id'],
    created() {
        this.fetchTravel();
    },
    methods: {
        // async fetchTravel() {
        //     try {
        //         //send the request with the travel ID as a query parameter
        //         const response = await this.$axios.get(`/fetch-travel?id=${this.travelId}`);
        //         this.travel = response.data.travel;
        //         console.log(response.data.travel);
        //     } catch (error) {
        //         console.error('Error fetching travel:', error);
        //     }
        // },
        async fetchTravel() {
            this.$axios
                .get("/fetch-travel-app-data")
                .then((response) => {
                    console.log(response.data)
                })
        },
        async submitForm() {
            try {
                await this.$axios.post('/.netlify/functions/update-travel', this.travel);
                alert('Travel updated successfully!');
            } catch (error) {
                console.error('Error updating travel:', error);
                alert('Error updating travel.');
            }
        },
        query(collection, query) {
            //collection in this case is travels and the query is the travel._id
            this.$axios
                .get("fetch-travel", {
                    //make a call to our serverless function passing params
                    params: {
                        collection: collection,
                        query: query,
                        id: query,
                    },
                })
                .then((response) => {
                    //print response in console
                    console.log(response.data);
                })
                .catch((error) => {
                    //print error
                    console.log(error);
                });
        },
    }
};


</script>
