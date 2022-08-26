import { createRouter, createWebHistory } from 'vue-router';

import NotFound from './components/NotFound';
import CoachesList from './components/coaches/CoachesList.vue';

const CoachDetail = () => import('./components/coaches/CoachDetail.vue');
const CoachesRegistration = () =>
  import('./components/coaches/CoachRegistration.vue');
const ContactCoach = () => import('./components/requests/ContactCoach.vue');
const RequestsReceived = () =>
  import('./components/requests/RequestsReceived.vue');
const UserAuth = () => import('./components/auth/UserAuth.vue');

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true,
      children: [
        {
          path: 'contact',
          component: ContactCoach,
        }, //coaches/id/contact
      ],
    },
    {
      path: '/register',
      component: CoachesRegistration,
      meta: { requiresAuth: true },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: { requiresAuth: true },
    },
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound },
  ],
});

import { useCoachesStore } from '@/store/index.js';

router.beforeEach((to) => {
  const store = useCoachesStore();
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return '/auth';
  } else if (to.meta.requiresUnauth && store.isAuthenticated) {
    return '/coaches';
  }
});
