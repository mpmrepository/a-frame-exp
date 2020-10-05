<template>
    <div id="app">
        <Scene />
    </div>
</template>

<script>
    import Scene from './components/Scene.vue';

    export default {
        name: 'App',
        components: {
            Scene,
        },
    };
</script>

<style lang="scss">
    body, html {
        margin: 0;
        padding: 0;
        overflow: hidden;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        width: 100%;
        height: 100%;
    }

    #app {
        height: 100%;
        width: 100%;
    }
</style>
