const qkeycode = 113;

BlockSelector = function(noMaterials)
{
    this.noMaterials  = noMaterials;
    this.selected = 0;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        console.log(e.keyCode);
        if(e.keyCode == qkeycode)
        {
            if(_this.selected == noMaterials - 1)
            {
                _this.selected = 0;
                return;
            }

            _this.selected++;
        }
    });
}