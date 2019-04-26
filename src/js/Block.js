// Block objects just hold information about a block.

Block = function(position, id, blockType, active) 
{
    this.position = new BABYLON.Vector3(position.x, position.y, position.z);
    this.active = active;
    this.id = id;
    this.type = blockType;
}

Block.prototype.setActive = function(blockType)
{
    this.active = true;

    this.type = blockType;
}

Block.prototype.setInactive = function()
{
    this.active = false;
}

Block.prototype.isActive = function()
{
    return this.active;
}