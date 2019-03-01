function CreateMaterial(name, url, scene)
{
    var material = new BABYLON.StandardMaterial(name, scene);
    var texture = new BABYLON.Texture(url, scene);
    material.specularColor = BABYLON.Color3.Black();
    material.diffuseTexture = texture;
    //material.ambientTexture = texture;
    material.backFaceCulling = true;
    material.freeze();
    return material;
}