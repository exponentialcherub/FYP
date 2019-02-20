ChunkManager = function(scene, worldSize = 256, chunkSize = 16)
{
    if(worldSize < chunkSize)
    {
        console.log("World size is less than chunk size, setting world size equal (" + chunkSize + ")");
        worldSize = chunkSize;
    }

    this.blockCache = new Array();
    this.populateBlockCache(scene, "assets");
    this.selector = new BlockSelector(this.blockCache.length);

    this.chunks = new Array();
    this.noChunks = worldSize / chunkSize;

    for(var i = 0; i < this.noChunks; i++)
    {
        for(var j = 0; j < this.noChunks; j++)
        {
            var chunk = new Chunk(i, this.blockCache, 2,
                new BABYLON.Vector3(-worldSize / 2 + i * chunkSize, -8, -worldSize / 2 + j * chunkSize), scene);
            this.chunks[i] = chunk;
        }
    }

    var _this = this;
    window.addEventListener('mousedown', function(e)
    {
        var pickResult = scene.pick(window.innerWidth/2, window.innerHeight/2); 
        if(!pickResult.hit)
        {
            return;
        }
        if(e.button == 0)
        {
            // Left click, destroy.
            for(var i = 0; i < _this.chunks.length; i++)
            {
                if(_this.chunks[i].hasBlock(pickResult.pickedMesh.position))
                {
                    _this.chunks[i].removeBlock(pickResult.pickedMesh.position);
                }
            }
        }
        else if(e.button == 2)
        {
            // Right click, add block.
            for(var i = 0; i < _this.chunks.length; i++)
            { 
                if(_this.chunks[i].hasBlock(pickResult.pickedMesh.position))
                {
                    _this.addBlock(pickResult);
                    break;
                }
            }
        }
    });
}

ChunkManager.prototype.addBlock = function(pickResult)
{
    var blockPosition = pickResult.pickedMesh.position;
    var newPosition = new BABYLON.Vector3(blockPosition.x, blockPosition.y, blockPosition.z);
    var normal = pickResult.getNormal();
    normal.normalize();

    newPosition.x += normal.x;
    newPosition.y += normal.y;
    newPosition.z += normal.z;

    for(var i = 0; i < this.noChunks; i++)
    {
        if(this.chunks[i].hasBlock(newPosition))
        {
            this.chunks[i].addBlock(newPosition, this.selector.selected);
        }
    }
}

ChunkManager.prototype.populateBlockCache = function(scene, path)
{
    this.blockCache[0] = BABYLON.MeshBuilder.CreateBox("Dirt", 1.0, scene);
    this.blockCache[0].material = CreateMaterial("Dirt", path + "/dirt.png", scene);
    this.blockCache[0].setEnabled(false);

    this.blockCache[1] = BABYLON.MeshBuilder.CreateBox("Wood", 1.0, scene);
    this.blockCache[1].material = CreateMaterial("Wood", path + "/wood.png", scene);
    this.blockCache[1].setEnabled(false);

    this.blockCache[2] = BABYLON.MeshBuilder.CreateBox("Stone", 1.0, scene);
    this.blockCache[2].material = CreateMaterial("Stone", path + "/stone.png", scene);
    this.blockCache[2].setEnabled(false);

    this.blockCache[3] = BABYLON.MeshBuilder.CreateBox("Brick", 1.0, scene);
    this.blockCache[3].material = CreateMaterial("Brick", path + "/brick.png", scene);
    this.blockCache[3].setEnabled(false);
}