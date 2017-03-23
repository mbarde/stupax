class Emitter extends Platform {

	constructor(posX, posY, directions, interval, offset, scene, resourceHandler, level) {
		super(1, 1, posX, posY, scene, resourceHandler);

		this._interval = interval;
		this._offset = offset;
		this._countdown = new Countdown(this._offset + this._interval);

		this._emit_directions = directions; // array contains all directions in which emitters emits

		this._mesh.projectileStopper = false;

		this._level = level;

		this._projectile_material = new BABYLON.StandardMaterial("projectile", this._scene);
		this._projectile_material.diffuseTexture = this._resourceHandler.texFireball;
		this._projectile_material.diffuseTexture.hasAlpha = true;
		this._projectile_material.backFaceCulling = true;
	}

	reset() {
		this._countdown = new Countdown(this._offset + this._interval);
	}

	update() {
		if (this._countdown.update()) {
			for (var i = 0; i < this._emit_directions.length; i++) {
				this._level.spawnProjectile(this._mesh.position.clone(), this._emit_directions[i], this._projectile_material);
				this._resourceHandler.soundEmitterShot.play();
				this._countdown = new Countdown(this._interval);
			}
		}
	}

	getTexture() {
		return this._resourceHandler.texEmitter;
	}

	onPause() {
		this._countdown.onPause();
	}

	onResume() {
		this._countdown.onResume();
	}

}
