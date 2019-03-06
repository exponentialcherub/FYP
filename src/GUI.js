GUI = function(createWorldFunc, world, scene)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.mainMenu = new MainMenu(this.guiTexture, createWorldFunc, world, scene);
    this.mainMenu.turnOn(this.guiTexture);
    this.hud = new HUD(world.blockSelector);
}

GUI.prototype.update = function()
{
    if(!this.mainMenu.active && !this.hud.active)
    {
        this.hud.turnOn(this.guiTexture);
    }

    this.hud.updateMaterial();
}