HUDView = function(blockSelector, texture, stateChangeCallback, states)
{
    this.texture = texture;
    this.active = false;
    this.buttonPressed = false;

    var crosshair = new BABYLON.GUI.Image("crosshair", "assets/mccrosshair.png");
    crosshair.width = 0.04;
    crosshair.height = 0.04;
    crosshair.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.crosshair = crosshair;
    
    this.blockSelector = blockSelector;
    var textureImage = new BABYLON.GUI.Image("textureimage", "assets/texturepack.png");
    textureImage.width = 1;
    textureImage.height = 1;
    textureImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    textureImage.sourceTop = 0;
    textureImage.sourceLeft = 0;
    textureImage.sourceWidth = 100;
    textureImage.sourceHeight = 100;
    this.textureImage = textureImage;

    var controlsImage = new BABYLON.GUI.Image("controls", "assets/Controls.png");
    controlsImage.width = "160px";
    controlsImage.height = "185px";
    controlsImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    controlsImage.sourceTop = 0;
    controlsImage.sourceLeft = 0;
    controlsImage.sourceWidth = 202;
    controlsImage.sourceHeight = 268;
    controlsImage.left = "-43.5%";
    controlsImage.top = "-35%";
    controlsImage.alpha = 0.8;
    this.controlsImage = controlsImage;

    var textureContainer = new BABYLON.GUI.Rectangle();
    textureContainer.width = "100px";
    textureContainer.height = "100px";
    textureContainer.left = "-45%";
    textureContainer.top = "40%";
    textureContainer.cornerRadius = 0;
    textureContainer.color = "Black";
    textureContainer.thickness = 8;
    textureContainer.background = "green";
    this.textureContainer = textureContainer;
    this.textureContainer.addControl(this.textureImage);

    var save = BABYLON.GUI.Button.CreateSimpleButton("save", "Save");
    save.width = '100px';
    save.height = '50px';
    save.color = "black";
    save.fontSize = 20;
    save.top = "-40%";
    save.left = "30%";
    save.background = "white";
    save.borderColour = "black";
    this.saveBut = save;

    var quit = BABYLON.GUI.Button.CreateSimpleButton("savequit", "Quit");
    quit.width = '100px';
    quit.height = '50px';
    quit.color = "black";
    quit.fontSize = 20;
    quit.top = "-40%";
    quit.left = "40%";
    quit.background = "white";
    quit.borderColour = "black";
    this.quitBut = quit;

    var settings = BABYLON.GUI.Button.CreateSimpleButton("settings", "Settings");
    settings.width = '100px';
    settings.height = '50px';
    settings.color = "black";
    settings.fontSize = 20;
    settings.top = "40%";
    settings.left = "40%";
    settings.background = "white";
    settings.borderColour = "black";
    this.settingsBut = settings;

    var _this = this;
    this.saveBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.SAVE);
    });
    this.quitBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.MAIN);
    });

    this.settingsBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.SETTINGS);
    })

    this.prevSelected = 0; 

    this.updateMaterial();
}

HUDView.prototype.turnOn = function()
{
    this.texture.addControl(this.crosshair);
    this.texture.addControl(this.textureContainer);
    this.texture.addControl(this.saveBut);
    this.texture.addControl(this.quitBut);
    this.texture.addControl(this.settingsBut);
    this.texture.addControl(this.controlsImage);

    this.active = true;
}

HUDView.prototype.turnOff = function()
{
    this.texture.removeControl(this.crosshair);
    this.texture.removeControl(this.textureContainer);
    this.texture.removeControl(this.saveBut);
    this.texture.removeControl(this.quitBut);
    this.texture.removeControl(this.settingsBut);
    this.texture.removeControl(this.controlsImage);

    this.active = false;
}

HUDView.prototype.updateMaterial = function()
{
    if(this.prevSelected == this.blockSelector.selected)
    {
        return;
    }
    this.prevSelected = this.blockSelector.selected;

    var noMaterials = getNoMaterials();
    if(this.blockSelector.selected > noMaterials)
    {
        console.error("Invalid selected block number: " + this.blockSelector.selected);
    }

    this.textureImage.sourceLeft = (this.blockSelector.selected * 100);
}

HUDView.prototype.lockPointerAllowed = function()
{
    var pressed = this.buttonPressed;
    this.buttonPressed = false;
    return !pressed;
}