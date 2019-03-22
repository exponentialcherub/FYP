const pKeyCode = 112;

GUI = function(createWorldFunc, saveCallback, world, scene)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.mainMenu = new MainMenu(this.guiTexture, createWorldFunc, world, scene);
    this.mainMenu.turnOn(this.guiTexture);

    this.hud = new HUD(world.blockSelector, this.guiTexture, saveCallback, world);
    // For when a player is in world and wants to switch the HUD off.
    this.showHud = true;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        if(e.keyCode == pKeyCode && world.inGame)
        {
            if(_this.hud.active)
            {
                _this.showHud = false;
                _this.hud.turnOff(_this.guiTexture);
            }
            else
            {
                _this.showHud = true;
                _this.hud.turnOn(_this.guiTexture);
            }
        }
    });
}

GUI.prototype.update = function()
{
    if(this.hud.quit)
    {
        this.mainMenu.turnOn(this.guiTexture);
        this.hud.quit = false;
    }

    if(!this.mainMenu.active && !this.hud.active && this.showHud)
    {
        this.hud.turnOn(this.guiTexture);
    }

    if(this.hud.active)
    {
        this.hud.updateMaterial();
    }
}

GUI.prototype.quit = function()
{
    return this.hud.quit;
}

GUI.prototype.buttonPressed = function()
{
    var ret = this.hud.buttonPressed;
    this.hud.buttonPressed = false;
    return ret;
}