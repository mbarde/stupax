class Box extends Platform {

	constructor(width, height, posX, posY, mass, scene, resourceHandler) {
		super(width, height, posX, posY, scene, resourceHandler);
		this._mesh.getPhysicsImpostor().setMass(mass);
		this._mass = mass;

		this._startPosX = posX;
		this._startPosY = posY;

		this._mesh.isWall = false;
	}

	// Reset for example when level restart
	reset() {
		// Reset position
		this._mesh.position.x = (this._startPosX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (this._startPosY + this._height/2) * CONS_SCALE;
		this._mesh.position.z = 0;

		// Reset velocity (linear & angular)
		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		vel.z = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));

		// Reset rotation
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;
	}

	getTexture() {
		return this._resourceHandler.texBox;
	}

	setPhysicsState() {
		this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, move: true });
	}

}
