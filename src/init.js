document.addEventListener('DOMContentLoaded', function () {
    initScene();
});

var initScene = function () {
    var canvas = document.getElementById('canvas');
    var engine = new BABYLON.Engine(canvas, true);
    
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.White();
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.
    Vector3(5, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var box = BABYLON.Mesh.CreateBox("Box", 4.0, scene);
    var material = new BABYLON.StandardMaterial("material1",scene);
    material.diffuseTexture = new BABYLON.Texture("dirt.jpg",scene);
    box.material = material;

    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, -5), scene);

    engine.runRenderLoop(function () {
        scene.render();
    });
}