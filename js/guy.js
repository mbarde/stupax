class Guy extends Animatable {

	constructor(posX, posY, scene) {
			super(scene);

			// Init values --------------------------------------------------------
			this._width = 0.9;
			this._height = 0.9;

			this._accelerationX = 0.2 * CONS_SCALE;
			this._maxSpeedX = 1.0 * CONS_SCALE;
			this._maxSpeedY = 0.1 * CONS_SCALE;
			this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
			this._isOnMovablePlatform = false;

			this._forward = true;

			// Init geometry ------------------------------------------------------
			var material = new BABYLON.StandardMaterial("guy", this._scene);
			material.diffuseTexture = new BABYLON.Texture("textures/guy/obj_Idle001.png", this._scene);
			material.diffuseTexture.hasAlpha = true;
			material.diffuseTexture.uScale = 0.75;
			material.diffuseTexture.vScale = 0.75;
			material.backFaceCulling = false;

			this._mesh = BABYLON.MeshBuilder.CreatePlane("guy", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE}, this._scene);
			this._mesh.material = material;
			this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
			this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
			this._mesh.position.z = 0;

			// Init animations ----------------------------------------------------
			this._tex_uScale = 0.75;
			this._tex_vScale = 0.75;

			this.anim_load_animation([
				"textures/guy/obj_Run000.png",
				"textures/guy/obj_Run001.png",
				"textures/guy/obj_Run002.png",
				"textures/guy/obj_Run003.png",
				"textures/guy/obj_Run004.png",
				"textures/guy/obj_Run005.png",
				"textures/guy/obj_Run006.png",
				"textures/guy/obj_Run007.png"
			], this._tex_uScale, this._tex_vScale, 120, "run");
			this.anim_load_animation([
				"textures/guy/obj_Idle000.png",
				"textures/guy/obj_Idle001.png",
				"textures/guy/obj_Idle002.png",
				"textures/guy/obj_Idle003.png"
			], this._tex_uScale, this._tex_vScale, 120, "stand");
			this.anim_load_animation([
				"textures/guy/obj_JumpHigh000.png"
			], this._tex_uScale, this._tex_vScale, 120, "jump");
			this.anim_set_animation_by_name("run");

			this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 8, restitution: 0.5, move: true });
	}

	// Reset guy, for example when restarting level
	reset(posX, posY) {
		this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
		this._isOnMovablePlatform = false;
		this._forward = true;

		this._mesh.position.x = posX  * CONS_SCALE;
		this._mesh.position.y = posY * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		if (!this._isOnMovablePlatform) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var veloc = this._mesh.getPhysicsImpostor().getLinearVelocity();
				veloc.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(veloc);
			}
		}

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		if (this._curMode != CONS_GM_STAND && vel.length() <= CONS_EPS) {
			this.anim_set_animation_by_name("stand");
			this._curMode = CONS_GM_STAND;
		} else {
			if (!this._isOnMovablePlatform
				&&this._curMode != CONS_GM_JUMP
				&& Math.abs(vel.y) > CONS_EPS
			) {
				this.anim_set_animation_by_name("jump");
				this._curMode = CONS_GM_JUMP;
			}
			if (this._curMode != CONS_GM_RUN
				&& Math.abs(vel.y) <= CONS_EPS
			 	&& Math.abs(vel.x) >= CONS_EPS
			) {
				this.anim_set_animation_by_name("run");
				this._curMode = CONS_GM_RUN;
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
		if (this._curMode != CONS_GM_JUMP) this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;

		if (this.anim_update()) {
			this._mesh.material = this.anim_get_cur_texture();
			if (!this._forward) this._mesh.material.diffuseTexture.uScale = -this._tex_uScale;
			else this._mesh.material.diffuseTexture.uScale = this._tex_uScale;
		}
	}

	toggleDirection() {
		this._direction.x = - this._direction.x;
		this._forward = !this._forward;

		if (!this._forward) this._mesh.material.diffuseTexture.uScale = -this._tex_uScale;
		else this._mesh.material.diffuseTexture.uScale = this._tex_uScale;;

		return this._forward;
	}

	keyDown(keyCode) {

	}

	keyUp(keyCode) {

	}

}
