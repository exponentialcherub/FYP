SaveView = function(input, texture, world, stateChangeCallback, states)
{
    this.active = false;
    this.texture = texture;
    this.cameraInput = input;
    this.world = world;

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel = panel;

    var authorIn = new BABYLON.GUI.InputText();
    authorIn.width = 1;
    authorIn.maxWidth = 1;
    authorIn.paddingTop = "10px";
    authorIn.paddingBottom = "10px";
    authorIn.height = "60px";
    authorIn.text = "Author";
    authorIn.color = "white";
    authorIn.color = "gray";
    this.authorIn = authorIn;
    this.panel.addControl(this.authorIn);

    var projectNameIn = new BABYLON.GUI.InputText();
    projectNameIn.width = 1;
    projectNameIn.maxWidth = 1;
    projectNameIn.paddingTop = "10px";
    projectNameIn.paddingBottom = "10px";
    projectNameIn.height = "60px";
    projectNameIn.text = "Project Name";
    projectNameIn.color = "white";
    projectNameIn.color = "gray";
    this.projectNameIn = projectNameIn;
    this.panel.addControl(this.projectNameIn);

    var descriptionIn = new BABYLON.GUI.InputText();
    descriptionIn.width = 1;
    descriptionIn.maxWidth = 1;
    descriptionIn.height = "60px";
    descriptionIn.paddingTop = "10px";
    descriptionIn.paddingBottom = "10px";
    descriptionIn.text = "Description";
    descriptionIn.color = "white";
    descriptionIn.color = "gray";
    this.descriptionIn = descriptionIn;
    this.panel.addControl(this.descriptionIn);

    var save = BABYLON.GUI.Button.CreateSimpleButton("save", "Save");
    save.width = '100px';
    save.height = '50px';
    save.paddingTop = "10px";
    save.paddingBottom = "10px";
    save.color = "black";
    save.fontSize = 20;
    save.background = "white";
    save.borderColour = "black";
    this.saveBut = save;
    this.panel.addControl(this.saveBut);

    var _this = this;
    this.saveBut.onPointerUpObservable.add(function() {
        world.updateProjectValues(_this.authorIn.text, _this.projectNameIn.text, _this.descriptionIn.text);
        world.save();

        stateChangeCallback(states.HUD);
    });
}

SaveView.prototype.turnOn = function()
{
    this.texture.addControl(this.panel);
    this.cameraInput.detachControl(window);

    this.active = true;

    this.updateTextValues();
}

SaveView.prototype.turnOff = function()
{
    this.texture.removeControl(this.panel);
    this.cameraInput.attachControl(window);

    this.active = false;
}

SaveView.prototype.updateTextValues = function()
{
    var world = this.world;

    if(world.author != undefined)
    {
        this.authorIn.text = world.author;
    }
    else
    {
        this.authorIn.text = "Author";
    }
    if(world.projectName != undefined)
    {
        this.projectNameIn.text = world.projectName;
    }
    else
    {
        this.projectNameIn.text = "Project Name";
    }
    if(world.description != undefined)
    {
        this.descriptionIn.text = world.description;
    }
    else
    {
        this.descriptionIn.text = "Description";
    }
}