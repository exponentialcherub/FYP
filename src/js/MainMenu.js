MainMenu = function(texture, createProjectCallback, world)
{
    this.active = false;

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

    var left = BABYLON.GUI.Button.CreateSimpleButton("left", 'Left');
    left.width = '75px';
    left.height = '75px';
    left.color = "black";
    left.fontSize = 20;
    left.thickness = 0;
    left.left = "-30%";
    left.background = "white";
    this.leftBut = left;

    var right = BABYLON.GUI.Button.CreateSimpleButton("right", 'Right');
    right.width = '75px';
    right.height = '75px';
    right.color = "black";
    right.fontSize = 20;
    right.thickness = 0;
    right.left = "30%";
    right.background = "white";
    this.rightBut = right;

    var select = BABYLON.GUI.Button.CreateSimpleButton("select", 'Select');
    select.width = '250px';
    select.height = '30px';
    select.color = "black";
    select.fontSize = 20;
    select.thickness = 0;
    select.top = "30%";
    select.background = "white";
    this.selectBut = select;

    var selectedProject = new BABYLON.GUI.TextBlock();
    selectedProject.text = "";
    selectedProject.color = "black";
    selectedProject.fontSize = 24;
    this.selectedProject = selectedProject;
    this.projectCounter = 0;

    var _this = this;
    this.createWorldBut.onPointerUpObservable.add(function() {
        _this.turnOff(texture);
        createProjectCallback(world);
    });
    this.loadWorldBut.onPointerUpObservable.add(function() {
        _this.showProjects(texture);
    });

    this.leftBut.onPointerUpObservable.add(function() {
        if(_this.projectCounter == 0)
        {
            _this.projectCounter = _this.listOfProjects.length - 1;
        }
        else
        {
            _this.projectCounter--;
        }

        _this.updateListedProject();
    });

    this.rightBut.onPointerUpObservable.add(function() {
        if(_this.projectCounter == _this.listOfProjects.length - 1)
        {
            _this.projectCounter = 0;
        }
        else
        {
            _this.projectCounter++;
        }

        _this.updateListedProject();
    });

    this.selectBut.onPointerUpObservable.add(function() {
        //loadCallback(_this.listOfProjects[_this.projectCounter]);
        world.load(_this.listOfProjects[_this.projectCounter]);

        _this.removeLoadProjects(texture);
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

MainMenu.prototype.showProjects = function(texture)
{
    var _this = this;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Projects info received.");
            _this.listOfProjects = JSON.parse(this.responseText);

            if(_this.listOfProjects.length != 0)
            {
                _this.projectCounter = 0;
                _this.selectedProject.text = _this.listOfProjects[_this.projectCounter];
            }
            else
            {
                _this.selectedProject.text = "No projects to load!";
            }
        }
        if(this.status == 404)
        {
            alert("Projects could not be loaded, server not available");
        }
    };

    xhttp.open("GET", "php/loadProjectList.php", true);
    xhttp.send();

    texture.removeControl(this.createWorldBut);
    texture.removeControl(this.loadWorldBut);

    texture.addControl(this.selectedProject);
    texture.addControl(this.leftBut);
    texture.addControl(this.rightBut);
    texture.addControl(this.selectBut);
}

MainMenu.prototype.removeLoadProjects = function(texture)
{
    texture.removeControl(this.title);
    texture.removeControl(this.selectedProject);
    texture.removeControl(this.selectBut);
    texture.removeControl(this.rightBut);
    texture.removeControl(this.leftBut);

    this.active = false;
}

MainMenu.prototype.updateListedProject = function()
{
    this.selectedProject.text = this.listOfProjects[this.projectCounter];   
}