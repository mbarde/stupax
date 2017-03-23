class Entity {

	/**
		Store width and height in grid units
	**/
	constructor(width, height, depth, scene, resourceHandler) {
		this._width = width;
		this._height = height;
		this._depth = depth;
		this._scene = scene;
		this._resourceHandler = resourceHandler;
	}

}
