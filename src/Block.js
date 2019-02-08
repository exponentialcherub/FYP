Block = function(position, boxToCopy) 
{
    this.position = position;

    // TODO: May in fact want to just hold block data in here, instead of creating box, create mesh within chunk.
    //       For optimisation
    var box = boxToCopy.createInstance("block");
    box.position = position;
    box.freezeWorldMatrix();
    this.box = box;
}

Block.prototype.createInstance = function(id)
{
    return box.createInstance(id);
}