import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router.js';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseBadge from './components/UI/BaseBadge.vue';
import BaseSpinner from './components/UI/BaseSpinner.vue';
const BaseDialog = defineAsyncComponent(() =>
  import('./components/UI/BaseDialog.vue')
);

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.component('BaseCard', BaseCard);
app.component('BaseButton', BaseButton);
app.component('BaseBadge', BaseBadge);
app.component('BaseSpinner', BaseSpinner);
app.component('BaseDialog', BaseDialog);
app.mount('#app');
