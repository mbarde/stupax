class Guy extends Animatable {

	constructor(posX, posY, scene) {
			super(scene);

			// Init values --------------------------------------------------------
			this._width = 0.6;
			this._height = 0.9;

			this._accelerationX = 0.2 * CONS_SCALE;
			this._maxSpeedX = 1.0 * CONS_SCALE;
			this._maxSpeedY = 0.1 * CONS_SCALE;
			this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
			this._isOnMovablePlatform = false;

			this._forward = true;
			this._stopOnWin = false;

			// Init geometry ------------------------------------------------------
			this._tex_uScale = 1;
			this._tex_vScale = 1;
			this._tex_uOffset = 0;
			this._tex_vOffset = 0;

			var material = new BABYLON.StandardMaterial("guy", this._scene);
			material.diffuseTexture = new BABYLON.Texture("textures/guy/obj_Idle001.png", this._scene);
			material.diffuseTexture.hasAlpha = true;
			material.diffuseTexture.uScale = this._tex_uScale;
			material.diffuseTexture.vScale = this._tex_vScale;
			material.diffuseTexture.uOffset = this._tex_uOffset;
			material.diffuseTexture.vOffset = this._tex_vOffset;
			material.backFaceCulling = false;

			this._planeMesh = BABYLON.MeshBuilder.CreatePlane("guyPlane", {height: 1.5 * CONS_SCALE, width: 1 * CONS_SCALE}, this._scene);
			this._planeMesh.material = material;

			// Impostor mesh for the physics
			var material = new BABYLON.StandardMaterial("guy", this._scene);
			material.alpha = 0.4;
			this._mesh = BABYLON.MeshBuilder.CreateBox("guy", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE, depth: CONS_SCALE}, this._scene);
			this._mesh.material = material;
			this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
			this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;
			this._mesh.position.z = 0;

			// Init animations ----------------------------------------------------
			this.anim_load_animation([
				"textures/guy/obj_Run000.png",
				"textures/guy/obj_Run001.png",
				"textures/guy/obj_Run002.png",
				"textures/guy/obj_Run003.png",
				"textures/guy/obj_Run004.png",
				"textures/guy/obj_Run005.png",
				"textures/guy/obj_Run006.png",
				"textures/guy/obj_Run007.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "run");
			this.anim_load_animation([
				"textures/guy/obj_Idle000.png",
				"textures/guy/obj_Idle001.png",
				"textures/guy/obj_Idle002.png",
				"textures/guy/obj_Idle003.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "stand");
			this.anim_load_animation([
				"textures/guy/obj_JumpHigh000.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 120, "jump");
			this.anim_load_animation([
				"textures/guy/obj_Box000.png",
				"textures/guy/obj_Box001.png",
				"textures/guy/obj_Box002.png",
				"textures/guy/obj_Box003.png",
				"textures/guy/obj_Box004.png",
				"textures/guy/obj_Box005.png"
			], this._tex_uScale, this._tex_vScale, this._tex_uOffset, this._tex_vOffset, 80, "win");

			this.anim_set_animation_by_name("run");

			this._mesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 5, restitution: CONS_RESTITUTION_GUY, move: true });
	}

	// Reset guy, for example when restarting level
	reset(posX, posY) {
		this._direction = new BABYLON.Vector3(this._accelerationX, 0, 0); // movement direction
		this._isOnMovablePlatform = false;
		this._forward = true;
		this._stopOnWin = false;

		this._mesh.position.x = (posX + this._width/2) * CONS_SCALE;
		this._mesh.position.y = (posY + this._height/2) * CONS_SCALE;

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		vel.x = 0;
		vel.y = 0;
		this._mesh.getPhysicsImpostor().setLinearVelocity(vel);
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
	}

	update() {
		this._planeMesh.position = this._mesh.getAbsolutePosition();
		this._planeMesh.position.y += 0.7;

		if (!this._isOnMovablePlatform) {
			if (this._mesh.getPhysicsImpostor().getLinearVelocity().y > this._maxSpeedY) {
				var veloc = this._mesh.getPhysicsImpostor().getLinearVelocity();
				veloc.y = this._maxSpeedY;
				this._mesh.getPhysicsImpostor().setLinearVelocity(veloc);
			}
		}

		var vel = this._mesh.getPhysicsImpostor().getLinearVelocity();
		if (this._curMode != CONS_GM_STAND && vel.length() <= CONS_EPS) {
			if (!this._stopOnWin) this.anim_set_animation_by_name("stand");
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
		if (this._curMode != CONS_GM_JUMP && !this._stopOnWin) this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		// Prevent rotation in any way
		this._mesh.getPhysicsImpostor().setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
		var q = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
		this._mesh.rotationQuaternion = q;

		// Always stay on the same Z coordinate
		this._mesh.position.z = 0;

		if (this.anim_update()) {
			this._planeMesh.material = this.anim_get_cur_texture();
			if (!this._forward) this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
			else this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
		}
	}

	// fired when player reaches door
	onWin() {
		this._stopOnWin = true;
		this.anim_set_animation_by_name("win");
	}

	toggleDirection() {
		this._direction.x = - this._direction.x;
		this._forward = !this._forward;

		if (!this._forward) {
			this._planeMesh.material.diffuseTexture.uScale = -this._tex_uScale;
			this._planeMesh.material.diffuseTexture.uOffset = -this._tex_uOffset;
		} else {
			this._planeMesh.material.diffuseTexture.uScale = this._tex_uScale;
			this._planeMesh.material.diffuseTexture.uOffset = this._tex_uOffset;
		}

		return this._forward;
	}

	keyDown(keyCode) {

	}

	keyUp(keyCode) {

	}

}
