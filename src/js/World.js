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

    this.chunkManager = new ChunkManager(scene, material, this.blockSelector, 128, 16);

    this.inGame = true;
}

World.prototype.save = function()
{
    var chunksJSON = JSON.stringify(this.chunkManager);
    console.log(chunksJSON);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) 
        {
            console.log("Woah it worked.");
        }
        if(this.status == 404)
        {
            console.error("Page not found.");
        }
    };

    xhttp.open("POST", "saveWorld.php", true);
    xhttp.send(chunksJSON);
}

World.prototype.dispose = function()
{
    this.chunkManager.dispose();
    this.chunkManager = null;
    this.inGame = false;
}