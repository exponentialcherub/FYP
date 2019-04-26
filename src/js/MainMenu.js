// This controls main menu guis which includes the main menu itself and the load project screen.

MainMenu = function(texture, world)
{
    this.states = {MAIN : 0, LOAD : 1, ACTIVE : 2};

    this.active = false;

    this.mainMenuView = new MainMenuView(texture, world, this.triggerStateChange.bind(this), this.states);
    this.loadProjectView = new LoadProjectView(texture, world, this.triggerStateChange.bind(this), this.states);

    this.state = this.states.MAIN;
    this.stateChange = false;
}

MainMenu.prototype.turnOn = function()
{
    this.mainMenuView.turnOn();
    this.state = this.states.MAIN;

    this.active = true;
}

MainMenu.prototype.turnOff = function()
{
    if(this.mainMenuView.active)
    {
        this.mainMenuView.turnOff();
    }
    if(this.loadProjectView.active)
    {
        this.loadProjectView.turnOff();
    }

    this.active = false;
}

MainMenu.prototype.update = function(stateChangeCallback)
{
    if(this.stateChange)
    {
        if(this.mainMenuView.active)
        {
            this.mainMenuView.turnOff();
        }
        if(this.loadProjectView.active)
        {
            this.loadProjectView.turnOff();
        }
        
        if(this.state == this.states.MAIN)
        {
            this.mainMenuView.turnOn();
        }
        if(this.state == this.states.LOAD)
        {
            this.loadProjectView.turnOn();
        }
        if(this.state == this.states.ACTIVE)
        {
            stateChangeCallback();
        }

        this.stateChange = false;
    }
}

MainMenu.prototype.triggerStateChange = function(state)
{
    if(state != this.state)
    {
        this.stateChange = true;
        this.state = state;
    }
}