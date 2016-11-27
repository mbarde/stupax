class Marker {

	constructor(posX, posY, color, scene) {
		this._scene = scene;
		this._posX = Math.round(posX / CONS_SCALE) * CONS_SCALE;
		this._posY = Math.round(posY / CONS_SCALE) * CONS_SCALE;
		this._color = color;

		this.initGeometry();
	}

	initGeometry() {
		var material = new BABYLON.StandardMaterial("ground", this._scene);
		material.diffuseColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.specularColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);
		material.emissiveColor = new BABYLON.Color3(this._color.r, this._color.g, this._color.b);

		var mesh = BABYLON.MeshBuilder.CreatePlane("plane", {width: 1.0 * CONS_SCALE, height: 1.0 * CONS_SCALE}, this._scene);
		mesh.material = material;
		mesh.position.x = this._posX;
		mesh.position.y = this._posY;
		mesh.position.z = -CONS_SCALE/2;
	}

}
