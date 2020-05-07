let renderer, scene, camera, directionalLight, spotlight, ambientLight, pointLight, controls;
let rootGroup = new THREE.Object3D(), objLoader = new THREE.OBJLoader(), penguin = new THREE.Object3D();
let animator, duration = 10, loopAnimation = true, currentTime = Date.now();
let mapUrl = "../images/ash_uvgrid01.jpg";

// Create scene function. Entry point
function createScene(canvas)
{
    // Create scene setup with lights, floor, controls
    createSceneSetup(canvas);
    // load the Penguin OBJ
    loadObj();
}

function createSceneSetup(canvas)
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControls.target = new THREE.Vector3(0, 5, 0);

    // Create a group to hold all the objects
    let root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    directionalHelper = new THREE.DirectionalLightHelper(directionalLight);

    scene.add(directionalHelper);

    // Create and add all the lights
    directionalLight.position.set(-15, 0, -10);
    directionalLight.rotation.x = Math.PI/2;
    directionalLight.rotation.z = 135 * Math.PI / 180;

    root.add(directionalLight);

    pointLight = new THREE.PointLight (0xffffff, 0.5);
    pointLight.position.set(5, 10, -10);
    root.add(pointLight);
    pointLightHelper = new THREE.PointLightHelper( pointLight, 1);

    scene.add( pointLightHelper );

    spotLight = new THREE.SpotLight (0xffffff, 1, 20, Math.PI/4);
    spotLight.position.set(2, 2, 15);
    spotLight.target.position.set(2, 5, 4);
    root.add(spotLight);

    spotlightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotlightHelper);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.5 );
    root.add(ambientLight);

    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 2);

    let color = 0xffffff;

    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    // Add the mesh to our group
    group.add( mesh );

    // Now add the group to our scene
    scene.add( root );

    // Add the controls to the scene
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

}

// Function for setting the lights in the UI
function setLightColor(light, r, g, b, lightHelper = null)
{
    r /= 255;
    g /= 255;
    b /= 255;

    light.color.setRGB(r, g, b);

    if(lightHelper)
        lightHelper.update();
}

// Run function
function run() {
    requestAnimationFrame(_ => run());
    // Render the scene
    renderer.render(scene, camera);
    // Update the animations
    KF.update();
    // Update the camera controller
    controls.update();
}

// Load the OBJ
function loadObj() {
    objLoader.load(
        "penguin_obj/penguin.obj",
        (object) => {
            var peng_texture = new THREE.TextureLoader().load(
                "penguin_obj/peng_texture.jpg"
            );
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = peng_texture;
                }
            });
            object.scale.set(0.3, 0.3, 0.3);
            object.position.z = 0;
            object.position.x = 0;
            object.position.y = 0.1;
            // Adjust rotation
            object.rotation.y = -Math.PI / 2;
            penguin.add(object);
            scene.add(penguin);
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
        (error) => console.log("An error happened")
    );
}

// Helper for starting animator. Called from the HTML
function playAnimations() {
    animator.start();
}

// KeyFrames
function initAnimations() {
    animator = new KF.KeyFrameAnimator();
    animator.init({
        interps: [
            {
                keys: Array(figureEightLength).fill().map((value, index) => index / (figureEightLength - 1)),
                values: figureEightPoints,
                target: penguin.position
            },
            {
                keys: Array(rotationLength).fill().map((value, index) => index / (rotationLength - 1)),
                values: rotationPoints,
                target: penguin.rotation
            }
        ],
        loop: loopAnimation,
        duration: duration * 1000
    });
}

let figureEightPoints = [
    {x: 0, y: 0, z: 0,},
    {x: -8,y: 0,z: -4},
    {x: -16, y: 0, z: -8},
    {x: -24, y: 0, z: -4},
    {x: -26, y: 0, z: 0},
    {x: -24, y: 0, z: 4},
    {x: -18, y: 0, z: 8},
    {x: -8, y: 0, z: 4},
    {x: 0, y: 0, z: 0},
    {x: 8, y: 0, z: -4},
    {x: 16, y: 0, z: -8},
    {x: 24, y: 0, z: -4},
    {x: 26, y: 0, z: 0},
    {x: 24, y: 0, z: 4},
    {x: 16, y: 0, z: 8},
    {x: 8, y: 0, z: 4},
    {x: 0, y: 0, z: 0}
];
let figureEightLength = figureEightPoints.length;
let rotationPoints = [
    {x: 0, y: Math.PI/6, z: 0},
    {x: 0, y: -Math.PI/6, z: 0},
    {x: 0, y: Math.PI/5, z: 0},
    {x: 0, y: -Math.PI/5, z: 0},
    {x: 0, y: Math.PI/4, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: Math.PI/2, z: 0},
    {x: 0, y: Math.PI/3, z: 0},
    {x: 0, y: 3 * Math.PI/4, z: 0},
    {x: 0, y: 7 * Math.PI / 12, z: 0},
    {x: 0, y: 11 * Math.PI / 12, z: 0},
    {x: 0, y: 3 * Math.PI/ 4, z: 0},
    {x: 0, y:  13 * Math.PI / 12, z: 0},
    {x: 0, y: 5 * Math.PI / 6, z: 0},
    {x: 0, y: 7 * Math.PI / 6, z: 0},
    {x: 0, y: Math.PI , z: 0},
    {x: 0, y: 7 * Math.PI / 6, z: 0},
    {x: 0, y: Math.PI , z: 0},
    {x: 0, y: 5 * Math.PI / 6, z: 0},
    {x: 0, y:  13 * Math.PI / 12, z: 0},
    {x: 0, y: 3 * Math.PI/ 4, z: 0},
    {x: 0, y: 11 * Math.PI / 12, z: 0},
    {x: 0, y: 7 * Math.PI / 12, z: 0},
    {x: 0, y: 3 * Math.PI/4, z: 0},
    {x: 0, y: Math.PI/3, z: 0},
    {x: 0, y: Math.PI/2, z: 0},
    {x: 0, y: Math.PI/4, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 0, y: -Math.PI/5, z: 0},
    {x: 0, y: Math.PI/5, z: 0},
    {x: 0, y: -Math.PI/6, z: 0},
    {x: 0, y: Math.PI/6, z: 0}
];
let rotationLength = rotationPoints.length;


