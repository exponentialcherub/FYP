// TODO: This class (object?) may be useless, may just need box. Although may be useful in future when using mesh.

Block = function(position, boxToCopy, id) 
{
    this.position = position;

    // TODO: May in fact want to just hold block data in here, instead of creating box, create mesh within chunk.
    //       For optimisation
    var box = boxToCopy.createInstance("block" + id);
    
    box.position = position;
    box.freezeWorldMatrix();
    this.box = box;
}

Block.prototype.name = function()
{
    return this.box.name;
}