class Emitter extends Platform {

	constructor(posX, posY, directions, interval, offset, guy, scene, assetsManager, level) {
		super(1, 1, posX, posY, guy, scene, assetsManager);

		this._interval = interval;
		this._offset = offset;
		this._last_emit_time = new Date().getTime() + this._offset;

		this._emit_directions = directions; // array contains all directions in which emitters emits

		this._mesh.projectileStopper = false;

		this._level = level;

		this._projectile_material = new BABYLON.StandardMaterial("projectile", this._scene);
		var textureTask = this._assetsManager.addTextureTask("image task", "textures/fireball.png");
		(function(material) { textureTask.onSuccess = function(task) {
			material.diffuseTexture = task.texture;
			material.diffuseTexture.hasAlpha = true;
			material.backFaceCulling = true;
		} } )(this._projectile_material);
	}

	reset() {
		this._last_emit_time = new Date().getTime() + this._offset;
	}

	// Allow shoot
	update(allow_emission) {
		var curTime = new Date().getTime();
		if (!allow_emission) this._last_emit_time = curTime;
		if (curTime - this._last_emit_time >= this._interval) {
			for (var i = 0; i < this._emit_directions.length; i++) {
				this._level.spawnProjectile(this._mesh.position.clone(), this._emit_directions[i], this._projectile_material);
			}
			this._last_emit_time = curTime;
		}
	}

	getTextureName() {
		return "textures/emitter.png";
	}

}