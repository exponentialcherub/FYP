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
            }
        }
    }
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

    if(this.blocks[i][j][k] == null)
    {
        this.blocks[i][j][k] = new Block(position, this.blockCache[blockId]);
    }
}

Chunk.prototype.removeBlock = function(position)
{
    var i = position.x - this.min.x;
    var j = position.y - this.min.y;
    var k = position.z - this.min.z;

    this.blocks[i][j][k].box.dispose();
    this.blocks[i][j][k] = null;
}