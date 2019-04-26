// This represents a chunk, which is a cube of blocks, the size of which is specified in the constructor.
// It contains functionality for meshing all the blocks in the chunk into one mesh, regenerating each
// time a block is added/removed.

Chunk = function(id, blockId, chunkPosition, scene, material, size) 
{
    this.id = id;
    if(scene == undefined)
    {
        return;
    }

    this.size = size;
    this.blocks = new Array();
    this.mesh = new BABYLON.Mesh("chunk" + id, scene);
    this.material = material;
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
                var position = chunkPosition.add(new BABYLON.Vector3(i, j, k));
                
                this.blocks[i][j][k] = new Block(position, "" + i + j + k, blockId, true);

                // Only render one layer of blocks to reduce rendering time as there is no need to dig
                // down. Can be changed in the future to be a preference.
                if(position.y > -size)
                {
                    this.blocks[i][j][k].setInactive();
                }
            }
        }
    }

    this.generateMesh(chunkPosition, scene);
}

Chunk.prototype.hasBlock = function(position, normal)
{
    var x, y, z;

    // The position given is an intersection point most likely, so we must round appropriately
    // according to the normal of the intersected face in order to get an accurate block position.
    // This is blocks only occur on round numbers because they are voxels and are indexed as so.

    if(normal.x > 0)
    {
        x = Math.floor(position.x);
    }
    else if(normal.x < 0)
    {
        x = Math.ceil(position.x);
    }
    else
    {
        x = Math.round(position.x);
    }

    if(normal.y > 0)
    {
        y = Math.floor(position.y);
    }
    else if(normal.y < 0)
    {
        y = Math.ceil(position.y);
    }
    else
    {
        y = Math.round(position.y);
    }

    if(normal.z > 0)
    {
        z = Math.floor(position.z);
    }
    else if(normal.z < 0)
    {
        z = Math.ceil(position.z);
    }
    else
    {
        z = Math.round(position.z);
    }

    return {result: x >= this.min.x && y >= this.min.y && z >= this.min.z
                 && x <= this.max.x && y <= this.max.y && z <= this.max.z,
            pos: new BABYLON.Vector3(x, y, z)}; 
}

Chunk.prototype.addBlock = function(position, blockId)
{
    // Round to get index.
    var i = Math.round(position.x) - this.min.x;
    var j = Math.round(position.y) - this.min.y;
    var k = Math.round(position.z) - this.min.z;

    this.blocks[i][j][k].setActive(blockId);

    this.regenerateMesh();
}

Chunk.prototype.removeBlock = function(position)
{
    // Round to get index.
    var i = Math.round(position.x) - this.min.x;
    var j = Math.round(position.y) - this.min.y;
    var k = Math.round(position.z) - this.min.z;

    this.blocks[i][j][k].setInactive();

    this.regenerateMesh();
}

Chunk.prototype.getBlockType = function(position)
{
    // Round to get index.
    var i = Math.round(position.x) - this.min.x;
    var j = Math.round(position.y) - this.min.y;
    var k = Math.round(position.z) - this.min.z;

    return this.blocks[i][j][k].type;
}

// This checks if a block can be seen by a user, i.e. if it is active and is not completely
// surrounded by blocks.
Chunk.prototype.checkBlockVisibility = function(i, j, k)
{
    if(i < 0 || j < 0 || k < 0 || i > this.size - 1 || j > this.size - 1 || k > this.size - 1)
    {
        return false;
    }

    if(!this.blocks[i][j][k].isActive())
    {
        return false;
    }

    if(i == 0 || j == 0 || k == 0 || i == this.size - 1 || j == this.size - 1 || k == this.size - 1)
    {
        return true;
    }

    if(this.blocks[i-1][j][k].isActive() && this.blocks[i+1][j][k].isActive() && this.blocks[i][j-1][k].isActive() &&
       this.blocks[i][j+1][k].isActive() && this.blocks[i][j][k-1].isActive() && this.blocks[i][j][k+1].isActive())
    {
        return false;
    }
    else
    {
        return true;
    }
}

