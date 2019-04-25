World = function(scene)
{
    this.inGame = false;
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

    this.inGame = true;
    
    if(this.projectId != undefined)
    {
        delete this.projectId;
    }
}

World.prototype.save = function()
{
    var chunksObj = this.chunkManager.toJSON();

    if(this.projectId != undefined)
    {
        chunksObj.projectId = this.projectId;
    }

    var chunks = JSON.stringify(chunksObj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Project sent to server.");
        }
        else if(this.status == 404)
        {
            alert("Project could not be saved, problem sending to server.");
        }
    };

    xhttp.open("POST", "php/saveProject.php", true);
    xhttp.send(chunks);
}

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
        this.chunkManager = new ChunkManager(this.blockSelector, this.scene);
        this.chunkManager.loadChunksFromJSON(createWorldMaterial(), saveJson);
        this.inGame = true;
        console.log("Project loaded succesfully.");
    }
    else
    {
        alert("Project could not be loaded, server not available");
    }

    this.projectId = projectId;
}

World.prototype.dispose = function()
{
    this.chunkManager.dispose();
    this.chunkManager = null;
    this.inGame = false;
}