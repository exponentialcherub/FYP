ChunkManager = function(scene, material, blockSelector, worldSize = 256, chunkSize = 16)
{
    if(worldSize < chunkSize)
    {
        console.log("World size is less than chunk size, setting world size equal (" + chunkSize + ")");
        worldSize = chunkSize;
    }

    this.selector = blockSelector;

    this.chunks = new Array();
    // Number of chunks in one dimension (i.e. this doesn't make any sense).
    // Either:
    //     Need new name or, 
    //     Create chunks differently
    this.noChunks = worldSize / chunkSize;

    for(var i = 0; i < this.noChunks; i++)
    {
        this.chunks[i] = new Array();
        for(var j = 0; j < this.noChunks; j++)
        {
            this.chunks[i][j] = new Array();
            for(var k = 0; k < this.noChunks; k++)
            {
                var chunk = new Chunk("" + i + j + k, 4,
                    new BABYLON.Vector3(-worldSize / 2 + i * chunkSize, chunkSize * (j - 1), 
                                        -worldSize / 2 + k * chunkSize), scene, material, chunkSize);
                this.chunks[i][j][k] = chunk;
            }
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
            for(var i = 0; i < _this.noChunks; i++)
            {
                for(var j = 0; j < _this.noChunks; j++)
                {
                    for(var k = 0; k < _this.noChunks; k++)
                    {
                        var ret = _this.chunks[i][j][k].hasBlock(pickResult.pickedPoint, pickResult.getNormal(true, false)); 
                        if(ret.result)
                        {
                            _this.chunks[i][j][k].removeBlock(ret.pos);
                            break;
                        }
                    }
                }
            }
        }
        else if(e.button == 2)
        {
            // Right click, add block.
            for(var i = 0; i < _this.noChunks; i++)
            { 
                for(var j = 0; j < _this.noChunks; j++)
                {
                    for(var k = 0; k < _this.noChunks; k++)
                    {
                        var normal = pickResult.getNormal(true, false);
                        var ret = _this.chunks[i][j][k].hasBlock(pickResult.pickedPoint, normal); 
                        if(ret.result)
                        {
                            _this.addBlock(ret.pos, normal);
                            break;
                        }
                    }
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

    for(var i = 0; i < this.noChunks; i++)
    {
        for(var j = 0; j < this.noChunks; j++)
        {
            for(var k = 0; k < this.noChunks; k++)
            {
                var ret = this.chunks[i][j][k].hasBlock(newPosition, normal);
                if(ret.result)
                {
                    this.chunks[i][j][k].addBlock(newPosition, this.selector.selected);
                }
            }
        }
    }
}

ChunkManager.prototype.toJSON = function()
{
    return {noChunks: this.noChunks, chunks: this.chunks};
}

ChunkManager.prototype.dispose = function()
{
    for(var i = 0; i < this.noChunks; i++)
    {
        for(var j = 0; j < this.noChunks; j++)
        {
            for(var k = 0; k < this.noChunks; k++)
            {
                this.chunks[i][j][k].dispose();
            }
        }
    }   
}