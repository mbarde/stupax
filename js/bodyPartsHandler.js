class BodyPartsHandler {

  constructor(scene, resourceHandler) {
    this._scene = scene;
    this._resourceHandler = resourceHandler;

    this._bodyParts = [];
  }

  spawnBodyParts(pos) {
    var textures = this._resourceHandler.getGuyBodyPartTextures();
    for (var i = 0; i < textures.length; i++) {
      var material = new BABYLON.StandardMaterial("bodypart", this._scene);
      material.diffuseTexture = textures[i];
      material.diffuseTexture.hasAlpha = true;
      material.backFaceCulling = false;

      var bodyPart = new BodyPart(0.4, 0.4, pos, 1, this._scene, this._resourceHandler, material)
      bodyPart.applyRandomImpulse();
      bodyPart.startParticleSystem();
      this._bodyParts.push(bodyPart);
    }
  }

  update() {
    for (var i = 0; i < this._bodyParts.length; i++) {
      this._bodyParts[i].update();
    }
  }

  reset() {
    for (var i = 0; i < this._bodyParts.length; i++) {
      this._bodyParts[i].destroy();
    }
    this._bodyParts = [];
  }

  destroy() {
    this.reset();
  }

}
