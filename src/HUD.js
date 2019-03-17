HUD = function(blockSelector, texture)
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
    var textureImage = new BABYLON.GUI.Image("textureimage", "assets/brick.png");
    textureImage.width = 0.1;
    textureImage.height = 0.1;
    textureImage.left = "-45%";
    textureImage.top = "40%";
    textureImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.textureImage = textureImage;

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
    });
    this.saveAndQuitBut.onPointerUpObservable.add(function() {
        // TODO: Save and quit

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
    texture.addControl(this.textureImage);
    texture.addControl(this.saveBut);
    texture.addControl(this.saveAndQuitBut);

    this.active = true;
    this.quit = false;
}

HUD.prototype.turnOff = function(texture)
{
    texture.removeControl(this.crosshair);
    texture.removeControl(this.textureImage);
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

    var src = "";
    switch(this.blockSelector.selected)
    {
        case 0:
            src = "brick.png";
            break;
        case 1:
            src = "dirt.png";
            break;
        case 2:
            src = "stone.png";
            break;
        case 3:
            src = "wood.png";
            break;
        default:
            console.error("Invalid selected block number: " + this.blockSelector.selected);
            return;
    }

    this.textureImage.source = "assets/" + src;
}