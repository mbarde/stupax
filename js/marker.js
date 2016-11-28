class Marker {

	constructor(posX, posY, mode, scene) {
		this._scene = scene;
		this._posX = posX;
		this._posY = posY;
		this._mode = mode;

		this._color = {r: 0, g: 0, b: 0};
		if (mode == CONS_EM_PLATFORM) {
			this._color = {r: 1.0, g: 0, b: 0};
		} else
		if (mode == CONS_EM_GUY) {
			this._color = {r: 0, g: 1.0, b: 0};
		} else
		if (mode == CONS_EM_MOV_PLAT) {
			this._color = {r: 0, g: 0, b: 1.0};
		} else
		if (mode == CONS_EM_FINISH)
			this._color = {r: 1.0, g: 1.0, b: 1.0};
		}

		this.initGeometry();
	}

	initGeometry() {
		var material = new BABYLON.StandardMaterial("ground", this._scene);
		material.diffuseColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.specularColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.emissiveColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.alpha = 0.8;

		this._mesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: 1.0 * CONS_SCALE, height: 1.0 * CONS_SCALE}, this._scene);
		this._mesh.material = material;
		this._mesh.position.x = (this._posX + 0.5) * CONS_SCALE;
		this._mesh.position.y = (this._posY + 0.5) * CONS_SCALE;
		this._mesh.position.z = CONS_SCALE/2 - 0.001;
		this._mesh.mode = this._mode; // store mode at mesh to make it available when picking mesh
		this._mesh.marker = this;
	}

}
