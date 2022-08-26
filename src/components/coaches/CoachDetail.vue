<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>{{ rate }}/hour</h3></base-card
      >
    </section>
    <section>
      <base-card>
        <h2>Interested? Reach out now!</h2>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge
          v-for="area in selectedCoach.areas"
          :key="area"
          :type="area"
          :title="area"
          >{{}}</base-badge
        >
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>
<script>
import { useCoachesStore } from '@/store/index.js';
export default {
  props: ['id'],
  data() {
    return {
      selectedCoach: null,
    };
  },
  setup() {
    const store = useCoachesStore();

    return {
      store,
    };
  },
  computed: {
    fullName() {
      return this.selectedCoach.firstName + ' ' + this.selectedCoach.lastName;
    },
    areas() {
      return this.selectedCoach.areas;
    },
    rate() {
      return this.selectedCoach.hourlyRate;
    },
    description() {
      return this.selectedCoach.description;
    },
  },
  created() {
    this.selectedCoach = this.store.getCoaches.find(
      (coach) => coach.id === this.id
    );
  },
};
</script>
<style></style>
