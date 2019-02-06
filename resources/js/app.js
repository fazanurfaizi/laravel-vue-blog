
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

// window.Vue = require('vue');
import Vue from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'iview/dist/styles/iview.css'
import VeeValidate from 'vee-validate';


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'

import GlobalProperties from '@/plugins/GlobalProperties'
import eventBus from '@/plugins/event-bus'
require('promise.prototype.finally').shim()
import interceptors from '@/helpers/interceptors'
import Error from '@/components/Error'

// and running it somewhere here
interceptors()

Vue.use(VeeValidate);
Vue.use(BootstrapVue);
Vue.use(GlobalProperties)
Vue.use(eventBus)

Vue.component('App', require('./pages/App.vue').default)
Vue.component('error', Error)

const app = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>'
});
