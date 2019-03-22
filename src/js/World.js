World = function()
{
    this.inGame = false;
    this.blockSelector = new BlockSelector();
}

World.prototype.createWorld = function(scene)
{
    var material = new BABYLON.StandardMaterial("textureatlas", scene);
    var textureAtlas = new BABYLON.Texture("assets/texturepack.png", scene);
    material.specularColor = BABYLON.Color3.Black();
    material.diffuseTexture = textureAtlas;
    material.backFaceCulling = true;
    material.freeze();

    this.chunkManager = new ChunkManager(scene, material, this.blockSelector, 64, 16);

    this.inGame = true;
}

World.prototype.save = function()
{
    var chunks = JSON.stringify(this.chunkManager);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Project sent to server.");
        }
        if(this.status == 404)
        {
            alert("Project could not be saved, request did not reach server.");
        }
    };

    xhttp.open("POST", "php/saveProject.php", true);
    xhttp.send(chunks);
}

World.prototype.dispose = function()
{
    this.chunkManager.dispose();
    this.chunkManager = null;
    this.inGame = false;
}