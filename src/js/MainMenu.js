MainMenu = function(texture, createWorldFunc, world, scene)
{
    this.active = false;

    var title = new BABYLON.GUI.TextBlock();
    title.text = "Web Voxels";
    title.color = "black";
    title.fontSize = 48;
    title.top = "-40%";
    this.title = title;

    var createWorld = BABYLON.GUI.Button.CreateSimpleButton("createWorld", 'Create World');
    createWorld.width = '250px';
    createWorld.height = '30px';
    createWorld.color = "black";
    createWorld.fontSize = 20;
    createWorld.thickness = 0
    createWorld.top = "-10%";
    createWorld.background = "white";
    this.createWorldBut = createWorld;

    var loadWorld = BABYLON.GUI.Button.CreateSimpleButton("loadWorld", 'Load World');
    loadWorld.width = '250px';
    loadWorld.height = '30px';
    loadWorld.color = "black";
    loadWorld.fontSize = 20;
    loadWorld.thickness = 0;
    loadWorld.top = "10%";
    loadWorld.background = "white";
    this.loadWorldBut = loadWorld;

    var _this = this;
    this.createWorldBut.onPointerUpObservable.add(function() {
        _this.turnOff(texture);
        createWorldFunc(scene, world);
    });
    this.loadWorldBut.onPointerUpObservable.add(function() {
        // TODO: Load list of worlds, speak to server.
    });
}

MainMenu.prototype.turnOn = function(texture)
{
    texture.addControl(this.title);
    texture.addControl(this.createWorldBut);
    texture.addControl(this.loadWorldBut);

    this.active = true;
}

MainMenu.prototype.turnOff = function(texture)
{
    texture.removeControl(this.title);
    texture.removeControl(this.createWorldBut);
    texture.removeControl(this.loadWorldBut);

    this.active = false;
}