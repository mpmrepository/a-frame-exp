<template>
    <div id="scene-container">
    </div>
</template>

<script>
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import WEBGL from '../mixins/webgl';

    let container;
    let camera;
    let renderer;
    let scene;
    let mainLight;
    let ambientLight;
    let controls;
    let materials;
    let geometries;

    export default {
        name: 'Scene',
        components: {},
        mounted() {
            this.bindEvents();
            this.initialiseScene();
        },
        methods: {
            initialiseScene() {
                container = document.querySelector('#scene-container');
                scene = new THREE.Scene();
                scene.background = new THREE.Color('skyblue');

                this.createCamera();
                this.createLights();
                this.createMeshes();
                this.createRenderer();
                this.createControls();

                if (WEBGL.isWebGLAvailable()) {
                    renderer.setAnimationLoop(() => {
                        this.update();
                        this.render();
                    });
                } else {
                    const warning = WEBGL.getWebGLErrorMessage();
                    container.appendChild(warning);
                }
            },
            createCamera() {
                const fov = 35; // AKA Field of View
                const aspect = container.clientWidth / container.clientHeight;
                const near = 0.1; // the near clipping plane
                const far = 100; // the far clipping plane
                camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                camera.position.set(-5, 5, 7);
            },
            createLights() {
                ambientLight = new THREE.HemisphereLight(
                    0xddeeff, // sky color
                    0x202020, // ground color
                    0.5, // intensity
                );

                mainLight = new THREE.DirectionalLight(0xffffff, 3);
                mainLight.position.set(10, 10, 10);

                scene.add(ambientLight, mainLight);
            },
            createMeshes() {
                materials = this.createMaterials();
                geometries = this.createGeometries();
                const train = new THREE.Group();
                scene.add(train);

                const nose = new THREE.Mesh(geometries.nose, materials.body);
                nose.rotation.z = Math.PI / 2;
                nose.position.x = -1;

                const cabin = new THREE.Mesh(geometries.cabin, materials.body);
                cabin.position.set(1.5, 0.4, 0);

                const chimney = new THREE.Mesh(geometries.chimney, materials.detail);
                chimney.position.set(-2, 0.9, 0);

                const smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
                smallWheelRear.position.set(0, -0.5, 0);

                const smallWheelCenter = smallWheelRear.clone();
                smallWheelCenter.position.x = -1;

                const smallWheelFront = smallWheelRear.clone();
                smallWheelFront.position.x = -2;

                const bigWheel = smallWheelRear.clone();
                bigWheel.scale.set(2, 2, 1.25);
                bigWheel.position.set(1.5, -0.1, 0);

                train.add(
                    nose,
                    cabin,
                    chimney,
                    smallWheelRear,
                    smallWheelCenter,
                    smallWheelFront,
                    bigWheel,
                );
            },
            createGeometries() {
                const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 60);
                const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5);
                const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5, 20);
                const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 60);
                wheel.rotateX(Math.PI / 2);

                return {
                    nose, cabin, chimney, wheel,
                };
            },
            createMaterials() {
                const body = new THREE.MeshStandardMaterial({
                    color: 0xff3333, // red
                    flatShading: true,
                });
                body.color.convertSRGBToLinear();

                const detail = new THREE.MeshStandardMaterial({
                    color: 0x333333, // darkgrey
                    flatShading: true,
                });
                detail.color.convertSRGBToLinear();

                return {
                    body,
                    detail,
                };
            },
            createRenderer() {
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.gammaFactor = 2.2;
                renderer.gammaOutput = true;
                container.appendChild(renderer.domElement);
            },
            createControls() {
                controls = new OrbitControls(camera, container);
                console.log(controls);
            },
            update() {

            },
            render() {
                renderer.render(scene, camera);
            },
            bindEvents() {
                window.addEventListener('resize', this.onWindowResize, false);
            },
            onWindowResize() {
                camera.aspect = container.clientWidth / container.clientHeight;
                // update the camera's frustum
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            },
        },

    };
</script>

<style lang="scss">
    #scene-container {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #info {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        z-index: 100;
        display:block;
    }
</style>
