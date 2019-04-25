const pKeyCode = 112;

GUI = function(createProjectCallback, settingsCallback, camera, input, world)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.mainMenu = new MainMenu(this.guiTexture, createProjectCallback, world);
    this.mainMenu.turnOn(this.guiTexture);

    // For when a player is in world and wants to switch the HUD off.
    this.showHud = true;

    this.settings = new Settings(settingsCallback, input, camera, this, this.guiTexture);
    this.saveView = new SaveView(input, this.guiTexture, this, world);
    this.hud = new HUD(world.blockSelector, this.guiTexture, this.saveView.turnOn, world);

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

GUI.prototype.update = function(world)
{
    if(this.hud.quit)
    {
        this.mainMenu.turnOn(this.guiTexture);
        this.hud.quit = false;
    }

    if(!this.mainMenu.active && !this.hud.active && this.showHud)
    {
        this.hud.turnOn(this.guiTexture);
        world.inGame = true;
    }

    if(this.hud.active)
    {
        this.hud.updateMaterial();
    }

    if(this.hud.showSettings)
    {
        this.showHud = false;
        this.hud.showSettings = false;
        
        this.hud.turnOff(this.guiTexture);
        this.settings.turnOn(this.guiTexture);
        world.inGame = false;
    }

    if(this.hud.showSaveView)
    {
        this.saveView.updateTextValues(world);
        this.showHud = false;
        this.hud.showSaveView = false;
        
        this.hud.turnOff(this.guiTexture);
        this.saveView.turnOn(this.guiTexture);
        world.inGame = false;
    }
    
    this.mainMenu.update(this.guiTexture);
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
