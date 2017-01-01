class Box extends Platform {

	constructor(width, height, posX, posY, mass, guy, scene, assetsManager) {
		super(width, height, posX, posY, guy, scene, assetsManager);
		this._mesh.getPhysicsImpostor().setMass(mass);
		this._mass = mass;

		this._mesh.isWall = false;
	}

	getTextureName() {
		return "textures/block02.png";
	}

	setPhysicsState() {
		this._mesh.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: CONS_RESTITUTION_PLAT, move: true });
	}

}
