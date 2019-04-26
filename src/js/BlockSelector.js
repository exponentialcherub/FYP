const qkeycode = 113;
const qkeycode2 = 81;
const ekeycode = 101;
const ekeycode2 = 69;

// The block selector controls which materials is currently selected, the type of block
// that will be placed down. Used by the GUI as well to show which type of block it is on.

BlockSelector = function()
{
    this.noMaterials  = getNoMaterials();
    this.selected = 0;

    var _this = this;
    window.addEventListener("keypress", function(e)
    {
        // Traverses right through the list, wrapping around.
        if(e.keyCode == ekeycode || e.keyCode == ekeycode2)
        {
            if(_this.selected == _this.noMaterials - 1)
            {
                _this.selected = 0;
                return;
            }

            _this.selected++;
        }

        // Traverses left through the list, wrapping around.
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