class Projectile extends Entity {

	// ATTENTION: here position is in absolute coordinates !!!
	constructor(position, direction, scene, assetsManager, material) {
		super(0.2, 0.2, 0, scene, assetsManager);

		this._material = material;

		this._direction = new BABYLON.Vector3(direction.x, direction.y, 0); // movement direction

		this.initGeometry(position);
	}

	initGeometry(position) {
		this._mesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE}, this._scene);
		this._mesh.material = this._material;
		this._mesh.position = new BABYLON.Vector3(position.x, position.y, 0);

		this._light = new BABYLON.PointLight("Omni", this._mesh.position, this._scene);
		this._light.diffuse = new BABYLON.Color3(0.91, 0.17, 0);
		this._light.specular = new BABYLON.Color3(0.91, 0.17, 0);
	}

	update() {
		// Movement
		this._mesh.position.addInPlace( this._direction );
		this._light.position = this._mesh.position;
		this._light.intensity += (( Math.random() - 0.5 ) / 2 );
		if (this._light.intensity < 0) this._light.intensity = 0;

		// Rotation
		this._mesh.rotation.z -= 0.1;

		// When hitting a wall return TRUE (level can destroy projectile then).
		// Else return FALSE.

		var ray = new BABYLON.Ray(this._mesh.position, this._direction.negate(), this._direction.length());
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.projectileStopper; });
		if (pickInfo.hit) {
			return true;
		}

		/**
		var rayLength = CONS_SCALE / 3;

		// Check horizontal
		var posi = this._mesh.position.clone();
		posi.x = posi.x - rayLength/2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), rayLength);
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.projectileStopper; });
		if (pickInfo.hit) {
			return true;
		}

		// Check vertical
		rayLength = CONS_SCALE / 3;
		var posi = this._mesh.position.clone();
		posi.y = posi.y - rayLength/2;
		var ray = new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), rayLength);
		var pickInfo = scene.pickWithRay(ray, function(item) { return item.projectileStopper; });
		if (pickInfo.hit) {
			return true;
		}
		**/

		return false;
	}

	destroy() {
		this._mesh.dispose();
		this._light.dispose();
	}

}
