class BodyPart extends Ball {

  constructor(width, height, position, lifetime, mass, scene, resourceHandler, material) {
    super(width, height, position, mass, scene, resourceHandler, material);

    this._lifetime = lifetime;

    this.initParticleSystem();
  }

  applyRandomImpulse() {
    var x = Math.random() * 50 - 25;
    var y = Math.random() * 50 - 25;
    var direction = new BABYLON.Vector3(x, y, 0);
    this._mesh.physicsImpostor.applyImpulse(direction, this._mesh.getAbsolutePosition());
  }

  initParticleSystem() {
		this._particleSystem = new BABYLON.ParticleSystem("particles", 10, this._scene);

		//Texture of each particle
		this._particleSystem.particleTexture = this._resourceHandler.texFlare;

		// Colors of all particles
		this._particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.0, 1.0);
    this._particleSystem.color2 = new BABYLON.Color4(0.8, 1.0, 0.0, 1.0);
    this._particleSystem.colorDead = new BABYLON.Color4(1.0, 0, 0.2, 0.0);

		// Size of each particle
		this._particleSystem.minSize = 0.1;
		this._particleSystem.maxSize = 0.5;

		// Life time of each particle
		this._particleSystem.minLifeTime = 0.3;
		this._particleSystem.maxLifeTime = 1.5;

		// Emission rate
		this._particleSystem.emitRate = 1500;

		// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
		this._particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		// Set the gravity of all particles
		this._particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

		// Direction of each particle after it has been emitted
		this._particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
		this._particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

		// Angular speed, in radians
		this._particleSystem.minAngularSpeed = 0;
		this._particleSystem.maxAngularSpeed = Math.PI;

		// Speed
		this._particleSystem.minEmitPower = 1;
		this._particleSystem.maxEmitPower = 3;
		this._particleSystem.updateSpeed = 0.005;

    this._particleSystem.emitter = this._mesh;
  }

  startParticleSystem() {
    this._particleSystem.start();
  }

  update() {
    return true;
  }

  destroy() {
    this._particleSystem.stop();
    super.destroy();
  }

}
