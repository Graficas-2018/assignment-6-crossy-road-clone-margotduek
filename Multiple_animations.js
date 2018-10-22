var renderer = null,
scene = null,
camera = null,
root = null,
robot_idle = null,
robot = null,
robot_attack = null,
flamingo = null,
stork = null,
group = null,
orbitControls = null;


var created = 0,
dead = 0,
alive = 0;

var robots = [];

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/pasto.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

var robot_mixer = {};
var deadAnimator;
var morphs = [];

var duration = 20000; // ms
var currentTime = Date.now();

var animation = "run";

function changeAnimation(animation_text)
{
    animation = animation_text;

function create_robot(event)
{
  for (var i = 0; i < 5; i++) {

    console.log("Cloning robot");

    var newRobot = cloneFbx(robot_idle);
    newRobot.mixer =  new THREE.AnimationMixer( scene );
    var action = newRobot.mixer.clipAction( newRobot.animations[ 0 ], newRobot );
    action.play();
    console.log(robots);

    //robot_mixer["run"] = new THREE.AnimationMixer( scene );
    newRobot.scale.set(0.01, 0.01, 0.01);
    newRobot.position.y -= 0;
    newRobot.position.z -= 100;
    var rn = Math.floor(Math.random() * 90);
    if(rn%2){
      rn = rn * -1;
    }
    newRobot.position.x -= rn;


    robots.push(newRobot);
    scene.add( newRobot );

    createDeadAnimation();
    created += 1;

    alive += 1;
  }
}


    if(animation =="dead")
    {
        createDeadAnimation();
    }
    else
    {
        robot_idle.rotation.x = 0;
        robot_idle.position.y = -4;
    }
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function createDeadAnimation()
{

}

function loadFBX()
{
    var loader = new THREE.FBXLoader();
    loader.load( '../models/Robot/robot_run.fbx', function ( object )

    {
        robot_mixer["idle"] = new THREE.AnimationMixer( scene );
        object.scale.set(0.01, 0.01, 0.01);
        object.position.y -= 4;
        object.position.z -= 100;

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        robot_idle = object;
        // robots.push(robot_idle);
        scene.add( robot_idle );

        createDeadAnimation();

        robot_mixer["idle"].clipAction( object.animations[ 0 ], robot_idle ).play();

        loader.load( '../models/Robot/robot_atk.fbx', function ( object )
        {
            robot_mixer["attack"] = new THREE.AnimationMixer( scene );
            robot_mixer["attack"].clipAction( object.animations[ 0 ], robot_idle ).play();
        } );

        loader.load( '../models/Robot/robot_run.fbx', function ( object )
        {
            robot_mixer["run"] = new THREE.AnimationMixer( scene );
            robot_mixer["run"].clipAction( object.animations[ 0 ], robot_idle ).play();
            // robots.push(robot_mixer);
        } );

        loader.load( '../models/Robot/robot_walk.fbx', function ( object )
        {
            robot_mixer["walk"] = new THREE.AnimationMixer( scene );
            robot_mixer["walk"].clipAction( object.animations[ 0 ], robot_idle ).play();
        } );
    } );

}

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    //
    // if(robot_idle && robot_mixer[animation])
    // {
    //     robot_mixer[animation].update(deltat * 0.001);
    //     for(robot of robots){
    //       robot.mixer.update(deltat * 0.001);
    //       // robot.position.z += 0.09;
    //     }
    //
    // }

    //*************** aqui se mueve
    // robot_idle.position.z += 0.09;

    if (robot_idle.position.y < -13) {
      robot_idle.position.y += 0.04;
    }
}

function run() {
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        // animate();

        // Update the camera controller
        // orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    light.color.setRGB(r, g, b);
}

//
// function create_robot(event)
// {
//   for (var i = 0; i < 5; i++) {
//
//     console.log("Cloning robot");
//
//     var newRobot = cloneFbx(robot_idle);
//     newRobot.mixer =  new THREE.AnimationMixer( scene );
//     var action = newRobot.mixer.clipAction( newRobot.animations[ 0 ], newRobot );
//     action.play();
//     console.log(robots);
//
//     //robot_mixer["run"] = new THREE.AnimationMixer( scene );
//     newRobot.scale.set(0.01, 0.01, 0.01);
//     newRobot.position.y -= 0;
//     newRobot.position.z -= 100;
//     var rn = Math.floor(Math.random() * 90);
//     if(rn%2){
//       rn = rn * -1;
//     }
//     newRobot.position.x -= rn;
//
//
//     robots.push(newRobot);
//     scene.add( newRobot );
//
//     createDeadAnimation();
//     created += 1;
//
//     alive += 1;
//   }
// }
//

function onDocumentMouseDown(event)
{
    event.preventDefault();
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0 )
    {
        CLICKED = intersects[ 0 ].object;

        console.log("killing robot");
        // ******** desaparecer monstruito
        scene.remove(CLICKED.parent);
        document.getElementById("matados").innerHTML = dead;



    }
    else
    {
        if ( CLICKED )
            CLICKED.material.emissive.setHex( CLICKED.currentHex );

        CLICKED = null;
    }
}

function onKeyDown(event)
{
    switch(event.keyCode)
    {
        case 38:
            console.log("up");
            robot_idle.position.z += 5.09;
            dead +=1;
            document.getElementById("matados").innerHTML = dead;
            break;

        case 39:
            console.log("right");
            robot_idle.position.x += 5.09;
            break;

        case 37:
            console.log("left");
            robot_idle.position.x -= 5.09;
            break;
    }

}


function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-15, 6, 30);
    scene.add(camera);

    // orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // spotLight = new THREE.SpotLight (0xffffff);
    // spotLight.position.set(-30, 8, -10);
    // spotLight.target.position.set(-2, 0, -2);
    // root.add(spotLight);

    // spotLight.castShadow = true;
    //
    // spotLight.shadow.camera.near = 1;
    // spotLight.shadow.camera.far = 200;
    // spotLight.shadow.camera.fov = 45;
    //
    // spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    // spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xffffff );
    root.add(ambientLight);

    // Create the objects
    loadFBX();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1, 1);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;


    // Add the mesh to our group
    group.add( mesh );robot
    mesh.castShadow = false;
    mesh.receiveShadow = true;


    // Now add the group to our scene
    scene.add( root );

}
