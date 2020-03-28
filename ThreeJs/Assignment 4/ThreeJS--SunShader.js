// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial

let renderer = null, 
scene = null, 
camera = null,
cubeGroup = null,
cube = null,
sphereGroup = null,
sphere = null,
cone = null,
uniforms = null;

let duration = 10000; // ms
let currentTime = Date.now();

function animate()
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;

    uniforms.time.value += fract;
}

function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();            
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0.164, 0.152, 0.152);
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 3.5;
    scene.add(camera);
    
    // Add a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, .2, 1);
    scene.add( light );

    sphereGroup = new THREE.Object3D;
    
    let GLOWMAP = new THREE.TextureLoader().load("../images/sun_texture.jpg");
    let NOISEMAP = new THREE.TextureLoader().load("../images/noise.png");
    uniforms = 
    {
        time: { type: "f", value: 0.2 },
        noiseTexture: { type: "t", value: NOISEMAP },
        lavaTexture: { type: "t", value: GLOWMAP }
    };

    uniforms.noiseTexture.value.wrapS = uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
    uniforms.lavaTexture.value.wrapS = uniforms.lavaTexture.value.wrapT = THREE.RepeatWrapping;

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        transparent:true,
    } );

    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(1, 20, 20);
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    sphereGroup.add( sphere );

    scene.add( sphereGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, sphereGroup);


}



