HUD = function(blockSelector)
{
    this.active = false;

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

    this.prevSelected = 0; 

    this.updateMaterial();
}

HUD.prototype.turnOn = function(texture)
{
    texture.addControl(this.crosshair);
    texture.addControl(this.textureImage);

    this.active = true;
}

HUD.prototype.turnOff = function(texture)
{
    texture.removeControl(this.crosshair);
    texture.removeControl(this.textureImage);

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