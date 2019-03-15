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

World.prototype.dispose = function()
{
    this.chunkManager.dispose();
    this.chunkManager = null;
    this.inGame = false;
}