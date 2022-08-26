<template>
  <div>
    <base-dialog :show="!!error" title="An error occured." @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <coach-filter @change-filter="setFilters"></coach-filter>
    <base-card>
      <div class="controls">
        <base-button mode="outline" @click="loadCoaches">Refresh</base-button>
        <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
          >Log in to register as coach</base-button
        >
        <base-button
          v-if="!isCoach && !isLoading && isLoggedIn"
          link
          to="/register"
          >Register as Coach</base-button
        >
      </div>
      <div v-if="isLoading"><base-spinner></base-spinner></div>
      <ul v-else-if="hasCoaches">
        <coach-item
          v-for="coach in filteredCoaches"
          :key="coach.id"
          :id="coach.id"
          :firstName="coach.firstName"
          :lastName="coach.lastName"
          :rate="coach.hourlyRate"
          :areas="coach.areas"
        ></coach-item>
      </ul>
      <h3 v-else>No coaches found.</h3></base-card
    >

    <footer></footer>
  </div>
</template>
<script>
import { useCoachesStore } from '@/store/index.js';
import { storeToRefs } from 'pinia';
import CoachItem from './CoachItem.vue';
import CoachFilter from './CoachFilter.vue';
export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },
  setup() {
    const store = useCoachesStore();
    const { coaches } = storeToRefs(store);
    return {
      store,
      coaches,
    };
  },
  computed: {
    hasCoaches() {
      return !this.isLoading && this.store.hasCoaches;
    },
    isLoggedIn() {
      return this.store.isAuthenticated;
    },
    filteredCoaches() {
      return this.coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    isCoach() {
      return this.store.isCoach;
    },
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches() {
      this.isLoading = true;
      try {
        await this.store.loadCoaches();
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  created() {
    this.loadCoaches();
  },
};
</script>
<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
