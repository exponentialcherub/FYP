ChunkManager = function(blockSelector, scene, material, worldSize, chunkSize)
{
    this.selector = blockSelector;
    this.scene = scene;

    var _this = this;
    window.addEventListener('mousedown', function(e){
        var pickResult = scene.pick(window.innerWidth/2, window.innerHeight/2); 
        if(!pickResult.hit)
        {
            return;
        }

        var normal = pickResult.getNormal(true, false);
        if(e.button == 0)
        {
            // Left click, destroy.
            for(var i = 0; i < _this.noChunks; i++)
            {
                for(var j = 0; j < _this.noChunks; j++)
                {
                    for(var k = 0; k < _this.noChunks; k++)
                    {
                        var ret = _this.chunks[i][j][k].hasBlock(pickResult.pickedPoint, normal); 
                        if(ret.result)
                        {
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
        else if(e.button == 2)
        {
            // Right click, add block.
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

    // Listen for undo action
    var _this = this;
    window.addEventListener('keypress', function(e)
    {
        console.log("hey!");
        if(e.keyCode ==  122)
        {
            console.log("been trying to meet you");
            if(_this.lastChangePosition != undefined && _this.lastChangeIndex != undefined &&
                _this.lastChangeType != undefined)
            {
                console.log("OOOOOOOOOOOHHHHHHHHHHHHHH");
                var i = _this.lastChangeIndex.x;
                var j = _this.lastChangeIndex.y;
                var k = _this.lastChangeIndex.z;
                if(_this.lastChangeType == 0 && _this.lastChangeBlockType != undefined)
                {
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
                                        -worldSize / 2 + k * chunkSize), this.scene, material, chunkSize);
                this.chunks[i][j][k] = chunk;
            }
        }
    }
}

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