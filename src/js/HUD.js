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

    this.prevSelected = 0; 

    this.updateMaterial();
}

HUD.prototype.turnOn = function(texture)
{
    texture.addControl(this.crosshair);
    texture.addControl(this.textureContainer);
    texture.addControl(this.saveBut);
    texture.addControl(this.saveAndQuitBut);

    this.active = true;
    this.quit = false;
}

HUD.prototype.turnOff = function(texture)
{
    texture.removeControl(this.crosshair);
    texture.removeControl(this.textureContainer);
    texture.removeControl(this.saveBut);
    texture.removeControl(this.saveAndQuitBut);

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