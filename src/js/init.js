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
    
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(5, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.angularSensibility = 7000;
    camera.speed = 1;
    // Player size
    camera.ellipsoid = new BABYLON.Vector3(0.25, 1, 0.25);
    
    var world = new World();
    var gui = new GUI(createWorld, world.save, world, scene);

    // Request pointer lock
    canvas.addEventListener("click", function(e) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock && world.inGame && !gui.buttonPressed())
        {
            canvas.requestPointerLock();
        }
    }, false);

    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(1, 1, 1);
	light.groundColor = new BABYLON.Color3(0, 0, 0);

    engine.runRenderLoop(function () {
        scene.render();

        // Render loop order important here! This is due to hud.quit value change in gui.update().
        // TODO: Maybe be better to does this via an event? Amongst other gui events.
        if(gui.quit())
        {
            world.dispose();
        }

        gui.update();
    });
}

var createWorld = function(scene, world)
{
    world.createWorld(scene);
}