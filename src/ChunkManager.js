ChunkManager = function(scene, worldSize = 256, chunkSize = 16)
{
    if(worldSize < chunkSize)
    {
        console.log("World size is less than chunk size, setting world size equal (" + chunkSize + ")");
        worldSize = chunkSize;
    }

    this.blockCache = new Array();
    this.populateBlockCache(scene);

    this.chunks = new Array();

    for(var i = 0; i < worldSize / chunkSize; i++)
    {
        for(var j = 0; j < worldSize / chunkSize; j++)
        {
            var chunk = new Chunk(i, this.blockCache, 0,
                new BABYLON.Vector3(-worldSize / 2 + i * chunkSize, -8, -worldSize / 2 + j * chunkSize), scene);
            this.chunks[i] = chunk;
        }
    }
}

ChunkManager.prototype.populateBlockCache = function(scene)
{
    this.blockCache[0] = BABYLON.MeshBuilder.CreateBox("Dirt", 1.0, scene);
    this.blockCache[0].material = CreateMaterial("Dirt", "dirt.jpg", scene);
}