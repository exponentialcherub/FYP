Chunk = function(id, blockCache, blockId, chunkPosition, scene, size = 16) 
{
    this.size = size;
    this.blocks = new Array();
    this.blockCache = blockCache;
    this.mesh = new BABYLON.Mesh("chunk" + id, scene);
    this.min = chunkPosition;
    this.max = chunkPosition.add(new BABYLON.Vector3(size - 1, size - 1, size - 1));

    for(var i = 0; i < size; i++)
    {
        this.blocks[i] = new Array();
        for(var j = 0; j < size; j++)
        {
            this.blocks[i][j] = new Array();

            for(var k = 0; k < size; k++)
            {
                // TODO: Perhaps chunk position should be the center, consistent with block. Although this makes
                // more sense when indexing.
                var position = chunkPosition.add(new BABYLON.Vector3(i, j, k));
                
                this.blocks[i][j][k] = new Block(position, blockCache[blockId], "" + i + j + k);
                if(j > size / 2)
                {
                    // Temporary to only populate half of chunk so we can build on. May end up doing this anyway.
                    this.blocks[i][j][k].setInactive();
                    continue;
                }
            }
        }
    }

    this.cullVisibility();
}

Chunk.prototype.hasBlock = function(position)
{
    return position.x >= this.min.x && position.y >= this.min.y && position.z >= this.min.z
        && position.x <= this.max.x && position.y <= this.max.y && position.z <= this.max.z; 
}

Chunk.prototype.addBlock = function(position, blockId)
{
    var i = position.x - this.min.x;
    var j = position.y - this.min.y;
    var k = position.z - this.min.z;

    this.blocks[i][j][k].setActive(this.blockCache[blockId]);
}

Chunk.prototype.removeBlock = function(position)
{
    var i = position.x - this.min.x;
    var j = position.y - this.min.y;
    var k = position.z - this.min.z;

    this.blocks[i][j][k].setInactive();
    this.checkNeighbourVisibility(i, j, k);
}

Chunk.prototype.checkNeighbourVisibility = function(i, j, k)
{
    this.checkBlockVisibility(i - 1, j, k);
    this.checkBlockVisibility(i + 1, j, k);
    this.checkBlockVisibility(i, j - 1, k);
    this.checkBlockVisibility(i, j + 1, k);
    this.checkBlockVisibility(i, j, k - 1);
    this.checkBlockVisibility(i, j, k + 1);
}

Chunk.prototype.checkBlockVisibility = function(i, j, k)
{
    if(i == 0 || j == 0 || k == 0 || i == this.size -1 || j == this.size -1 || k == this.size -1 || 
        !this.blocks[i][j][k].isActive())
    {
        return;
    }

    if(this.blocks[i-1][j][k].isActive() && this.blocks[i+1][j][k].isActive() && this.blocks[i][j-1][k].isActive() &&
       this.blocks[i][j+1][k].isActive() && this.blocks[i][j][k-1].isActive() && this.blocks[i][j][k+1].isActive())
    {
        this.blocks[i][j][k].setVisibility(false);
    }
    else
    {
        this.blocks[i][j][k].setVisibility(true)
    }
}

Chunk.prototype.cullVisibility = function()
{
    for(var i = 0; i < this.size; i++)
    {
        for(var j = 0; j < this.size; j++)
        {
            for(var k = 0; k < this.size; k++)
            {
                this.checkBlockVisibility(i, j, k);
            }
        }
    }
}
