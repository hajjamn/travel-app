<script>
export default {
    name: "TravelCard",
    props: {
        travel: Object,
        cardType: String,
    },
    data() {
        return {
            isEditing: false,
        };
    },
    computed: {
        isCurrent() {
            return this.cardType === 'current';
        },
        isFuture() {
            return this.cardType === 'future';
        },
        isPast() {
            return this.cardType === 'past';
        },
        currentDay() {
            return (-1 * this.travel.daysUntilStart) + 1;
        },
        cardTypeClass() {
            if (this.isCurrent) return 'my-card-header-current';
            if (this.isFuture) return 'my-card-header-future';
            if (this.isPast) return 'my-card-header-past';
            return '';
        },
    },
    methods: {
        toggleEditMode() {
            this.isEditing = !this.isEditing;
        },
        editTravel() {
            this.$emit("edit", this.travel._id);
        },
        deleteTravel() {
            this.$emit("delete", this.travel._id);
        },
    },
};
</script>

<template>
    <div class="card my-card" :class="{ 'card-open': isEditing, [cardTypeClass]: true }">
        <div class="card-header my-card-header d-flex align-items-center justify-content-between">
            <RouterLink :to="{ name: 'travelRead', params: { id: travel._id } }">
                <h2 class="travel-title">{{ travel.destination }}</h2>
            </RouterLink>

            <div class="d-flex align-items-center position-relative">
                <font-awesome-icon class="fs-3 gear-icon" :icon="['fas', 'gear']" @click="toggleEditMode" />
                <transition name="slide-fade">
                    <div v-if="isEditing" class="options-slider">
                        <button class="btn btn-secondary me-2" @click="editTravel">Edit</button>
                        <button class="btn btn-brand" @click="deleteTravel">Delete</button>
                    </div>
                </transition>
            </div>
        </div>

        <div class="card-body my-card-body text-start">
            <p><em>From <strong>{{ travel.start_date }}</strong> to <strong>{{ travel.end_date }}</strong></em></p>

            <p v-if="isCurrent">Day <strong>{{ currentDay }}</strong></p>
            <p v-if="isFuture">Start in <strong>{{ travel.daysUntilStart }}</strong> days</p>

            <p>Budget <strong>{{ travel.budget }}</strong></p>
        </div>
    </div>
</template>

<style scoped>
.my-card {
    border: none !important;
    border-radius: 20px !important;
    overflow: hidden;
    /* Ensures content stays within rounded edges */
    margin-bottom: 20px;
    position: relative;
    /* Add relative positioning for the card */
    background-color: var(--neutral-gray);
    /* Set the background for the entire card */
}

/* Card Header Styles */
.my-card-header {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    color: white !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
    position: relative;
    /* Add relative positioning */
    z-index: 1;
    /* Ensure it stays above other elements */
}

/* Colors for different travel types */
.my-card-header-current {
    background-color: var(--brand-color) !important;
}

.my-card-header-future {
    background-color: var(--neutral-dark-gray) !important;
}

.my-card-header-past {
    background-color: var(--past-travel-color) !important;
}

/* Card Body Styling */
.my-card-body {
    background-color: var(--neutral-gray);
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    padding: 15px;
    z-index: 1;
    /* Ensure it stays above other elements */
}

/* Gear Icon Transition */
.gear-icon {
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

.card-open .gear-icon {
    transform: translateX(-200%);
}

/* Button Slider */
.options-slider {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: translateX(100%);
    /* Initially off-screen */
    opacity: 0;
    position: absolute;
    /* Absolute positioning to place the buttons correctly */
    right: 0;
    /* Align to the right */
    z-index: 10;
    /* Ensure the buttons appear above other elements */
}

.card-open .options-slider {
    transform: translateX(0);
    /* Slide into view */
    opacity: 1;
}

/* Slide-fade transition classes */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-fade-enter {
    transform: translateX(100%);
    opacity: 0;
}

.slide-fade-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>