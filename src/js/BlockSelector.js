const qkeycode = 113;
const qkeycode2 = 81;
const ekeycode = 101;
const ekeycode2 = 69;

BlockSelector = function()
{
    this.noMaterials  = getNoMaterials();
    this.selected = 0;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        if(e.keyCode == ekeycode || e.keyCode == ekeycode2)
        {
            if(_this.selected == _this.noMaterials - 1)
            {
                _this.selected = 0;
                return;
            }

            _this.selected++;
        }

        if(e.keyCode == qkeycode || e.keyCode == qkeycode2)
        {
            if(_this.selected == 0)
            {
                _this.selected = _this.noMaterials - 1;
                return;
            }

            _this.selected--;
        }
    });
}