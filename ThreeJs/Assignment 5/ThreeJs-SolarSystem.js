// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial

let  renderer = null,
    scene = null,
    camera = null,
    planetGroup = null,
    cubeGroup = null,
    cube = null,
    sphereGroup = null,
    sphere = null,
    cone = null,
    materials = {},
    uniforms = null,
    sun = null,
    mercury = null,
    venus = null,
    earth = null,
    mars = null,
    jupiter = null,
    saturn = null,
    uranus = null,
    neptune = null;

let duration = 10000; // ms
let currentTime = Date.now();
let scale = 1.0;


// Class for creating spheres
class SphereObject{
    constructor(x,y,z,radius,textureURL,bumpMapURL,materialName)
    {
        this.materials = {};
        this.materialName = materialName;

        // Load the textureURL
        this.textureMap = new THREE.TextureLoader().load(textureURL);
        // TODO check this
        this.createMaterials(this.textureMap);
        // Load bump map
        this.bumpMap = new THREE.TextureLoader().load(bumpMapURL);
        // Create sphere of radius,25,25
        this.geometry = new THREE.SphereGeometry(radius,25,25);
        // Create sphere mesh with specified materialName
        this.sphere = new THREE.Mesh(this.geometry,this.materials[this.materialName]);
        // Set the sphere position
        this.sphere.position.set(x,y,z);

    }

    // TODO check this
    createMaterials(textureMap) {
        // we only need basic-textured for the sun and lambert-textured for planets and lamberd textured for others
        this.materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
        this.materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
    }
}


function animate()
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    uniforms.time.value += fract;

    //mercury.sphere.rotation.y += fract*5;
    sun.sphere.rotation.y += fract * 5;

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
    camera.position.z = 100;
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

    //scene.add( sphereGroup );

    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, sphereGroup);

    planetGroup = new THREE.Object3D;

    sun = new SphereObject(0,0,-600,50,"images_5/mercurymap.jpg","images_5/mercurybump.jpg",'basic-textured');
    mercury = new SphereObject(100,1,-600,50,"images_5/mercurymap.jpg","images_5/mercurybump.jpg","lambert-textured");

    planetGroup.add(mercury.sphere);
    //planetGroup.add(sun.sphere);


    scene.add(planetGroup);


}

function createMaterials(mapUrl)
{
    // Create a textre phong material for the cube
    // First, create the texture map
    textureMap = new THREE.TextureLoader().load(mapUrl);

    materials["line-basic"] = new THREE.LineBasicMaterial({color:0xffffff});
    materials["basic"] = new THREE.MeshBasicMaterial();
    materials["phong"] = new THREE.MeshPhongMaterial();
    materials["lambert"] = new THREE.MeshLambertMaterial();
    materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap });
    materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
}




