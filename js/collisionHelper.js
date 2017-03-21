/*
* This class is able to update the blocking status of an (rectangeled) mesh,
* to answer the question whether the mesh is blocked by something to one of the four directions: top, bottom, left, right
*
* Adds following object to mesh object:
* 	blockStatus.blocked_bottom: bool;
*	blockStatus.blocked_top: bool;
*	blockStatus.blocked_right: bool;
*	blockStatus.blocked_left: bool;
*/
class CollisionHelper {

	constructor(scene, width, height, mesh, toleranceDive, toleranceCorner) {
		this._scene = scene;

		this._width = width;
		this._height = height;
		this._mesh = mesh;

		this._toleranceDive = toleranceDive;
		this._toleranceCorner = toleranceCorner;

		this._mesh.blockStatus = {};
		this._mesh.blockStatus.blocked_bottom = false;
		this._mesh.blockStatus.blocked_top = false;
		this._mesh.blockStatus.blocked_right = false;
		this._mesh.blockStatus.blocked_left = false;
	}

	resetBlockStatus() {
		this._mesh.blockStatus = {};
		this._mesh.blockStatus.blocked_bottom = false;
		this._mesh.blockStatus.blocked_top = false;
		this._mesh.blockStatus.blocked_right = false;
		this._mesh.blockStatus.blocked_left = false;
	}

	getBlockStatus() {
		return this._mesh.blockStatus;
	}

	updateBlockStatus() {
		this._mesh.blockStatus.blocked_bottom = false;
		this._mesh.blockStatus.blocked_top = false;
		this._mesh.blockStatus.blocked_right = false;
		this._mesh.blockStatus.blocked_left = false;

		this._mesh.blockStatus.blocked_bottom =
			   this.performCollisionWithRay( this.getCollisionRayBottomLeftVertical() )
			|| this.performCollisionWithRay( this.getCollisionRayBottomRightVertical() )
			|| this.performCollisionWithRay( this.getCollisionRayBottomHorizontal() );

		this._mesh.blockStatus.blocked_top =
			   this.performCollisionWithRay( this.getCollisionRayTopLeftVertical() )
			|| this.performCollisionWithRay( this.getCollisionRayTopRightVertical() )
			|| this.performCollisionWithRay( this.getCollisionRayTopHorizontal() );

		this._mesh.blockStatus.blocked_left =
			   this.performCollisionWithRay( this.getCollisionRayLeftTopHorizontal() )
				|| this.performCollisionWithRay( this.getCollisionRayLeftBottomHorizontal() )
				|| this.performCollisionWithRay( this.getCollisionRayLeftVertical() );

		this._mesh.blockStatus.blocked_right =
			   this.performCollisionWithRay( this.getCollisionRayRightTopHorizontal() )
				|| this.performCollisionWithRay( this.getCollisionRayRightBottomHorizontal() )
				|| this.performCollisionWithRay( this.getCollisionRayRightVertical() );
	}

	performCollisionWithRay(ray) {
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isWall; });
		if (pickInfo.hit) {
			return true;
		}
		return false;
	}

	updateBlockStatusRegardingGuy(guyBlockStatus) {
		var helper = {};
		helper.blocked_bottom = false;
		helper.blocked_top = false;
		helper.blocked_right = false;
		helper.blocked_left = false;

		helper.blocked_bottom =
			   this.performGuyCollisionWithRay( this.getCollisionRayBottomLeftVertical() )
			|| this.performGuyCollisionWithRay( this.getCollisionRayBottomRightVertical() )
			|| this.performGuyCollisionWithRay( this.getCollisionRayBottomHorizontal() );

		helper.blocked_top =
			   this.performGuyCollisionWithRay( this.getCollisionRayTopLeftVertical() )
			|| this.performGuyCollisionWithRay( this.getCollisionRayTopRightVertical() )
			|| this.performGuyCollisionWithRay( this.getCollisionRayTopHorizontal() );

		helper.blocked_left =
			   this.performGuyCollisionWithRay( this.getCollisionRayLeftTopHorizontal() )
				|| this.performGuyCollisionWithRay( this.getCollisionRayLeftBottomHorizontal() )
				|| this.performGuyCollisionWithRay( this.getCollisionRayLeftVertical() );

		helper.blocked_right =
			   this.performGuyCollisionWithRay( this.getCollisionRayRightTopHorizontal() )
				|| this.performGuyCollisionWithRay( this.getCollisionRayRightBottomHorizontal() )
				|| this.performGuyCollisionWithRay( this.getCollisionRayRightVertical() );

		if (helper.blocked_bottom && guyBlockStatus.blocked_bottom) {
			this._mesh.blockStatus.blocked_bottom = true;
		}
		if (helper.blocked_top && guyBlockStatus.blocked_top) {
			this._mesh.blockStatus.blocked_top = true;
		}
		if (helper.blocked_left && guyBlockStatus.blocked_left) {
			this._mesh.blockStatus.blocked_left = true;
		}
		if (helper.blocked_right && guyBlockStatus.blocked_right) {
			this._mesh.blockStatus.blocked_right = true;
		}
	}

	performGuyCollisionWithRay(ray) {
		var pickInfo = this._scene.pickWithRay(ray, function(item) { return item.isGuy; });
		if (pickInfo.hit) {
			return true;
		}
		return false;
	}

	getCollisionRayLeftTopHorizontal() {
		var posi = this._mesh.position.clone();
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(-1, 0, 0), this._width/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayLeftBottomHorizontal() {
		var posi = this._mesh.position.clone();
		posi.y = posi.y - (this._height/2 * CONS_SCALE) + this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(-1, 0, 0), this._width/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayLeftVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) - this._toleranceDive;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayRightTopHorizontal() {
		var posi = this._mesh.position.clone();
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayRightBottomHorizontal() {
		var posi = this._mesh.position.clone();
		posi.y = posi.y - (this._height/2 * CONS_SCALE) + this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayRightVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x + (this._width/2 * CONS_SCALE) + this._toleranceDive;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayTopLeftVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), this._height/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayTopRightVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x + (this._width/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, 1, 0), this._height/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayTopHorizontal() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		posi.y = posi.y + (this._height/2 * CONS_SCALE) + this._toleranceDive;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - this._toleranceCorner*2);
	}

	getCollisionRayBottomLeftVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayBottomRightVertical() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x + (this._width/2 * CONS_SCALE) - this._toleranceCorner;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(0, -1, 0), this._height/2 * CONS_SCALE + this._toleranceDive);
	}

	getCollisionRayBottomHorizontal() {
		var posi = this._mesh.position.clone();
		posi.x = posi.x - (this._width/2 * CONS_SCALE) + this._toleranceCorner;
		posi.y = posi.y - (this._height/2 * CONS_SCALE) - this._toleranceDive;
		return new BABYLON.Ray(posi, new BABYLON.Vector3(1, 0, 0), this._width * CONS_SCALE - this._toleranceCorner*2);
	}

}
