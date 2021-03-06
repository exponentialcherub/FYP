document.addEventListener('DOMContentLoaded', function () {
    initScene();
});

// The entry point of the application, setups Babylon including the engine, scene, camera and light.
// Some of these should be abstracted out to allow for configurable cameras/lighting snd potentially multiple
// scenes.
var initScene = function () {
    var canvas = document.getElementById('canvas');
    var engine = new BABYLON.Engine(canvas, true);

    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);
    
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.clearColor = new BABYLON.Color3(135/255, 206/255, 235/255);
    
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(5, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var input = configureCameraInput(camera);
    camera.checkCollisions = true;
    
    // Player size
    camera.ellipsoid = new BABYLON.Vector3(0.25, 1, 0.25);
    // Mouse sensitivity
    camera.angularSensibility = 7000;
    // Acceleration of camera
    camera.inertia = 0.55;
    
    var world = new World(scene);
    var gui = new GUI(camera, input, world);

    // Request pointer lock
    canvas.addEventListener("click", function(e) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock && gui.lockPointerAllowed())
        {
            canvas.requestPointerLock();
        }
    }, false);

    // This light covers the whole scene, should consider adding configurable lighting. This would allow
    // users to model night/day and give a better look at their structures in general.
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(1, 1, 1);
	light.groundColor = new BABYLON.Color3(0, 0, 0);

    engine.runRenderLoop(function () {
        scene.render();
        
        if(gui.quit())
        {
            world.dispose();
        }

        gui.update(world, camera);
    });
}

// Configures camera to move in line with y-axis, easier to place blocks when moving. 
// Code modified from: https://doc.babylonjs.com/how_to/customizing_camera_inputs#with-javascript.
var configureCameraInput = function(camera, input)
{
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

    // Create our own manager:
    var FreeCameraKeyboardCustomInput = function () {
            this._keys = [];
            this.keysLeft = [65];
            this.keysRight = [68];
            this.keysForward = [87];
            this.keysBack = [83];
            this.keysUp = [32];
            this.keysDown = [16];
            this.sensibility = 0.25;
    }

    // Hooking keyboard events
    FreeCameraKeyboardCustomInput.prototype.attachControl = function (element, noPreventDefault) {
        var _this = this;
        if (!this._onKeyDown) 
        {
            element.tabIndex = 1;
            this._onKeyDown = function (evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    _this.keysForward.indexOf(evt.keyCode) !== -1 ||
                    _this.keysBack.indexOf(evt.keyCode) !== -1 ||
                    _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDown.indexOf(evt.keyCode) !== -1) {
                    var index = _this._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        _this._keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this._onKeyUp = function (evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    _this.keysForward.indexOf(evt.keyCode) !== -1 ||
                    _this.keysBack.indexOf(evt.keyCode) !== -1 ||
                    _this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    _this.keysDown.indexOf(evt.keyCode) !== -1) {
                    var index = _this._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        _this._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };

            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
            BABYLON.Tools.RegisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ]);
        }
    };

    // Unhook
    FreeCameraKeyboardCustomInput.prototype.detachControl = function (element) {
        if (this._onKeyDown) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            BABYLON.Tools.UnregisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ]);
            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
        }
    };

    // This function is called by the system on every frame
    FreeCameraKeyboardCustomInput.prototype.checkInputs = function () {
        if (this._onKeyDown) {
            var camera = this.camera;
            // Keyboard
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera.position.x -= this.sensibility * camera.getDirection(BABYLON.Axis.X).x;
                    camera.position.z -= this.sensibility * camera.getDirection(BABYLON.Axis.X).z;
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera.position.x += this.sensibility * camera.getDirection(BABYLON.Axis.X).x;
                    camera.position.z += this.sensibility * camera.getDirection(BABYLON.Axis.X).z;
                }
                else if (this.keysForward.indexOf(keyCode) !== -1) {
                    var forward = BABYLON.Vector3.Cross(camera.getDirection(BABYLON.Axis.X), (BABYLON.Axis.Y));
                    camera.position.x += this.sensibility * forward.x;
                    camera.position.z += this.sensibility * forward.z;
                }
                else if (this.keysBack.indexOf(keyCode) !== -1) {
                    var forward = BABYLON.Vector3.Cross(camera.getDirection(BABYLON.Axis.X), (BABYLON.Axis.Y));
                    camera.position.x -= this.sensibility * forward.x;
                    camera.position.z -= this.sensibility * forward.z;
                }
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera.position.y -= this.sensibility;
                }
                else if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera.position.y += this.sensibility;
                }
            }
        }
    };
    FreeCameraKeyboardCustomInput.prototype.getTypeName = function () {
        return "FreeCameraKeyboardCustomInput";
    };
    FreeCameraKeyboardCustomInput.prototype._onLostFocus = function (e) {
        this._keys = [];
    };
    FreeCameraKeyboardCustomInput.prototype.getSimpleName = function () {
        return "keyboardCustom";
    };

    // Connect to camera:
    input = new FreeCameraKeyboardCustomInput();
    camera.inputs.add(input);
    return input;
}