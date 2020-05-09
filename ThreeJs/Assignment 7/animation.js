let renderer = null,
    scene = new THREE.Scene(),
    camera = null,
    root = null,
    group = null,
    orbitControls = null,
    mixer = null,
    rootGroup = new THREE.Object3D();
let currentTime = Date.now();
let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let insect = null
let animation;
let gameOver = false;
let floorUrl = "Images/checker_large.gif";
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(), CLICKED, INTERSECTED;
let score = 0;
let id = 0;
let keyFrameAnimator = new KF.KeyFrameAnimator();
let timerInterval;
let cloningInterval;
let insects = [];
/************************************************************/
// GAME SETTING; Can be modified
let gameDuration = 60;
/* For insect creation*/
let leftSideMost = -80, rightSideMost = 80;
let farthest = -220, closest = -180;
/* For insect creation*/
let timeoutInsectCreation = 3000; // In ms
let deadLine = 100; // In (z)
let lives = 3;



async function loadFBX()
{
    let loader = promisifyLoader(new THREE.FBXLoader());

    try{
        let object = await loader.load( './Models/Spider_FBX/Spider.fbx');

        object.mixer = new THREE.AnimationMixer( scene );
        let action = object.mixer.clipAction( object.animations[ 0 ], object );
        object.animations[ 0 ].name = "run";
        object.scale.set(0.2, 0.2, 0.2);
        // Starts at the far end
        object.name = "insect";


        console.log(object.position);
        object.position.z = 70;


        action.play();


        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );

        insect = object;

        initDeadAnimation();
    }
    catch(err)
    {
        console.error( err );
    }
}

// Thanks https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function onDocumentMouseDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );


    let intersects = raycaster.intersectObjects( insects );
    console.log(" here " + insects);
    if ( intersects.length > 0 )
    {
        CLICKED = intersects[ intersects.length - 1 ].object;
        console.log(CLICKED);
        if(intersects[0].object.name === "Spider")
        {
            console.log("yes, hit!");
            console.log(intersects)
            score +=1;
            document.getElementById('score').innerText = `Score: ${score.toString()}`;
            triggerDeadAnimation(CLICKED);
            console.log(CLICKED)
            CLICKED.material.emissive.setHex( 0xfffff );
        }
    }
    else
    {
        if ( CLICKED )
            CLICKED.material.emissive.setHex( CLICKED.currentHex );
        CLICKED = null;
    }

}
function initDeadAnimation() {
    keyFrameAnimator.init({
        interps: [
            {
                keys: [0, .5, 1],
                values: [
                    {y:0},
                    {y:Math.PI},
                    {y:Math.PI * 30}
                ],
                target: insect.rotation
            }
        ],
        loop: false,
        duration: 1000
    });
}

function triggerDeadAnimation(obj)
{
    keyFrameAnimator.start();

    obj.rotation.x = -Math.PI/2
    obj.position.y = -0
    obj.dead = true;
    console.log(obj);
    window.setTimeout(()=>
    {
        insects.splice(
            insects.findIndex((insect) => insect.id === obj.id), 1);
        scene.remove(obj);
    }, 1000);
}

// Cloning function with random positions for the new clones
function actualCloning()
{
    let newInsect = cloneFbx(insect);
    newInsect.mixer = new THREE.AnimationMixer( scene );
    let action = newInsect.mixer.clipAction( newInsect.animations[ 0 ], newInsect );

    newInsect.position.x = randomIntFromInterval(leftSideMost,rightSideMost);
    newInsect.position.y = 0;
    newInsect.position.z = randomIntFromInterval(farthest,closest);

    newInsect.id = id++;

    action.play();

    scene.add(newInsect);
    insects.push(newInsect);
}


// Entry point for cloning insects. Interval can be changed by modifying the global variable timeoutInsectCreation
// Cloning interval needs to be cleared after each session
function cloneInsects()
{
    if(!gameOver)
        cloningInterval = window.setInterval(actualCloning,timeoutInsectCreation);
}

// Animate function
function animate()
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;

    if(!gameOver)
    {
        if ( insects.length > 0) {
            for (i of insects)
            {
                i.mixer.update((deltat) * 0.001);
                i.position.z += deltat * .04;
                if (i.position.z >= deadLine) {
                    lives -= 1;
                    document.getElementById('lives').innerText = `Lives: ${lives.toString()}`
                    scene.remove(i);
                    // Splice is needed, i (insect) beyond the deadLine needs to be deleted from insects array!
                    insects.splice(i, 1);
                    console.log("removing " + i);
                }
                if (lives === 0) {
                    alert("GAME OVER!")
                    gameOver = true;
                    resetGame();
                    break;
                }
            }
        }
    }
}

// Resetting game after finishing a session
function resetGame() {
    // Remove past robots from the scene
    for(let i of insects)
    {
        scene.remove(i)
    }
    insects = [];
    gameOver = false;
    lives = 3;
    gameDuration = 60;
    document.getElementById("lives").innerHTML = `Lives: ${lives}`;
    document.getElementById("playButton").innerHTML = `Play again!`;
    window.clearInterval(timerInterval);
    window.clearInterval(cloningInterval);
}

// Set timer og the game. Can be easily changed by changing the global variable "gameDuration"
function setTimer()
{
   /* let countDownDate = new Date();
    countDownDate.setSeconds(countDownDate.getSeconds() + gameDuration);
    timerInterval = setInterval(function() {
        let distance = countDownDate - currentTime;
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = `Timer: ${seconds} seconds`;
        // If the count down is finished, write some text
        if (distance < 0)
        {
            clearInterval(timerInterval);
            alert("TIME OVER");
            gameOver = true;
            resetGame();
        }
    }, 1000);*/
}

// Starts game. Activated when clicking the play button in the HTML
function startGame()
{
    cloneInsects();
    setTimer();
}

// Run loop
function run()
{
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );

    if(!gameOver)
        animate();
}

// For window resizing
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Camera, scene, lights and floor setup
function sceneSetup(canvas)
{
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 35, 180);
    scene.add(camera);

    scene.background = new THREE.Color(0x000000);

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(30, 80, 100);
    spotLight.target.position.set(0, 0, 0);
    rootGroup.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight(0x888888);
    rootGroup.add(ambientLight);

    let floorTexture = new THREE.TextureLoader().load(floorUrl);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);
    let floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 500, 50, 50),
        new THREE.MeshPhongMaterial({ color: 0xffffff, map: floorTexture, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;
    floor.castShadow = false;
    floor.receiveShadow = true;
    rootGroup.add(floor);

    scene.add(rootGroup);

}

// Create scene function
function createScene(canvas)
{
    // Camera, scene, lights and floor setup
    sceneSetup(canvas);

    // Event listeners
    window.addEventListener('mousedown', onDocumentMouseDown);
    window.addEventListener( 'resize', onWindowResize);

    // Load the FBX Object
    loadFBX();
}
