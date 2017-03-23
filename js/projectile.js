class Projectile extends Entity {

	// ATTENTION: here position is in absolute coordinates !!!
	constructor(position, direction, scene, resourceHandler, material) {
		super(CONS_PROJECTILE_SIZE, CONS_PROJECTILE_SIZE, 0, scene, resourceHandler);

		this._material = material;

		this._direction = new BABYLON.Vector3(direction.x, direction.y, 0); // movement direction

		this.initGeometry(position);

		this._countdown = new Countdown(CONS_PROJECTILE_LIFETIME);
	}

	initGeometry(position) {
		this._mesh = BABYLON.MeshBuilder.CreatePlane("finish", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE}, this._scene);
		this._mesh.material = this._material;
		this._mesh.position = new BABYLON.Vector3(position.x, position.y, 0);

		this._light = new BABYLON.PointLight("Omni", this._mesh.position, this._scene);
		this._light.diffuse = new BABYLON.Color3(0.91, 0.17, 0);
		this._light.specular = new BABYLON.Color3(0.91, 0.17, 0);
	}

	// if it returns TRUE the level removes this projectile
	update() {
		if( this._countdown.update() ) {
			return true;
		}

		// Movement
		this._mesh.position.addInPlace( this._direction );
		this._light.position = this._mesh.position;
		this._light.intensity += (( Math.random() - 0.5 ) / 2 );
		if (this._light.intensity < 0) this._light.intensity = 0;

		// Rotation
		this._mesh.rotation.z -= 0.1;

		// return if projectile hit a wall as information for the level (projectile has to be destroyed then)
		if (this.checkForWallHit()) {
			this._resourceHandler.soundProjectileHit.attachToMesh( this._mesh );
			this._resourceHandler.soundProjectileHit.play();
			return true;
		}
		return false;
	}

	checkForWallHit() {
		return this.performCollisionWithRay( this.getCollisionRayInverseToMovement() )
			||  this.performCollisionWithRay( this.getCollisionRayOrthogonalToMovement() );
	}

	getCollisionRayOrthogonalToMovement() {
		var posi = this._mesh.position.clone();
		posi.y = posi.y - (CONS_PROJECTILE_SIZE / 2);
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), CONS_PROJECTILE_SIZE);
	}

	getCollisionRayInverseToMovement() {
		return new BABYLON.Ray(this._mesh.position, this._direction.negate(), this._direction.length() + 0.1);
	}

	performCollisionWithRay(ray) {
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.projectileStopper; });
		if (pickInfo.hit) {
			return true;
		}
		return false;
	}

	destroy() {
		this._mesh.dispose();
		this._light.dispose();
	}

	onPause() {
		this._countdown.onPause();
	}

	onResume() {
		this._countdown.onResume();
	}

}
