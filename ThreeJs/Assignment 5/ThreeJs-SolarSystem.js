let renderer = null,
    scene = null,
    camera = null,
    controls = null,
    planetGroup = null,
    moonGroup = null,
    root = null,
    materials = {},
    textureOn = true,
    duration = 30000,
    currentTime = Date.now(),
    textureMap = null,
    bumpMap = null,
    moon = null,
    sun = null, mercury = null, venus = null, earth = null, mars = null, jupiter = null, saturn = null, uranus = null, neptune = null, pluto = null;

// Class for creating Spheres
class SphereObject {
    constructor(x,y,z,radius, textureUrl, bumpMapUrl, materialName) {
        this.materials = {};
        this.materialName = materialName;
        // Load the texture
        this.textureMap = new THREE.TextureLoader().load(textureUrl);
        // Create materials
        this.createMaterials(this.textureMap);
        this.bumpMap = new THREE.TextureLoader().load(bumpMapUrl);
        // Sphere of radius size
        this.geometry = new THREE.SphereGeometry(radius, 20, 20);
        // Sphere mesh
        this.sphere = new THREE.Mesh(this.geometry, this.materials[this.materialName]);
        // Set the sphere position
        this.sphere.position.set(x,y,z);

        // Orbit
        this.orbitGeometry = new THREE.RingGeometry( Math.abs(z), Math.abs(z)+ 1, 32 );
        this.orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
        this.orbitRing = new THREE.Mesh( this.orbitGeometry, this.orbitMaterial );
        this.orbitRing.position.set(0, 0, 0);
        this.orbitRing.rotation.x = Math.PI / 2;

        // Add orbitRing to scene
        scene.add( this.orbitRing );
    }

    createMaterials(textureMap) {
        this.materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
        this.materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
    }
};


function animate()
{
    let deltat = Date.now() - currentTime;
    currentTime = Date.now();
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract * 1.3;

    sphereGroup.rotation.y += angle;
    planetGroup.rotation.y += angle;
    moonGroup.rotation.y += angle;
    mercury.sphere.rotation.y += angle;
    venus.sphere.rotation.y += angle;
    earth.sphere.rotation.y += angle;
    mars.sphere.rotation.y += angle;
    jupiter.sphere.rotation.y += angle;
    saturn.sphere.rotation.y += angle;
    uranus.sphere.rotation.y += angle;
    neptune.sphere.rotation.y += angle;
    moon.sphere.rotation.y += angle;
    pluto.sphere.rotation.y += angle;
}

function run()
{
    requestAnimationFrame( run );
    controls.update();
    renderer.render( scene, camera );
    animate();
}

function createScene(canvas)
{
    // Create scene and renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize( canvas.width, canvas.height );
    scene = new THREE.Scene();
    // Set a background
    let stars = new THREE.TextureLoader().load("images_5/stars2.jpg");
    scene.background = stars;

    // Set the camera and controls
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 10000 );
    controls = new THREE.OrbitControls( camera, renderer.domElement );    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 150, 130, -100 );
    controls.update();

    // *************************************//
    /* Sun creation with own shader declared in the HTML file */
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
    let geometry = new THREE.SphereGeometry(37, 20, 20);
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add( sphere );
    scene.add( sphereGroup );
    // *************************************//
    /* End of sun creation. Added to scene */

    // Create all the materials
    createMaterials();

    // Create a group to hold all the objects
    planetGroup = new THREE.Object3D;

    // Add a directional light to show off the objects
    let light = new THREE.PointLight( 0xffffff, 10, 0 );
    light.position.set( 0, 30, 0 );
    scene.add( light );

    // Create 9 planets (including pluto)
    mercury = new SphereObject(0,0,-60,10,"images_5/mercury.jpg","images_5/mercury_bump.jpg","lambert-textured");
    venus = new SphereObject(0,0,120,8.5,"images_5/venus.jpg","images_5/venus_bump.jpg", "lambert-textured");
    earth = new SphereObject(0,0,-180,10,"images_5/earth.jpg","images_5/earth_bump.jpg","lambert-textured");
    mars = new SphereObject(0,0,240,6.7,"images_5/mars.jpg","images_5/mars_bump.jpg","lambert-textured");
    jupiter = new SphereObject(0,0,-300,11.20,"images_5/jupiter.jpg","","lambert-textured");
    saturn = new SphereObject(0,0,360,9.45,"images_5/saturn.jpg","","lambert-textured");
    uranus = new SphereObject(0,0,-420,4.7,"images_5/uranus.jpg","","lambert-textured");
    neptune = new SphereObject(0,0,480,3.88,"images_5/neptune.jpg","","lambert-textured");
    pluto = new SphereObject(0,0,-540,4.0,"images_5/plutomap1k.jpg","images_5/plutobump1k.jpg","lambert-textured");


    // Saturn ring
    let ringSize = 10;
    let ringGeometry = new THREE.RingGeometry( ringSize, ringSize + 7, 32 );
    let greyTexture = new THREE.TextureLoader().load('images_5/saturnringpattern.gif');
    let ringTexture = new THREE.TextureLoader().load('images_5/saturnring.jpg');
    let ringMaterial = new THREE.MeshPhongMaterial({ map: ringTexture,side: THREE.DoubleSide,transparent: true,opacity:1,alphaMap: greyTexture});
    let saturnRing = new THREE.Mesh( ringGeometry, ringMaterial );
    saturnRing.position.set(0, 0, 0);
    saturnRing.rotation.x = Math.PI / 2;
    saturn.sphere.add(saturnRing);

    // Orbit ring
    let orbitSize = 20;
    let orbitGeometry = new THREE.RingGeometry( orbitSize, orbitSize + 0.02, 32 );
    let orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
    let orbitRing = new THREE.Mesh( orbitGeometry, orbitMaterial );
    orbitRing.position.set(0, 0, 0);
    orbitRing.rotation.x = Math.PI / 2;

    // Moon part
    moonGroup = new THREE.Object3D;
    moon = new SphereObject(0,0,orbitSize,earth.radius/2,'images_5/moon.jpg','../images/moon_bump.jpg','lambert-textured');
    moonGroup.add(moon.sphere);
    moonGroup.add(orbitRing);
    earth.sphere.add(moonGroup);

    // For loading an OBJ file
    let loader = new THREE.OBJLoader();
    loader.load('images_5/satellite_obj.obj', (object) => {
        object.position.set(200,22,100);
        scene.add( object );
    });

    // Add each planet sphere to the planetGroup
    planetGroup.add( mercury.sphere );
    planetGroup.add( venus.sphere );
    planetGroup.add( earth.sphere );
    planetGroup.add( mars.sphere );
    planetGroup.add( jupiter.sphere );
    planetGroup.add( saturn.sphere );
    planetGroup.add( uranus.sphere );
    planetGroup.add( neptune.sphere );
    planetGroup.add( pluto.sphere );

    // Add the group to scene!
    scene.add( planetGroup );
}

function createMaterials(mapUrl)
{
    textureMap = new THREE.TextureLoader().load(mapUrl);
    materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
}
