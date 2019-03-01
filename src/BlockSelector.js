const qkeycode = 113;

BlockSelector = function()
{
    this.noMaterials  = getNoMaterials();
    this.selected = 0;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        if(e.keyCode == qkeycode)
        {
            if(_this.selected == this.noMaterials - 1)
            {
                _this.selected = 0;
                return;
            }

            _this.selected++;
        }
    });
}