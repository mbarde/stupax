class Ball extends Entity {

	constructor(width, height, position, direction, mass, scene, resourceHandler, material) {
		super(width, height, 0, scene, resourceHandler);

    this._material = material;
		this.initGeometry(position);

    this._mass = mass;
    this.setPhysicsState();

    this._mesh.physicsImpostor.applyImpulse(direction, this._mesh.getAbsolutePosition());
	}

	initGeometry(position) {
		this._mesh = BABYLON.MeshBuilder.CreatePlane("ball", {height: this._height * CONS_SCALE, width: this._width * CONS_SCALE}, this._scene);
		this._mesh.material = this._material;
		this._mesh.position = new BABYLON.Vector3(position.x, position.y, 0);
	}

	setPhysicsState() {
		this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
				this._mesh, BABYLON.PhysicsEngine.Sphere,
				{ mass: this._mass, restitution: CONS_RESTITUTION_PLAT, move: false },
				this._scene);
	}

	update() {
	}

}
