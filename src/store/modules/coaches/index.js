import { defineStore } from 'pinia';
import getters from './getters.js';
import actions from './actions.js';
export const useCoachesStore = defineStore('coaches', {
  state: () => ({
    lastFetch: null,
    userId: null,
    token: null,
    didAutoLogout: false,
    coaches: [
      {
        id: 'c1',
        firstName: 'John',
        lastName: 'Smith',
        areas: ['frontend', 'backend', 'career'],
        description:
          "I'm John and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
        hourlyRate: 30,
      },
      {
        id: 'c2',
        firstName: 'Julie',
        lastName: 'Jones',
        areas: ['frontend', 'career'],
        description:
          'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
        hourlyRate: 30,
      },
    ],
    requests: [],
  }),
  getters,
  actions,
});
