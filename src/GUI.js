GUI = function(createWorldFunc, world, scene)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.mainMenu = new MainMenu(this.guiTexture, createWorldFunc, world, scene);
    this.mainMenu.turnOn(this.guiTexture);
    this.hud = new HUD(world.blockSelector);
    this.pauseMenu = new PauseMenu(this.guiTexture, world);
}

GUI.prototype.update = function()
{
    if(!this.pauseMenu.active && !this.mainMenu.active && !this.hud.active)
    {
        this.hud.turnOn(this.guiTexture); 
    }

    this.hud.updateMaterial();
}

GUI.prototype.pause = function()
{
    this.pauseMenu.turnOn(this.guiTexture);

    this.hud.turnOff(this.guiTexture);
}