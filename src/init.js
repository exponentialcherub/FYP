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
    camera.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    //camera.applyGravity = true;
    //camera._needMoveForGravity = true;

    // Taken from http://www.pixelcodr.com/tutos/shooter/shooter.html.
    var _this = this;
    // Request pointer lock
    canvas.addEventListener("click", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);

    // Event listener when the pointerlock is updated.
    var pointerlockchange = function (event) {
        _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
        if (!_this.controlEnabled) {
            _this.camera.detachControl(canvas);
        } else {
            _this.camera.attachControl(canvas);
        }
    };

    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    // TODO: Change this/ move it, above.

    var material = new BABYLON.StandardMaterial("textureatlas", scene);
    var textureAtlas = new BABYLON.Texture("assets/texturepack.png", scene);
    material.specularColor = BABYLON.Color3.Black();
    material.diffuseTexture = textureAtlas;
    material.backFaceCulling = true;
    material.freeze();

    var chunkManager = new ChunkManager(scene, material, 128, 16);
    
    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, -5), scene);
    light.intensity = 100;

    engine.runRenderLoop(function () {
        scene.render();
    });
}