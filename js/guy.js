class Guy extends Entity {

	constructor(posX, posY, scene) {
			var h = 0.7;
			var w = 0.4;
			var d = 0.5;
			super(h, w, d, scene);

			this._accelerationX = 0.2 * CONS_SCALE;
			this._maxSpeedX = 1 * CONS_SCALE;
			this._maxSpeedY = 0.1 * CONS_SCALE;
			this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
			this._isOnMovablePlatform = false;

			var color = {
				r: 0.7,
				g: 0.0,
				b: 0.0
			}

			this._mesh = BABYLON.MeshBuilder.CreateBox("guy", {height: h * CONS_SCALE, width: w * CONS_SCALE, depth: d * CONS_SCALE}, this._scene);
			var material = new BABYLON.StandardMaterial("ground", this._scene);
			material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
			material.specularColor = new BABYLON.Color3(color.r, color.g, color.b);
			material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
			this._mesh.material = material;
			this._mesh.position.x = posX  * CONS_SCALE;
			this._mesh.position.y = posY * CONS_SCALE;
			this._mesh.position.z = 0;

			//mesh.checkCollisions = true;
         //mesh.applyGravity = true;
			this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 6, restitution: 0.001, move: true });

			this._mesh.onCollide = function(){   console.log('I am colliding with something')}
	}

	update() {
		if (!this._isOnMovablePlatform) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
				vel.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
			}
		}

		// Constrain speed to _maxSpeed property
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x > this._maxSpeedX) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = this._maxSpeedX;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		} else
		if (this._mesh.getPhysicsImpostor().getLinearVelocity().x < -this._maxSpeedX) {
			var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
			vel.x = -this._maxSpeedX;
			this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		}

		// Movement
		this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;
	}

	keyDown(keyCode) {

	}

	keyUp(keyCode) {

	}

}
