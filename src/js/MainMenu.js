MainMenu = function(texture, createProjectCallback, world)
{
    this.active = false;
    this.buttonsActive = false;

    var title = new BABYLON.GUI.TextBlock();
    title.text = "Web Voxels";
    title.color = "black";
    title.fontSize = 48;
    title.top = "-40%";
    this.title = title;

    var createWorld = BABYLON.GUI.Button.CreateSimpleButton("createWorld", 'Create Project');
    createWorld.width = '250px';
    createWorld.height = '30px';
    createWorld.color = "black";
    createWorld.fontSize = 20;
    createWorld.thickness = 0
    createWorld.top = "-10%";
    createWorld.background = "white";
    this.createWorldBut = createWorld;

    var loadWorld = BABYLON.GUI.Button.CreateSimpleButton("loadWorld", 'Load Project');
    loadWorld.width = '250px';
    loadWorld.height = '30px';
    loadWorld.color = "black";
    loadWorld.fontSize = 20;
    loadWorld.thickness = 0;
    loadWorld.top = "10%";
    loadWorld.background = "white";
    this.loadWorldBut = loadWorld;

    this.loadProjectView = new LoadProjectView(texture, world);

    var _this = this;
    this.createWorldBut.onPointerUpObservable.add(function() {
        _this.turnOff(texture);
        createProjectCallback(world);
    });
    this.loadWorldBut.onPointerUpObservable.add(function() {
        texture.removeControl(_this.createWorldBut);
        texture.removeControl(_this.loadWorldBut);
        texture.removeControl(_this.title);
        _this.loadProjectView.turnOn(texture);
        _this.buttonsActive = false;
    });
}

MainMenu.prototype.turnOn = function(texture)
{
    texture.addControl(this.title);
    texture.addControl(this.createWorldBut);
    texture.addControl(this.loadWorldBut);

    this.active = true;
    this.buttonsActive = true;
}

MainMenu.prototype.turnOff = function(texture)
{
    texture.removeControl(this.title);
    texture.removeControl(this.createWorldBut);
    texture.removeControl(this.loadWorldBut);

    this.active = false;
    this.buttonsActive = false
}

MainMenu.prototype.update = function(texture)
{
    if(this.loadProjectView.exit)
    {
        this.turnOn(texture);
    }
    if(this.active && !this.buttonsActive && !this.loadProjectView.active)
    {
        this.active = false;
    }
}