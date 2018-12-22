class BodyPart extends Ball {

  constructor(width, height, position, mass, scene, resourceHandler, material) {
    super(width, height, position, mass, scene, resourceHandler, material);

    this.initParticleSystem();
  }

  applyRandomImpulse() {
    var x = Math.random() * 50 - 25;
    var y = Math.random() * 50 - 25;
    var direction = new BABYLON.Vector3(x, y, 0);
    this._mesh.physicsImpostor.applyImpulse(direction, this._mesh.getAbsolutePosition());
  }

  initParticleSystem() {
		this._particleSystem = BABYLON.ParticleHelper.CreateDefault(this._mesh, 100, this._scene);

		// Colors of all particles
		this._particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 0.0, 1.0);
    this._particleSystem.color2 = new BABYLON.Color4(0.8, 1.0, 0.0, 1.0);
    this._particleSystem.colorDead = new BABYLON.Color4(1.0, 0, 0.2, 0.0);


		// Size of each particle
		this._particleSystem.minSize = 0.1;
		this._particleSystem.maxSize = 0.5;

		// Life time of each particle
		this._particleSystem.minLifeTime = 0.3;
		this._particleSystem.maxLifeTime = 1.0;

		// Emission rate
		this._particleSystem.emitRate = 50;
    /**
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
    **/

    // One shot of particles
    this._particleSystem.targetStopDuration = 10;
    this._particleSystem.disposeOnStop = true;
  }

  startParticleSystem() {
    this._particleSystem.start();
  }

  update() {
  }

  destroy() {
    this._particleSystem.reset();
    super.destroy();
  }

}
