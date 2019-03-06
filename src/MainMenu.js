MainMenu = function(texture, createWorldFunc, world, scene)
{
    this.active = false;

    var title = new BABYLON.GUI.TextBlock();
    title.text = "Web Voxels";
    title.color = "black";
    title.fontSize = 48;
    // TODO: This should be proportional to rendering size.
    title.top = -300;
    this.title = title;

    var createWorld = BABYLON.GUI.Button.CreateSimpleButton("createWorld", 'Create World');
    createWorld.width = '250px';
    createWorld.height = '30px';
    createWorld.color = "black";
    createWorld.fontSize = 20;
    createWorld.thickness = 0;
    createWorld.background = "white";
    this.createWorldBut = createWorld;

    var _this = this;
    this.createWorldBut.onPointerUpObservable.add(function() {
        _this.turnOff(texture);
        createWorldFunc(scene, world);
    });
}

MainMenu.prototype.turnOn = function(texture)
{
    texture.addControl(this.title);
    texture.addControl(this.createWorldBut);

    this.active = true;
}

MainMenu.prototype.turnOff = function(texture)
{
    texture.removeControl(this.title);
    texture.removeControl(this.createWorldBut);

    this.active = false;
}