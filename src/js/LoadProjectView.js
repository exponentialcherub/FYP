// This view shows all the projects on the server and displays information on a particular project if 
// selected which can then be loaded.

LoadProjectView = function(texture, world, stateChangeCallback, states)
{
    this.active = false;
    this.texture = texture;

    var title = new BABYLON.GUI.TextBlock();
    title.text = "Web Voxels";
    title.color = "black";
    title.fontSize = 48;
    title.top = "-40%";
    this.title = title;

    var sv = new BABYLON.GUI.ScrollViewer();
    sv.width = 0.25;
    sv.height = 0.75;
    sv.left = "-30%";
    sv.top = "5%";
    sv.color = "black";
    sv.barColor = "blue";
    sv.barBackground = "black";
    sv.thickness = 1;
    sv.background = "white";
    this.scrollView = sv;

    var infoContainer = new BABYLON.GUI.Rectangle();
    infoContainer.width = 0.53
    infoContainer.height = 0.6
    infoContainer.top = "-2.5%";
    infoContainer.left = "15%";
    infoContainer.thickness = 1;
    infoContainer.color = "black";
    infoContainer.background = "white";
    this.infoContainer = infoContainer;

    var projectBlock = new BABYLON.GUI.TextBlock();
    projectBlock.color = "black";
    projectBlock.width = "500px";
    projectBlock.height = "50px";
    projectBlock.text = "Name: ";
    this.projectBlock = projectBlock;

    var authorBlock = new BABYLON.GUI.TextBlock();
    authorBlock.color = "black";
    authorBlock.width = "500px";
    authorBlock.height = "50px";
    authorBlock.text = "Author: ";
    this.authorBlock = authorBlock;

    var descriptionBlock = new BABYLON.GUI.TextBlock();
    descriptionBlock.color = "black";
    descriptionBlock.width = "500px";
    descriptionBlock.height = "50px";
    descriptionBlock.text = "Description: ";
    descriptionBlock.textWrapping = true;
    this.descriptionBlock = descriptionBlock;

    // To be added.
    /*var dateBlock = new BABYLON.GUI.TextBlock();
    dateBlock.color = "black";
    dateBlock.width = "500px";
    dateBlock.height = "50px";
    dateBlock.text = "Date: ";
    this.dateBlock = dateBlock;*/

    var panel1 = new BABYLON.GUI.StackPanel();
    this.infoPanel = panel1;
    this.infoPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.infoPanel.width = 0.9;
    this.infoPanel.addControl(this.projectBlock);
    this.infoPanel.addControl(this.authorBlock);
    this.infoPanel.addControl(this.descriptionBlock);
    //this.infoPanel.addControl(this.dateBlock);
    this.infoContainer.addControl(this.infoPanel);

    var panel2 = new BABYLON.GUI.StackPanel();
    this.projectList = panel2;
    this.scrollView.addControl(this.projectList);

    var loadProject = BABYLON.GUI.Button.CreateSimpleButton("LoadProject", 'Load Project');
    loadProject.width = '200px';
    loadProject.height = '80px';
    loadProject.color = "black";
    loadProject.fontSize = 20;
    loadProject.thickness = 0
    loadProject.top = "40%";
    loadProject.left = "0%";
    loadProject.background = "white";
    this.loadProjectBut = loadProject;

    var exit = BABYLON.GUI.Button.CreateSimpleButton("exit", 'Exit to Menu');
    exit.width = '200px';
    exit.height = '80px';
    exit.color = "black";
    exit.fontSize = 20;
    exit.thickness = 0
    exit.top = "40%";
    exit.left = "30%";
    exit.background = "white";
    this.exitBut = exit;

    this.selectedProject = -1;
    
    var _this = this;
    this.loadProjectBut.onPointerUpObservable.add(function() {
        if(_this.listOfProjects.length != 0 && _this.selectedProject != -1)
        {
            stateChangeCallback(states.ACTIVE);
            world.load(_this.listOfProjects[_this.selectedProject].projectId);
        }
    });
    this.exitBut.onPointerUpObservable.add(function() {
        stateChangeCallback(states.MAIN);
    });
}

LoadProjectView.prototype.turnOn = function()
{
    this.texture.addControl(this.title);
    this.texture.addControl(this.scrollView);
    this.texture.addControl(this.infoContainer);
    this.texture.addControl(this.loadProjectBut);
    this.texture.addControl(this.exitBut);

    this.active = true;

    this.getProjects();
}

LoadProjectView.prototype.turnOff = function()
{
    this.texture.removeControl(this.title);
    this.texture.removeControl(this.scrollView);
    this.texture.removeControl(this.infoContainer);
    this.texture.removeControl(this.loadProjectBut);
    this.texture.removeControl(this.exitBut);

    this.scrollView.removeControl(this.projectList);
    var panel2 = new BABYLON.GUI.StackPanel();
    this.projectList = panel2;
    this.scrollView.addControl(this.projectList);

    this.active = false;
}

LoadProjectView.prototype.addProjectToList = function(projectName, i)
{
    var button = new BABYLON.GUI.RadioButton();
    button.width = "20px";
    button.height = "20px";
    button.color = "white";
    button.background = "blue";     

    var _this = this;
    button.onIsCheckedChangedObservable.add(function(state) {
        if (state) 
        {
            // Display info.
            _this.projectBlock.text = "Name: " + _this.listOfProjects[i].projectName;
            _this.authorBlock.text = "Author: " + _this.listOfProjects[i].author;
            _this.descriptionBlock.text = "Description: " + _this.listOfProjects[i].description;
            _this.selectedProject = i;
            //_this.dateBlock.text = "Name: " + _this.listOfProjects[i].projectName;
        }
    }); 

    var header = BABYLON.GUI.Control.AddHeader(button, projectName, "350px", { isHorizontal: true, controlFirst: true });
    header.height = "30px";

    this.projectList.addControl(header); 
}

// Asks the server for information on all projects which is then displayed.
LoadProjectView.prototype.getProjects = function()
{
    var _this = this;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            _this.listOfProjects = JSON.parse(this.responseText);

            if(_this.listOfProjects.length != 0)
            {
                for(var i = 0; i < _this.listOfProjects.length; i++)
                {
                    _this.addProjectToList(_this.listOfProjects[i].projectName, i);
                }
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
}