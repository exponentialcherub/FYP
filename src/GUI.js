GUI = function(createWorldFunc, scene)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.mainMenu = new MainMenu(this.guiTexture, createWorldFunc, scene);
    this.mainMenu.turnOn(this.guiTexture);
    this.hud = new HUD();
}

GUI.prototype.update = function(selected)
{
    if(!this.mainMenu.active)
    {
        this.hud.turnOn(this.guiTexture);
    }

    this.hud.updateMaterial(selected);
}