class Projectile extends Entity {

	constructor(posX, posY, dirX, dirY, scene, assetsManager) {
		super(1, 1, 0, scene, assetsManager);

		this._startPosX = posX;
		this._startPosY = posY;

		this._direction = new BABYLON.Vector3(dirX, dirY, 0); // movement direction

		this.initGeometry(posX, posY);
	}

	initGeometry(posX, posY) {
		var material = new BABYLON.StandardMaterial("projectile", this._scene);
		var textureTask = this._assetsManager.addTextureTask("image task", "textures/fireball.png");
		textureTask.onSuccess = function(task) {
			material.diffuseTexture = task.texture;
			material.diffuseTexture.hasAlpha = true;
			material.backFaceCulling = true;
		}

		this._mesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: CONS_SCALE, width: CONS_SCALE}, this._scene);
		this._mesh.material = material;
		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._width/2) * CONS_SCALE;
		this._mesh.position.z = 0;
	}

	update() {
		this._mesh.position.addInPlace( this._direction );

		// When hitting a wall return TRUE (level can destroy projectile then).
		// Else return FALSE.
		var rayLength = this._width/2;

		// Check horizontal
		var posi = this._mesh.position.clone();
		posi.x = posi.x - rayLength/2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), rayLength);
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.isWalkable; });
		if (pickInfo.hit) {
			return true;
		}

		// Check vertical
		var posi = this._mesh.position.clone();
		posi.y = posi.y - rayLength/2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), rayLength);
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.isWalkable; });
		if (pickInfo.hit) {
			return true;
		}

		return false;
	}

}
