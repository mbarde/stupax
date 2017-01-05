class ControllableGuy extends Guy {

	constructor(posX, posY, scene, assetsManager) {
		super(posX, posY, scene, assetsManager);
		this._keysDown = [];

		this._speed = 0.5 * CONS_SCALE;
	}

	update() {
		this.check_animation();

		// Move stuff
		this._direction.x = 0;
		this._direction.y = 0;

		var blocked_bottom = false;
		var blocked_top = false;
		var blocked_right = false;
		var blocked_left = false;

		if (this._keysDown.indexOf(CTRL_GUY_LEFT) > -1 && !blocked_left) { // left
				this._direction.x = -this._speed;
		}
		if (this._keysDown.indexOf(CTRL_GUY_RIGHT) > -1 && !blocked_right) { // right
				this._direction.x =  this._speed;
		}
		if (this._curMode != CONS_GM_JUMP && this._keysDown.indexOf(CTRL_GUY_JUMP) > -1 && !blocked_top) {
				this._direction.y = this._speed * 2; // up
		}

		this._mesh.getPhysicsImpostor().applyImpulse(this._direction, this._mesh.getAbsolutePosition());

		this.check_physic_constraints();

		if ((this._direction.x > 0) && !this._forward) { this.toggleDirection(); }
		else if ((this._direction.x < 0) && this._forward) { this.toggleDirection(); }
	}

	keyDown(ctrlCode) {
		var index = this._keysDown.indexOf(ctrlCode);
		if (index === -1) {
			this._keysDown.push(ctrlCode);
		}
	}

	keyUp(ctrlCode) {
		var index = this._keysDown.indexOf(ctrlCode);
		if (index > -1) {
			this._keysDown.splice(index, 1);
		}
	}

}
