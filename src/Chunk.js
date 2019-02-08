Chunk = function(id, blockCache, blockId, chunkPosition, scene, size = 16) 
{
    this.size = size;
    this.blocks = new Array();
    this.mesh = new BABYLON.Mesh("chunk" + id, scene);

    for(var i = 0; i < size; i++)
    {
        this.blocks[i] = new Array();
        for(var j = 0; j < size; j++)
        {
            this.blocks[i][j] = new Array();

            for(var k = 0; k < size; k++)
            {
                var position = chunkPosition.add(new BABYLON.Vector3(i, j, k));
                this.blocks[i][j][k] = new Block(position, blockCache[blockId]);
            }
        }
    }
}