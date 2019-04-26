GUI = function(camera, input, world)
{
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

    this.states = {MENU : 0, ACTIVE: 1};

    this.mainMenu = new MainMenu(this.guiTexture, world);
    this.mainMenu.turnOn(this.guiTexture);
    this.activeGUI = new ActiveGUI(world, input, camera, this.guiTexture);

    this.state = this.states.MENU;
    this.stateChange = false;

    this.mainMenu.turnOn();
}

GUI.prototype.update = function()
{
    if(this.stateChange)
    {
        if(this.mainMenu.active)
        {
            this.mainMenu.turnOff();
        }
        if(this.activeGUI.active)
        {
            this.activeGUI.turnOff();
        }

        if(this.state == this.states.MENU)
        {
            this.mainMenu.turnOn();
        }
        if(this.state == this.states.ACTIVE)
        {
            this.activeGUI.turnOn();
        }

        this.stateChange = false;
    }

    this.mainMenu.update(this.triggerStateChange.bind(this));
    this.activeGUI.update(this.triggerStateChange.bind(this));
}

GUI.prototype.triggerStateChange = function()
{
    this.stateChange = true;
    
    if(this.state == this.states.MENU)
    {
        this.state = this.states.ACTIVE;
    }
    else if(this.state == this.states.ACTIVE)
    {
        this.state = this.states.MENU;
    }
}

GUI.prototype.quit = function()
{
    return this.stateChange && this.state == this.states.MENU;
}

GUI.prototype.lockPointerAllowed = function()
{
    if(this.mainMenu.active)
    {
        return false;
    }

    return this.activeGUI.lockPointerAllowed();
}
