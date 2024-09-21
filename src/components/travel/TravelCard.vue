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
            <RouterLink :to="{ name: 'travelRead', params: { id: travel._id } }" class="travel-title">
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
    margin-bottom: 20px;
    position: relative;
    background-color: var(--neutral-gray);
}

.my-card-header {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    color: white !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
}

.my-card-header-current {
    background-color: var(--brand-color) !important;
}

.my-card-header-future {
    background-color: var(--neutral-dark-gray) !important;
}

.my-card-header-past {
    background-color: var(--past-travel-color) !important;
}

.my-card .travel-title a {
    color: inherit !important;
    text-decoration: none !important;
}

.my-card-body {
    background-color: var(--neutral-gray);
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    padding: 15px;
    z-index: 1;
}

.gear-icon {
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    z-index: 5;
}

.card-open .gear-icon {
    transform: translateX(-100%);
}

.options-slider {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: translateX(100%);
    opacity: 0;
    display: flex;
    gap: 10px;
    z-index: 5;
}

.card-open .options-slider {
    transform: translateX(0);
    opacity: 1;
}

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
