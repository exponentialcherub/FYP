// The main menu view. Has two buttons, one to create a new project and another to load a project.

MainMenuView = function(texture, world, stateChangeCallback, states)
{
    this.texture = texture;

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

    this.createWorldBut.onPointerUpObservable.add(function() {
        stateChangeCallback(states.ACTIVE);
        world.createWorld()
    });
    this.loadWorldBut.onPointerUpObservable.add(function() {
        stateChangeCallback(states.LOAD);
    });
}

MainMenuView.prototype.turnOn = function()
{
    this.texture.addControl(this.title);
    this.texture.addControl(this.createWorldBut);
    this.texture.addControl(this.loadWorldBut);

    this.active = true;
}

MainMenuView.prototype.turnOff = function()
{
    this.texture.removeControl(this.title);
    this.texture.removeControl(this.createWorldBut);
    this.texture.removeControl(this.loadWorldBut);

    this.active = false;
}