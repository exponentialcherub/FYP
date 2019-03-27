HUD = function(blockSelector, texture, saveCallback, world)
{
    this.active = false;
    this.quit = false;
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
    controlsImage.sourceHeight = 245;
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

    var saveAndQuit = BABYLON.GUI.Button.CreateSimpleButton("savequit", "Save & Quit");
    saveAndQuit.width = '100px';
    saveAndQuit.height = '50px';
    saveAndQuit.color = "black";
    saveAndQuit.fontSize = 20;
    saveAndQuit.top = "-40%";
    saveAndQuit.left = "40%";
    saveAndQuit.background = "white";
    saveAndQuit.borderColour = "black";
    this.saveAndQuitBut = saveAndQuit;

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
        // TODO: Save
        _this.buttonPressed = true;

        saveCallback.call(world);
    });
    this.saveAndQuitBut.onPointerUpObservable.add(function() {
        // TODO: Save and quit
        saveCallback.call(world);

        _this.turnOff(texture);
        _this.quit = true;
        _this.buttonPressed = true;
    });

    this.settingsBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        _this.showSettings = true;
    })

    this.prevSelected = 0; 

    this.updateMaterial();
}

HUD.prototype.turnOn = function(texture)
{
    texture.addControl(this.crosshair);
    texture.addControl(this.textureContainer);
    texture.addControl(this.saveBut);
    texture.addControl(this.saveAndQuitBut);
    texture.addControl(this.settingsBut);
    texture.addControl(this.controlsImage);

    this.active = true;
    this.quit = false;
}

HUD.prototype.turnOff = function(texture)
{
    texture.removeControl(this.crosshair);
    texture.removeControl(this.textureContainer);
    texture.removeControl(this.saveBut);
    texture.removeControl(this.saveAndQuitBut);
    texture.removeControl(this.settingsBut);
    texture.removeControl(this.controlsImage);

    this.active = false;
}

HUD.prototype.updateMaterial = function()
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