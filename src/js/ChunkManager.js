// This controls all of the chunks, figuring out which one needs to be modified when a block is place/removed.

ChunkManager = function(blockSelector, scene, material, worldSize, chunkSize)
{
    this.selector = blockSelector;
    this.scene = scene;
    // Determines which way round the clicks are.
    this.leftClickDestroy = true;

    var _this = this;
    // Listen for click events, block placing/removing.
    window.addEventListener('mousedown', function(e){
        var pickResult = scene.pick(window.innerWidth/2, window.innerHeight/2); 
        if(!pickResult.hit)
        {
            return;
        }

        var normal = pickResult.getNormal(true, false);
        if((_this.leftClickDestroy && e.button == 0) || (!_this.leftClickDestroy && e.button == 2))
        {
            // Left click.
            for(var i = 0; i < _this.noChunks; i++)
            {
                for(var j = 0; j < _this.noChunks; j++)
                {
                    for(var k = 0; k < _this.noChunks; k++)
                    {
                        var ret = _this.chunks[i][j][k].hasBlock(pickResult.pickedPoint, normal); 
                        if(ret.result)
                        {
                            // Hold information on change so it can undone.
                            _this.lastChangeBlockType = _this.chunks[i][j][k].getBlockType(ret.pos);
                            _this.lastChangeType = 0;
                            _this.lastChangeIndex = new BABYLON.Vector3(i, j, k);
                            _this.lastChangePosition = new BABYLON.Vector3(ret.pos.x, ret.pos.y, ret.pos.z);
                            _this.chunks[i][j][k].removeBlock(ret.pos);
                            break;
                        }
                    }
                }
            }
        }
        else if((_this.leftClickDestroy && e.button == 2) || (!_this.leftClickDestroy && e.button == 0))
        {
            // Right click
            for(var i = 0; i < _this.noChunks; i++)
            { 
                for(var j = 0; j < _this.noChunks; j++)
                {
                    for(var k = 0; k < _this.noChunks; k++)
                    {
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

    // Listen for undo action, only able to undo last single action. Can implement stack to undo more.
    var _this = this;
    window.addEventListener('keypress', function(e)
    {
        if(e.keyCode ==  122)
        {
            if(_this.lastChangePosition != undefined && _this.lastChangeIndex != undefined &&
                _this.lastChangeType != undefined)
            {
                var i = _this.lastChangeIndex.x;
                var j = _this.lastChangeIndex.y;
                var k = _this.lastChangeIndex.z;

                if(_this.lastChangeType == 0 && _this.lastChangeBlockType != undefined)
                {
                    // Re-add block.
                    _this.chunks[i][j][k].addBlock(_this.lastChangePosition, _this.lastChangeBlockType);
                    delete _this.lastChangeBlockType;
                }
                else if(_this.lastChangeType == 1)
                {
                    _this.chunks[i][j][k].removeBlock(_this.lastChangePosition);
                }
                delete _this.lastChangePosition;
                delete _this.lastChangeIndex;
                delete _this.lastChangeType;
            }
        }
    });

    // If ChunkManager is being constructed from loaded project.
    if(material == undefined)
    {
        return;
    }

    if(worldSize < chunkSize)
    {
        console.log("World size is less than chunk size, setting world size equal (" + chunkSize + ")");
        worldSize = chunkSize;
    }

    this.selector = blockSelector;

    this.chunks = new Array();
    this.noChunks = worldSize / chunkSize;

    for(var i = 0; i < this.noChunks; i++)
    {
        this.chunks[i] = new Array();
        for(var j = 0; j < this.noChunks; j++)
        {
            this.chunks[i][j] = new Array();

            // Y-axis limited to 128 blocks, as there is generally not a need to go higher.
            for(var k = 0; k < 128 / chunkSize; k++)
            {
                var chunk = new Chunk("" + i + j + k, 4,
                    new BABYLON.Vector3(-worldSize / 2 + i * chunkSize, chunkSize * (j - 1), 
                                        -worldSize / 2 + k * chunkSize), this.scene, material, chunkSize);
                this.chunks[i][j][k] = chunk;
            }
        }
    }
}

// Load chunks from json file when it a previous project is loaded from the server.
ChunkManager.prototype.loadChunksFromJSON = function(material, jsonObj)
{
    this.chunks = new Array();
    this.noChunks = jsonObj.noChunks;

    for(var i = 0; i < this.noChunks; i++)
    {
        this.chunks[i] = new Array();
        for(var j = 0; j < this.noChunks; j++)
        {
            this.chunks[i][j] = new Array();
            for(var k = 0; k < this.noChunks; k++)
            {
                this.chunks[i][j][k] = new Chunk("" + i + j + k);
                this.chunks[i][j][k].loadChunkFromJSON(this.scene, material, jsonObj.chunks[i][j][k]);
            }
        }
    }

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
                    // Hold information on change so it can undone.
                    this.lastChangeType = 1;
                    this.lastChangeIndex = new BABYLON.Vector3(i, j, k);
                    this.lastChangePosition = new BABYLON.Vector3(newPosition.x, newPosition.y, newPosition.z);
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