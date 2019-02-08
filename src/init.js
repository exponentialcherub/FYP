document.addEventListener('DOMContentLoaded', function () {
    initScene();
});

var initScene = function () {
    var canvas = document.getElementById('canvas');
    var engine = new BABYLON.Engine(canvas, true);
    
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White();
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.
    Vector3(5, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    //camera.checkCollisions = true;
    //camera.applyGravity = true;

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

    var chunkManager = new ChunkManager(scene, 16);
    
    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, -5), scene);
    light.intensity = 100;

    engine.runRenderLoop(function () {
        scene.render();
    });
}