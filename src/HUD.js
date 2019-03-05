HUD = function()
{
    var crosshair = new BABYLON.GUI.Image("but", "assets/mccrosshair.png");
    crosshair.width = 0.04;
    crosshair.height = 0.04;
    crosshair.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.crosshair = crosshair;
    
    // Can add material selection image here.
}

HUD.prototype.turnOn = function(texture)
{
    texture.addControl(this.crosshair);
}

HUD.prototype.turnOff = function(texture)
{
    texture.removeControl(this.crosshair);
}