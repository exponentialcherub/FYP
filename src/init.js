document.addEventListener('DOMContentLoaded', function () {
    initScene();
});

var initScene = function () {
    var canvas = document.getElementById('canvas');
    var engine = new BABYLON.Engine(canvas, true);

    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);
    
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());
    scene.collisionsEnabled = true;
    scene.clearColor = new BABYLON.Color3(135/255, 206/255, 235/255);
    
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.
    Vector3(5, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    // Player size
    camera.ellipsoid = new BABYLON.Vector3(0.25, 1, 0.25);
    
    var world = new World();
    var gui = new GUI(createWorld, world, scene);

    // Request pointer lock
    canvas.addEventListener("click", function(e) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock && world.inGame)
        {
            canvas.requestPointerLock();
        }
    }, false);

    var pointerLockChange = function() {
        if(!document.pointerLockElement)
        {
            gui.pause();
            world.inGame = false;
        }
    };
    
    document.addEventListener("pointerlockchange", pointerLockChange, false);
    document.addEventListener("mspointerlockchange", pointerLockChange, false);
    document.addEventListener("mozpointerlockchange", pointerLockChange, false);
    document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, -5), scene);
    light.intensity = 100;

    engine.runRenderLoop(function () {
        scene.render();

        gui.update();
    });
}

var createWorld = function(scene, world)
{
    world.createWorld(scene);
}