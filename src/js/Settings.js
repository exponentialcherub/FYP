Settings = function(updateSettings, input, camera, gui, texture)
{
    this.active = false;

    var _this = this;

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "220px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel = panel;

    this.mouseSensitivity = 30000;

    var mouseSensitivitySliderHeader = new BABYLON.GUI.TextBlock();
    mouseSensitivitySliderHeader.text = "Mouse Sensitivity: " + 3 * this.mouseSensitivity / 10000;
    mouseSensitivitySliderHeader.height = "30px";
    mouseSensitivitySliderHeader.color = "white";
    this.mouseSensitivitySliderHeader = mouseSensitivitySliderHeader;
    panel.addControl(mouseSensitivitySliderHeader); 

    var mouseSensitivitySlider = new BABYLON.GUI.Slider();
    mouseSensitivitySlider.minimum = 20000;
    mouseSensitivitySlider.maximum = 50000;
    mouseSensitivitySlider.value = this.mouseSensitivity;
    mouseSensitivitySlider.height = "20px";
    mouseSensitivitySlider.width = "200px";
    mouseSensitivitySlider.top = "-10%";
    mouseSensitivitySlider.onValueChangedObservable.add(function(value) {
        mouseSensitivitySliderHeader.text = "Mouse Sensitivity: " + (3 * value / 10000).toFixed(3);
        _this.mouseSensitivity = 55000 - value;
    });
    this.mouseSensitivitySlider = mouseSensitivitySlider;
    panel.addControl(this.mouseSensitivitySlider);

    this.speed = 0.25;

    var speedSliderHeader = new BABYLON.GUI.TextBlock();
    speedSliderHeader.text = "Speed: " + this.speed * 20;
    speedSliderHeader.height = "30px";
    speedSliderHeader.color = "white";
    this.speedSliderHeader = speedSliderHeader;
    panel.addControl(this.speedSliderHeader); 

    var speedSlider = new BABYLON.GUI.Slider();
    speedSlider.minimum = 0.05;
    speedSlider.maximum = 0.5;
    speedSlider.value = this.speed;
    speedSlider.height = "20px";
    speedSlider.width = "200px";
    speedSlider.top = "10%";
    speedSlider.onValueChangedObservable.add(function(value) {
        speedSliderHeader.text = "Speed: " + (value * 20).toFixed(3);
        _this.speed = value;
    });
    this.speedSlider = speedSlider;
    panel.addControl(this.speedSlider);

    var done = BABYLON.GUI.Button.CreateSimpleButton("done", 'Done');
    done.width = '250px';
    done.height = '30px';
    done.color = "black";
    done.fontSize = 20;
    done.thickness = 0
    done.top = "30%";
    done.background = "white";
    done.onPointerUpObservable.add(function() {
        console.log(_this.speed);
        updateSettings(input, camera, _this.mouseSensitivity, _this.speed);
        
        _this.turnOff(texture);
        gui.showHud = true;
    });
    this.doneBut = done;
}

Settings.prototype.turnOn = function(texture)
{
    texture.addControl(this.panel);
    texture.addControl(this.doneBut);

    this.active = true;
}

Settings.prototype.turnOff = function(texture)
{
    texture.removeControl(this.panel);
    texture.removeControl(this.doneBut);

    this.active = false;
}