// Generates the chunk mesh based on the active blocks and their types. More optimisation can be done here.
Chunk.prototype.generateMesh = function()
{
    var normalsSource = [
        [0, 0, 1],
        [0, 0, -1],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0]
    ];

    var iIndex = 0;
    var positions = new Array();
    var indices = new Array();
    var normals = new Array();
    var uvs = new Array();
    var noMaterials = getNoMaterials();

    for(var i = 0; i < this.size; i++)
    {
        for(var j = 0; j < this.size; j++)
        {
            for(var k = 0; k < this.size; k++)
            {
                if(this.checkBlockVisibility(i, j, k))
                {
                    // TODO: Don't need to add all faces, only visible ones. Maybe easier to hold face info in Block, then
                    // can call isFaceVisible, etc.. Only need each vertex once and reuse index.

                    // Calculate faces based on block position.
                    var pos = this.min.add(new BABYLON.Vector3(i, j, k));

                    var vec0 = [pos.x - 0.5, pos.y - 0.5, pos.z - 0.5]; 
                    var vec1 = [pos.x - 0.5, pos.y + 0.5, pos.z - 0.5]; 
                    var vec2 = [pos.x + 0.5, pos.y + 0.5, pos.z - 0.5]; 
                    var vec3 = [pos.x + 0.5, pos.y - 0.5, pos.z - 0.5]; 
                    var vec4 = [pos.x - 0.5, pos.y - 0.5, pos.z + 0.5]; 
                    var vec5 = [pos.x - 0.5, pos.y + 0.5, pos.z + 0.5]; 
                    var vec6 = [pos.x + 0.5, pos.y + 0.5, pos.z + 0.5]; 
                    var vec7 = [pos.x + 0.5, pos.y - 0.5, pos.z + 0.5]; 

                    var face1 = vec0.concat(vec3).concat(vec1);
                    var face2 = vec2.concat(vec1).concat(vec3);
                    var face3 = vec7.concat(vec4).concat(vec6);
                    var face4 = vec5.concat(vec6).concat(vec4);

                    var face5 = vec4.concat(vec0).concat(vec5);
                    var face6 = vec1.concat(vec5).concat(vec0);
                    var face7 = vec3.concat(vec7).concat(vec2);
                    var face8 = vec6.concat(vec2).concat(vec7);
                    
                    var face9 = vec1.concat(vec2).concat(vec5);
                    var face10 = vec6.concat(vec5).concat(vec2);
                    var face11 = vec4.concat(vec7).concat(vec0);
                    var face12 = vec3.concat(vec0).concat(vec7);

                    Array.prototype.push.apply(positions, face1);
                    Array.prototype.push.apply(positions, face2);
                    Array.prototype.push.apply(positions, face3);
                    Array.prototype.push.apply(positions, face4);
                    Array.prototype.push.apply(positions, face5);
                    Array.prototype.push.apply(positions, face6);
                    Array.prototype.push.apply(positions, face7);
                    Array.prototype.push.apply(positions, face8);
                    Array.prototype.push.apply(positions, face9);
                    Array.prototype.push.apply(positions, face10);
                    Array.prototype.push.apply(positions, face11);
                    Array.prototype.push.apply(positions, face12);

                    var textureIndex = this.blocks[i][j][k].type;

                    for(var p = 0; p < 6; p++)
                    {
                        Array.prototype.push.apply(normals, normalsSource[p]);
                        Array.prototype.push.apply(normals, normalsSource[p]);
                        Array.prototype.push.apply(normals, normalsSource[p]);
                        Array.prototype.push.apply(normals, normalsSource[p]);
                        Array.prototype.push.apply(normals, normalsSource[p]);
                        Array.prototype.push.apply(normals, normalsSource[p]);

                        // Calculate texture atlas coordinates based on the block type.
                        var x1 = textureIndex / noMaterials;
                        var x2 = (textureIndex + 1) / noMaterials;
                        
                        var uv = [x1, 0, x2, 0, x1, 1, 
                                  x2, 1, x1, 1, x2, 0];

                        Array.prototype.push.apply(uvs, uv);
                    }

                    for(var m = 0; m < 36; m++)
                    {
                        indices.push(iIndex + m);
                    }
                    iIndex += 36;
                }
            }
        }
    }
    
    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    vertexData.applyToMesh(this.mesh);

    this.mesh.material = this.material;

    this.mesh.setEnabled = true;
    this.mesh.checkCollisions = true;
}

// Disposes of old mesh and regenerates new one.
Chunk.prototype.regenerateMesh = function()
{
    var name = this.mesh.name;
    var scene = this.mesh.scene;

    this.mesh.setEnabled = false;
    this.mesh.dispose();

    this.mesh = new BABYLON.Mesh(name, scene);

    this.generateMesh();
}

// Reloads chunk from json file sent from the server. 
Chunk.prototype.loadChunkFromJSON = function(scene, material, jsonObj)
{
    this.size = jsonObj.size;
    this.blocks = new Array();
    this.mesh = new BABYLON.Mesh("chunk" + this.id, scene);
    this.material = material;
    this.min = new BABYLON.Vector3(jsonObj.min.x, jsonObj.min.y, jsonObj.min.z);
    this.max = new BABYLON.Vector3(jsonObj.max.x, jsonObj.max.y, jsonObj.max.z);

    // Create all blocks inactive initally.
    for(var i = 0; i < this.size; i++)
    {
        this.blocks[i] = new Array();
        for(var j = 0; j < this.size; j++)
        {
            this.blocks[i][j] = new Array();

            for(var k = 0; k < this.size; k++)
            {
                var position = this.min.add(new BABYLON.Vector3(i, j, k));
                
                this.blocks[i][j][k] = new Block(position, "" + i + j + k, 1, false);
            }
        }
    }

    // Now turn on active blocks from json object.
    for(var m = 0; m < jsonObj.blocks.length; m++)
    {
        var i = Math.round(jsonObj.blocks[m].position.x) - this.min.x;
        var j = Math.round(jsonObj.blocks[m].position.y) - this.min.y;
        var k = Math.round(jsonObj.blocks[m].position.z) - this.min.z;

        this.blocks[i][j][k].active = true;
        this.blocks[i][j][k].type = jsonObj.blocks[m].type;
    }

    this.generateMesh(this.min, scene);
}

Chunk.prototype.toJSON = function()
{
    var tempBlocks = new Array();
    var tmpI = 0;

    // Only save active blocks to save memory.
    for(var i = 0; i < this.size; i++)
    {
        for(var j = 0; j < this.size; j++)
        {
            for(var k = 0; k < this.size; k++)
            {
                if(this.blocks[i][j][k].active)
                {
                    tempBlocks[tmpI++] = this.blocks[i][j][k];
                }
            }
        }
    }
    return {size: this.size, min: this.min, max: this.max, blocks: tempBlocks};
}

Chunk.prototype.dispose = function()
{
    this.mesh.dispose();
    this.mesh = null;
}