const buttonNumber1 = 49;

BlockSelector = function(noMaterials)
{
    this.noMaterials  = noMaterials;
    this.selected = 0;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        if(e.keyCode == buttonNumber1)
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