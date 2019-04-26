const pKeyCode = 112;

ActiveGUI = function(world, input, camera, settingsCallback, texture)
{
    this.states = {NOVIEW : 0, HUD : 1, SETTINGS : 2, SAVE : 3, MAIN: 4};

    this.hud = new HUDView(world.blockSelector, texture, this.triggerStateChange.bind(this), this.states);
    this.settingsView = new SettingsView(settingsCallback, input, camera, texture, this.triggerStateChange.bind(this), this.states);
    this.saveView = new SaveView(input, texture, world, this.triggerStateChange.bind(this), this.states);

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        if(e.keyCode == pKeyCode)
        {
            if(_this.state == _this.states.HUD)
            {
                _this.state = _this.states.NOVIEW;
            }
            else if(_this.state == _this.states.NOVIEW)
            {
                _this.state = _this.states.HUD;
            }

            _this.stateChange = true;
        }
    });

    this.state = this.states.HUD;
    this.stateChange = false;
}

ActiveGUI.prototype.turnOn = function()
{
    this.hud.turnOn();
    this.state = this.states.HUD;

    this.active = true;
}

ActiveGUI.prototype.turnOff = function()
{
    if(this.hud.active)
    {
        this.hud.turnOff();
    }
    if(this.settingsView.active)
    {
        this.settingsView.turnOff();
    }
    if(this.saveView.active)
    {
        this.saveView.turnOff();
    }

    this.active = false;
}

ActiveGUI.prototype.update = function(stateChangeCallback)
{
    if(this.stateChange)
    {
        if(this.hud.active)
        {
            this.hud.turnOff();
        }
        if(this.settingsView.active)
        {
            this.settingsView.turnOff();
        }
        if(this.saveView.active)
        {
            this.saveView.turnOff();
        }

        if(this.state == this.states.HUD)
        {
            this.hud.turnOn();
        }
        if(this.state == this.states.SETTINGS)
        {
            this.settingsView.turnOn();
        }
        if(this.state == this.states.SAVE)
        {
            this.saveView.turnOn();
        }
        if(this.state == this.states.MAIN)
        {
            stateChangeCallback();
        }

        this.stateChange = false;
    }

    this.hud.updateMaterial();
}

ActiveGUI.prototype.triggerStateChange = function(state)
{
    if(state != this.state)
    {
        this.stateChange = true;
        this.state = state;
    }
}

ActiveGUI.prototype.lockPointerAllowed = function()
{
    if(this.saveView.active || this.settingsView.active)
    {
        return false;
    }

    return this.hud.lockPointerAllowed();
}