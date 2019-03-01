ChunkManager = function(scene, material, worldSize = 256, chunkSize = 16)
{
    if(worldSize < chunkSize)
    {
        console.log("World size is less than chunk size, setting world size equal (" + chunkSize + ")");
        worldSize = chunkSize;
    }

    this.selector = new BlockSelector();

    this.chunks = new Array();
    // Number of chunks in one dimension (i.e. this doesn't make any sense).
    // Either:
    //     Need new name or, 
    //     Create chunks differently
    this.noChunks = worldSize / chunkSize;

    for(var i = 0; i < this.noChunks; i++)
    {
        for(var j = 0; j < this.noChunks; j++)
        {
            var chunk = new Chunk(i, 1,
                new BABYLON.Vector3(-worldSize / 2 + i * chunkSize, -8, -worldSize / 2 + j * chunkSize), scene, material, chunkSize);
            this.chunks[i * this.noChunks + j] = chunk;
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
                var ret = _this.chunks[i].hasBlock(pickResult.pickedPoint, pickResult.getNormal(true, false)); 
                if(ret.result)
                {
                    _this.chunks[i].removeBlock(ret.pos);
                    break;
                }
            }
        }
        else if(e.button == 2)
        {
            // Right click, add block.
            for(var i = 0; i < _this.chunks.length; i++)
            { 
                var normal = pickResult.getNormal(true, false);
                var ret = _this.chunks[i].hasBlock(pickResult.pickedPoint, normal); 
                if(ret.result)
                {
                    _this.addBlock(ret.pos, normal);
                    break;
                }
            }
        }
    });
}

ChunkManager.prototype.addBlock = function(blockPosition, normal)
{
    var newPosition = new BABYLON.Vector3(blockPosition.x, blockPosition.y, blockPosition.z);
    normal.normalize();

    newPosition.x += normal.x;
    newPosition.y += normal.y;
    newPosition.z += normal.z;

    for(var i = 0; i < this.chunks.length; i++)
    {
        var ret = this.chunks[i].hasBlock(newPosition, normal);
        if(ret.result)
        {
            this.chunks[i].addBlock(newPosition, this.selector.selected);
        }
    }
}