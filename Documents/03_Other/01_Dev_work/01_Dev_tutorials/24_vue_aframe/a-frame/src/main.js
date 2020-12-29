import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.ignoredElements = ['a-scene', 'a-assets', 'a-asset-item', 'a-box', 'a-sky', 'a-cylinder', 'a-sphere', 'a-entity', 'a-plane']


new Vue({
    render: h => h(App),
}).$mount('#app')
