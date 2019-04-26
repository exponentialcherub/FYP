// The heads-up-display when users are editing their projects. Displays the current material selected, save
// and quit options, controls and a settings button.

HUDView = function(blockSelector, texture, stateChangeCallback, states)
{
    this.texture = texture;
    this.active = false;
    this.buttonPressed = false;

    var crosshair = new BABYLON.GUI.Image("crosshair", "assets/mccrosshair.png");
    crosshair.width = 0.04;
    crosshair.height = 0.04;
    crosshair.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    this.crosshair = crosshair;
    
    this.blockSelector = blockSelector;
    var mainTextureImage = new BABYLON.GUI.Image("mainTextureImage", "assets/texturepack.png");
    mainTextureImage.width = 1;
    mainTextureImage.height = 1;
    mainTextureImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    mainTextureImage.sourceTop = 0;
    mainTextureImage.sourceLeft = 0;
    mainTextureImage.sourceWidth = 100;
    mainTextureImage.sourceHeight = 100;
    this.mainTextureImage = mainTextureImage;

    var textureContainer = new BABYLON.GUI.Rectangle();
    textureContainer.width = "100px";
    textureContainer.height = "100px";
    textureContainer.left = "-40%";
    textureContainer.top = "40%";
    textureContainer.cornerRadius = 0;
    textureContainer.color = "Black";
    textureContainer.thickness = 8;
    textureContainer.background = "green";
    this.textureContainer = textureContainer;
    this.textureContainer.addControl(this.mainTextureImage);

    var leftTextureImage = new BABYLON.GUI.Image("mainTextureImage", "assets/texturepack.png");
    leftTextureImage.width = 1;
    leftTextureImage.height = 1;
    leftTextureImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    leftTextureImage.sourceTop = 0;
    leftTextureImage.sourceLeft = (getNoMaterials() - 1) * 100;
    leftTextureImage.sourceWidth = 100;
    leftTextureImage.sourceHeight = 100;
    this.leftTextureImage = leftTextureImage;

    var leftTextureContainer = new BABYLON.GUI.Rectangle();
    leftTextureContainer.width = "75px";
    leftTextureContainer.height = "75px";
    leftTextureContainer.left = "-46.5%";
    leftTextureContainer.top = "40%";
    leftTextureContainer.cornerRadius = 0;
    leftTextureContainer.color = "Black";
    leftTextureContainer.thickness = 8;
    leftTextureContainer.alpha = 0.5;
    this.leftTextureContainer = leftTextureContainer;
    this.leftTextureContainer.addControl(this.leftTextureImage);

    var rightTextureImage = new BABYLON.GUI.Image("mainTextureImage", "assets/texturepack.png");
    rightTextureImage.width = 1;
    rightTextureImage.height = 1;
    rightTextureImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    rightTextureImage.sourceTop = 0;
    rightTextureImage.sourceLeft = 100;
    rightTextureImage.sourceWidth = 100;
    rightTextureImage.sourceHeight = 100;
    this.rightTextureImage = rightTextureImage;

    var rightTextureContainer = new BABYLON.GUI.Rectangle();
    rightTextureContainer.width = "75px";
    rightTextureContainer.height = "75px";
    rightTextureContainer.left = "-33.5%";
    rightTextureContainer.top = "40%";
    rightTextureContainer.cornerRadius = 0;
    rightTextureContainer.color = "Black";
    rightTextureContainer.thickness = 8;
    rightTextureContainer.alpha = 0.5;
    this.rightTextureContainer = rightTextureContainer;
    this.rightTextureContainer.addControl(this.rightTextureImage);

    var controlsImage = new BABYLON.GUI.Image("controls", "assets/Controls.png");
    controlsImage.width = "160px";
    controlsImage.height = "185px";
    controlsImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    controlsImage.sourceTop = 0;
    controlsImage.sourceLeft = 0;
    controlsImage.sourceWidth = 202;
    controlsImage.sourceHeight = 268;
    controlsImage.left = "-43.5%";
    controlsImage.top = "-35%";
    controlsImage.alpha = 0.8;
    this.controlsImage = controlsImage;

    var save = BABYLON.GUI.Button.CreateSimpleButton("save", "Save");
    save.width = '100px';
    save.height = '50px';
    save.color = "black";
    save.fontSize = 20;
    save.top = "-40%";
    save.left = "30%";
    save.background = "white";
    save.borderColour = "black";
    this.saveBut = save;

    var quit = BABYLON.GUI.Button.CreateSimpleButton("savequit", "Quit");
    quit.width = '100px';
    quit.height = '50px';
    quit.color = "black";
    quit.fontSize = 20;
    quit.top = "-40%";
    quit.left = "40%";
    quit.background = "white";
    quit.borderColour = "black";
    this.quitBut = quit;

    var settings = BABYLON.GUI.Button.CreateSimpleButton("settings", "Settings");
    settings.width = '100px';
    settings.height = '50px';
    settings.color = "black";
    settings.fontSize = 20;
    settings.top = "40%";
    settings.left = "40%";
    settings.background = "white";
    settings.borderColour = "black";
    this.settingsBut = settings;

    var _this = this;
    this.saveBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.SAVE);
    });
    this.quitBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.MAIN);
    });

    this.settingsBut.onPointerUpObservable.add(function() {
        _this.buttonPressed = true;

        stateChangeCallback(states.SETTINGS);
    })

    this.prevSelected = 0; 

    this.updateMaterial();
}

HUDView.prototype.turnOn = function()
{
    this.texture.addControl(this.crosshair);
    this.texture.addControl(this.textureContainer);
    this.texture.addControl(this.saveBut);
    this.texture.addControl(this.quitBut);
    this.texture.addControl(this.settingsBut);
    this.texture.addControl(this.controlsImage);
    this.texture.addControl(this.leftTextureContainer);
    this.texture.addControl(this.rightTextureContainer);

    this.active = true;
}

HUDView.prototype.turnOff = function()
{
    this.texture.removeControl(this.crosshair);
    this.texture.removeControl(this.textureContainer);
    this.texture.removeControl(this.saveBut);
    this.texture.removeControl(this.quitBut);
    this.texture.removeControl(this.settingsBut);
    this.texture.removeControl(this.controlsImage);
    this.texture.removeControl(this.leftTextureContainer);
    this.texture.removeControl(this.rightTextureContainer);

    this.active = false;
}

HUDView.prototype.updateMaterial = function()
{
    if(this.prevSelected == this.blockSelector.selected)
    {
        return;
    }
    this.prevSelected = this.blockSelector.selected;

    var noMaterials = getNoMaterials();
    if(this.blockSelector.selected > noMaterials)
    {
        console.error("Invalid selected block number: " + this.blockSelector.selected);
    }

    this.mainTextureImage.sourceLeft = (this.blockSelector.selected * 100);

    var leftImageIndex = this.blockSelector.selected - 1;
    if(leftImageIndex == - 1)
    {
        leftImageIndex = noMaterials - 1;
    }
    this.leftTextureImage.sourceLeft = leftImageIndex * 100;

    var rightImageIndex = this.blockSelector.selected + 1;
    if(rightImageIndex == noMaterials)
    {
        rightImageIndex = 0;
    }
    this.rightTextureImage.sourceLeft = rightImageIndex * 100;
}

HUDView.prototype.lockPointerAllowed = function()
{
    var pressed = this.buttonPressed;
    this.buttonPressed = false;
    return !pressed;
}