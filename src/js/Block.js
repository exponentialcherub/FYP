Block = function(position, id, blockType) 
{
    this.position = position;
    this.active = true;
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