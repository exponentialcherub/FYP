// This gui shows any configurable settings. Settings are updated once done is selected.
// Settings should be put into a model and accessed that way instead of changing values directly. (future work)

SettingsView = function(world, input, camera, texture, stateChangeCallback, states)
{
    this.active = false;
    this.input = input;
    this.texture = texture;

    var _this = this;

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "450px";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel = panel;

    this.mouseSensitivity = camera.angularSensibility;

    var mouseSensitivitySliderHeader = new BABYLON.GUI.TextBlock();
    mouseSensitivitySliderHeader.text = "Mouse Sensitivity: " + 3 * (55000 - this.mouseSensitivity) / 10000;
    mouseSensitivitySliderHeader.height = "30px";
    mouseSensitivitySliderHeader.color = "white";
    panel.addControl(mouseSensitivitySliderHeader); 

    var mouseSensitivitySlider = new BABYLON.GUI.Slider();
    mouseSensitivitySlider.minimum = 20000;
    mouseSensitivitySlider.maximum = 50000;
    mouseSensitivitySlider.value = 55000 - this.mouseSensitivity;
    mouseSensitivitySlider.height = "20px";
    mouseSensitivitySlider.width = "200px";
    mouseSensitivitySlider.top = "-10%";
    mouseSensitivitySlider.onValueChangedObservable.add(function(value) {
        mouseSensitivitySliderHeader.text = "Mouse Sensitivity: " + (3 * value / 10000).toFixed(3);
        _this.mouseSensitivity = 55000 - value;
    });
    panel.addControl(mouseSensitivitySlider);

    this.speed = input.sensibility;

    var speedSliderHeader = new BABYLON.GUI.TextBlock();
    speedSliderHeader.text = "Speed: " + this.speed * 20;
    speedSliderHeader.height = "30px";
    speedSliderHeader.color = "white";
    panel.addControl(speedSliderHeader); 

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
    panel.addControl(speedSlider);

    this.smoothness = camera.inertia;

    var smoothnessSliderHeader = new BABYLON.GUI.TextBlock();
    smoothnessSliderHeader.text = "Camera Smoothness: " + this.smoothness;
    smoothnessSliderHeader.height = "30px";
    smoothnessSliderHeader.color = "white";
    panel.addControl(smoothnessSliderHeader); 

    var smoothnessSlider = new BABYLON.GUI.Slider();
    smoothnessSlider.minimum = 0.00;
    smoothnessSlider.maximum = 1;
    smoothnessSlider.value = this.smoothness;
    smoothnessSlider.height = "20px";
    smoothnessSlider.width = "200px";
    smoothnessSlider.top = "10%";
    smoothnessSlider.onValueChangedObservable.add(function(value) {
        smoothnessSliderHeader.text = "Camera Smoothness: " + value;
        _this.smoothness = value;
    });
    panel.addControl(smoothnessSlider);

    var destroyHeader = new BABYLON.GUI.TextBlock();
    destroyHeader.text = "Destroy";
    destroyHeader.height = "30px";
    destroyHeader.color = "white";
    panel.addControl(destroyHeader); 

    var destroyClickPanel = new BABYLON.GUI.StackPanel(); 
    destroyClickPanel.isVertical = true;

    var leftclick1 = new BABYLON.GUI.RadioButton();
    leftclick1.width = "20px";
    leftclick1.height = "20px";
    leftclick1.color = "white";
    leftclick1.background = "blue";
    leftclick1.group = "destroy";
    var leftclick1header = BABYLON.GUI.Control.AddHeader(leftclick1, "Left-Click", "200px", { isHorizontal: true, controlFirst: true });
    leftclick1header.height = "30px";
    destroyClickPanel.addControl(leftclick1header);

    var rightclick1 = new BABYLON.GUI.RadioButton();
    rightclick1.width = "20px";
    rightclick1.height = "20px";
    rightclick1.color = "white";
    rightclick1.background = "blue";
    rightclick1.group = "destroy";
    var rightclick1header = BABYLON.GUI.Control.AddHeader(rightclick1, "Right-Click", "200px", { isHorizontal: true, controlFirst: true });
    rightclick1header.height = "30px";
    destroyClickPanel.addControl(rightclick1header);

    panel.addControl(destroyClickPanel);

    var buildHeader = new BABYLON.GUI.TextBlock();
    buildHeader.text = "Build";
    buildHeader.height = "30px";
    buildHeader.color = "white";
    panel.addControl(buildHeader); 

    var buildClickPanel = new BABYLON.GUI.StackPanel(); 
    buildClickPanel.isVertical = true;

    var leftclick2 = new BABYLON.GUI.RadioButton();
    leftclick2.width = "20px";
    leftclick2.height = "20px";
    leftclick2.color = "white";
    leftclick2.background = "blue";
    leftclick2.group = "build";
    var leftclick2header = BABYLON.GUI.Control.AddHeader(leftclick2, "Left-Click", "200px", { isHorizontal: true, controlFirst: true });
    leftclick2header.height = "30px";
    buildClickPanel.addControl(leftclick2header);

    var rightclick2 = new BABYLON.GUI.RadioButton();
    rightclick2.width = "20px";
    rightclick2.height = "20px";
    rightclick2.color = "white";
    rightclick2.background = "blue";
    rightclick2.group = "build";
    var rightclick2header = BABYLON.GUI.Control.AddHeader(rightclick2, "Right-Click", "200px", { isHorizontal: true, controlFirst: true });
    rightclick2header.height = "30px";
    buildClickPanel.addControl(rightclick2header);

    panel.addControl(buildClickPanel);

    leftclick1.isChecked = true;
    rightclick2.isChecked = true;

    leftclick1.onIsCheckedChangedObservable.add(function(state) {
        if(state)
        {
            leftclick2.isChecked = false;
            rightclick2.isChecked = true;

            world.changeClickSetting(true);
        }
    });
    rightclick1.onIsCheckedChangedObservable.add(function(state) {
        if(state)
        {
            rightclick2.isChecked = false;
            leftclick2.isChecked = true;

            world.changeClickSetting(false);
        }
    });
    leftclick2.onIsCheckedChangedObservable.add(function(state) {
        if(state)
        {
            leftclick1.isChecked = false;
            rightclick1.isChecked = true;
        }

        world.changeClickSetting(false);
    });
    rightclick2.onIsCheckedChangedObservable.add(function(state) {
        if(state)
        {
            rightclick1.isChecked = false;
            leftclick1.isChecked = true;
        }

        world.changeClickSetting(true);
    });

    var done = BABYLON.GUI.Button.CreateSimpleButton("done", 'Done');
    done.width = '250px';
    done.height = '30px';
    done.color = "black";
    done.fontSize = 20;
    done.thickness = 0
    done.top = "30%";
    done.background = "white";
    done.onPointerUpObservable.add(function() {
        // Should not be changing directly but this will do for now.
        camera.angularSensibility = _this.mouseSensitivity;
        input.sensibility = _this.speed;
        camera.inertia = _this.smoothness;

        stateChangeCallback(states.HUD);
    });
    this.doneBut = done;
}

SettingsView.prototype.turnOn = function()
{
    this.texture.addControl(this.panel);
    this.texture.addControl(this.doneBut);
    this.input.detachControl(window);

    this.active = true;
}

SettingsView.prototype.turnOff = function()
{
    this.texture.removeControl(this.panel);
    this.texture.removeControl(this.doneBut);
    this.input.attachControl(window);

    this.active = false;
}