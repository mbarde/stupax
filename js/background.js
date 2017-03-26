class Background extends Entity {

	constructor(width, height, scene, resourceHandler) {
		super(width, height, 0, scene, resourceHandler);

		this._levelWidth = width;
		this._levelHeight = height;

		this.initBackgroundPlane();
		this.initInvisibleFrontPlane();
	}

	initBackgroundPlane() {
		var planeWidth = this._levelWidth + 20 * CONS_SCALE;
		var planeHeight = this._levelHeight;

		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.backFaceCulling = true;
		material.diffuseTexture = this._resourceHandler.texBackground;
		material.diffuseTexture.uScale = planeWidth;
		material.diffuseTexture.vScale = planeHeight;

		this._backgroundMesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: planeWidth * CONS_SCALE, height: planeHeight * CONS_SCALE}, this._scene);
		this._backgroundMesh.material = material;
		this._backgroundMesh.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._backgroundMesh.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._backgroundMesh.position.z = CONS_SCALE/2;
		this._backgroundMesh.receiveShadows = false;

		this._backgroundMesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });
	}

	initInvisibleFrontPlane() {
		var material = new BABYLON.StandardMaterial("Mat", this._scene);
		material.alpha = 0;
		this._invisibleFrontPlaneMesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: (this._levelWidth + 9 * CONS_SCALE) * CONS_SCALE, height: (this._levelHeight * CONS_SCALE)}, this._scene);
		this._invisibleFrontPlaneMesh.material = material;
		this._invisibleFrontPlaneMesh.position.x = (this._levelWidth * CONS_SCALE) / 2;
		this._invisibleFrontPlaneMesh.position.y = (this._levelHeight * CONS_SCALE) / 2 - 4 * CONS_SCALE;
		this._invisibleFrontPlaneMesh.position.z = -CONS_SCALE/2;
		this._invisibleFrontPlaneMesh.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, friction: 0, move: false });
	}

	destroy() {
		this._backgroundMesh.dispose();
		this._invisibleFrontPlaneMesh.dispose();
	}
}
