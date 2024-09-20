<script>
export default {
    name: "TravelCard",
    props: {
        travel: Object,
        cardClass: String,
        headerClass: String,
        isOpen: Boolean,
    },
};
</script>

<template>
    <div :class="['card', cardClass, { 'card-open': isOpen }]">
        <div :class="['card-header', headerClass, 'd-flex', 'align-items-center', 'justify-content-between']">
            <RouterLink :to="{ name: 'travelRead', params: { id: travel._id } }">
                <h2 class="travel-title">{{ travel.destination }}</h2>
            </RouterLink>
            <div class="d-flex align-items-center position-relative">
                <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']"
                    @click="$emit('toggleEditMode', travel._id)" />
                <transition name="slide-fade">
                    <div v-if="isOpen" class="options-slider">
                        <button class="btn btn-secondary me-2" @click="$emit('editTravel', travel._id)">Edit</button>
                        <button class="btn btn-brand" @click="$emit('deleteTravel', travel._id)">Delete</button>
                    </div>
                </transition>
            </div>
        </div>
        <div class="card-body text-start">
            <p>
                <em>From <strong>{{ travel.start_date }}</strong> to <strong>{{ travel.end_date }}</strong></em>
            </p>
            <p>
                Day <strong>{{ travel.daysUntilStart }}</strong>
            </p>
            <p>
                Budget <strong>{{ travel.budget }}</strong>
            </p>
        </div>
    </div>
</template>

<style scoped>
.card-header .travel-title {
    text-decoration: none !important;
    color: white;
}
</style>