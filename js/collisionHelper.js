class CollisionHelper {

	constructor(scene, width, height, mesh, toleranceDive, toleranceCorner) {
		this._scene = scene;

		this._width = width;
		this._height = height;
		this._mesh = mesh;

		this._toleranceDive = toleranceDive;
		this._toleranceCorner = toleranceCorner;

		this._blockStatus = {};
		this._blockStatus.blocked_bottom = false;
		this._blockStatus.blocked_top = false;
		this._blockStatus.blocked_right = false;
		this._blockStatus.blocked_left = false;
	}

	resetBlockStatus() {
		this._blockStatus = {};
		this._blockStatus.blocked_bottom = false;
		this._blockStatus.blocked_top = false;
		this._blockStatus.blocked_right = false;
		this._blockStatus.blocked_left = false;
	}

	getBlockStatus() {
		return this._blockStatus;
	}

	updateBlockStatus() {
		this._blockStatus.blocked_bottom = false;
		this._blockStatus.blocked_top = false;
		this._blockStatus.blocked_right = false;
		this._blockStatus.blocked_left = false;

		var ray = this.getCollisionRayBottom();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_bottom = true;
		}

		var ray = this.getCollisionRayTop();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_top = true;
		}

		var ray = this.getCollisionRayLeft();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_left = true;
		}

		var ray = this.getCollisionRayRight();
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			this._blockStatus.blocked_right = true;
		}
	}

	getCollisionRayLeft() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) - this._toleranceDive;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayRight() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x + (this._width/2 * CONS_SCALE) + this._toleranceDive;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceDive;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayTop() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) + this._toleranceDive;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayBottom() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		posi.y = posi.y - (this._height/2 * CONS_SCALE) - this._toleranceDive;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - this._toleranceCorner*2);
	}

}
