PauseMenu = function(texture, world)
{
    this.active = false;

    var exitToGame = BABYLON.GUI.Button.CreateSimpleButton("exitToGame", 'Exit To Game');
    exitToGame.width = '250px';
    exitToGame.height = '30px';
    exitToGame.color = "black";
    exitToGame.fontSize = 20;
    exitToGame.thickness = 0;
    exitToGame.top = "-10%";
    exitToGame.background = "white";
    this.exitToGameBut = exitToGame;

    var quitAndSave = BABYLON.GUI.Button.CreateSimpleButton("quitAndSave", 'Quit and Save');
    quitAndSave.width = '250px';
    quitAndSave.height = '30px';
    quitAndSave.color = "black";
    quitAndSave.fontSize = 20;
    quitAndSave.thickness = 0;
    quitAndSave.top = "10%";
    quitAndSave.background = "white";
    this.quitAndSaveBut = quitAndSave;

    var _this = this;
    this.exitToGameBut.onPointerUpObservable.add(function() {
        _this.turnOff(texture);
        world.inGame = true;
    });
}

PauseMenu.prototype.turnOn = function(texture)
{
    texture.addControl(this.exitToGameBut);
    texture.addControl(this.quitAndSaveBut);

    this.active = true;
}

PauseMenu.prototype.turnOff = function(texture)
{
    texture.removeControl(this.exitToGameBut);
    texture.removeControl(this.quitAndSaveBut);

    this.active = false;
}