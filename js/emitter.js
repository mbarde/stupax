class Emitter extends Platform {

	constructor(posX, posY, guy, scene, assetsManager, level) {
		super(1, 1, posX, posY, guy, scene, assetsManager);

		this._interval = 1000;
		this._last_emit_time = new Date().getTime();

		this._emit_directions = []; // array contains all directions in which emitters emits
		this._emit_directions.push( new BABYLON.Vector3(0.1, 0.0, 0) );

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

	update() {
		var curTime = new Date().getTime();
		if (curTime - this._last_emit_time >= this._interval) {
			for (var i = 0; i < this._emit_directions.length; i++) {
				this._level.spawnProjectile(this._mesh.position.clone(), this._emit_directions[i], this._projectile_material);
			}
			this._last_emit_time = curTime;
		}
	}

	getTextureName() {
		return "textures/cartoon_wooden_crate.jpg";
	}

}
