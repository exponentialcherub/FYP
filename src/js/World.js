// World is reponsible for the creation of the chunk manager and is where the loading and
// saving of projects takes place.

World = function(scene)
{
    this.scene = scene;
    this.blockSelector = new BlockSelector();
}

createWorldMaterial = function(scene)
{
    var material = new BABYLON.StandardMaterial("textureatlas", scene);
    var textureAtlas = new BABYLON.Texture("assets/texturepack.png", scene);
    material.specularColor = BABYLON.Color3.Black();
    material.diffuseTexture = textureAtlas;
    material.backFaceCulling = true;
    material.freeze();

    return material;
}

World.prototype.createWorld = function()
{
    this.chunkManager = new ChunkManager(this.blockSelector, this.scene, createWorldMaterial(this.scene), 128, 32);
    
    if(this.projectId != undefined)
    {
        // Fresh project so reset information.
        delete this.projectId;
        delete this.author;
        delete this.projectName;
        delete this.description;
    }
}

// Sends the project to the server so it can be stored.
World.prototype.save = function()
{
    var chunksObj = this.chunkManager.toJSON();

    if(this.projectId != undefined)
    {
        chunksObj.projectId = this.projectId;
    }

    chunksObj.author = this.author;
    chunksObj.projectName = this.projectName;
    chunksObj.description = this.description;

    var chunks = JSON.stringify(chunksObj);

    // Send project to server, the server returns the project id.
    var _this = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Project sent to server.");

            _this.projectId = xhttp.responseText;
        }
        else if(this.status == 404)
        {
            alert("Project could not be saved, problem sending to server.");
        }
    };

    xhttp.open("POST", "php/saveProject.php", true);
    xhttp.send(chunks);
}

// Requests the server to send a project with a particular id.
World.prototype.load = function(projectId)
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "php/loadProject.php", false);

    var jsonSend = {filename: projectId};
    xhttp.send(JSON.stringify(jsonSend));

    if (xhttp.readyState == 4 && xhttp.status == 200) 
    {
        console.log("Save file received. Loading Project.");
        var saveJson = JSON.parse(xhttp.responseText);

        // Recreate chunks from json.
        this.chunkManager = new ChunkManager(this.blockSelector, this.scene);
        this.chunkManager.loadChunksFromJSON(createWorldMaterial(), saveJson);
        this.updateProjectValues(saveJson.author, saveJson.projectName, saveJson.description);
        console.log("Project loaded succesfully.");
    }
    else
    {
        alert("Project could not be loaded, server not available");
    }

    this.projectId = projectId;
}

World.prototype.changeClickSetting = function(leftClickDestroy)
{
    this.chunkManager.leftClickDestroy = leftClickDestroy;
}

World.prototype.updateProjectValues = function(author, projectName, description)
{
    this.author = author;
    this.projectName = projectName;
    this.description = description;
}

World.prototype.dispose = function()
{
    this.chunkManager.dispose();
    this.chunkManager = null;
}