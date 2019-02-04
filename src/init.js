var voxels = [];

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

    var material = new BABYLON.StandardMaterial("material1",scene);
    material.diffuseTexture = new BABYLON.Texture("dirt.jpg",scene);
    // TODO: Specular won't turn off.
    material.specularColour = new BABYLON.Color3(0, 0, 0);
    material.backFaceCulling = true;
    
    var i, j;
    for(i = 0; i < 20; i++) {
        for(j = 0; j < 20; j++) {
            var box = BABYLON.Mesh.CreateBox("Box", 1.0, scene);
            box.material = material;
            box.position = new BABYLON.Vector3(i-10, 0, j-10);
        }
    }
    

    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, -5), scene);

    engine.runRenderLoop(function () {
        scene.render();
    });
}