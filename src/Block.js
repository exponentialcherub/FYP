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

Block.prototype.setActive = function(boxToCopy = null)
{
    if(this.box == null)
    {
        this.box = boxToCopy.createInstance(name);
        this.box.position = this.position;
        this.box.freezeWorldMatrix();
    }
}

Block.prototype.setInactive = function()
{
    if(this.box != null)
    {
        this.box.dispose();
        this.box = null;
    }
}

Block.prototype.isActive = function()
{
    return this.box != null;
}

Block.prototype.setVisibility = function(visible)
{
    if(this.isActive())
    {
        this.box.setEnabled(visible);
    }
}

Block.prototype.name = function()
{
    return this.box.name;
}