class PlatformMarker {

	constructor(posX, posY, width, height) {
		this._posX = posX;
		this._posY = posY;
		this._width = width;
		this._height = height;
	}

	isRightNeighbor(pMarker) {
		return (pMarker._height == this._height
					&& pMarker._posY == this._posY
					&& pMarker._posX == this._posX + this._width);
	}

	isLeftNeighbor(pMarker) {
		return (pMarker._height == this._height
					&& pMarker._posY == this._posY
					&& pMarker._posX + pMarker._width == this._posX);
	}

	isTopNeighbor(pMarker) {
		return (pMarker._width == this._width
					&& pMarker._posX == this._posX
					&& pMarker._posY == this._posY + this._height);
	}

	isBottomNeighbor(pMarker) {
		return (pMarker._width == this._width
					&& pMarker._posX == this._posX
					&& pMarker._posY + this._height == this._posY);
	}

	tryMerge(pMarker) {
		if ( this.isRightNeighbor(pMarker) ) { // merge right
			this._width = this._width + pMarker._width;
			return true;
		}
		if ( this.isLeftNeighbor(pMarker) ) { // merge left
			this._width = this._width + pMarker._width;
			this._posX = pMarker._posX;
			return true;
		}
		if ( this.isTopNeighbor(pMarker) ) { // merge top
			this._height = this._height + pMarker._height;
			return true;
		}
		if ( this.isBottomNeighbor(pMarker) ) { // merge bottom
			this._height = this._height + pMarker._height;
			this._posY = pMarker._posY;
			return true;
		}
		return false;
	}

}
