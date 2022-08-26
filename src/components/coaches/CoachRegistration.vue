<template>
  <section>
    <base-card>
      <h2>Register as a coach now!</h2>
      <coach-form @save-data="saveData"></coach-form
    ></base-card>
  </section>
</template>
<script>
import CoachForm from './CoachForm.vue';
import { useCoachesStore } from '@/store/index.js';
export default {
  setup() {
    const store = useCoachesStore();

    return {
      store,
    };
  },
  components: {
    CoachForm,
  },
  methods: {
    saveData(data) {
      this.store.registerCoach(data);
      this.$router.push('/coaches');
    },
  },
};
</script>
<style></style>
