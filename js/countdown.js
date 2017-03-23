class Countdown {

	constructor(timeToCountDown) {
		this._initialCountDown = timeToCountDown;
		this.reset();
	}

	reset() {
		this._timeToCountDown = this._initialCountDown;
		this._lastUpdateTime = new Date().getTime();
		this._pauseBeginTime = false;
	}

	// Return true if countdown finished
	update() {
		var curTime = new Date().getTime();
		if (this._pauseBeginTime) {
			return (this._timeToCountDown <= 0);
		}
		if (this._timeToCountDown <= 0) {
			return true;
		}

		this._timeToCountDown = this._timeToCountDown - (curTime - this._lastUpdateTime);
		if (this._timeToCountDown <= 0) {
			return true;
		} else {
			this._lastUpdateTime = curTime;
			return false;
		}
	}

	onPause() {
		this._pauseBeginTime = new Date().getTime();
	}

	onResume() {
		var curTime = new Date().getTime();
		var pauseLength = curTime - this._pauseBeginTime;
		this._lastUpdateTime = this._lastUpdateTime + pauseLength;
		this._pauseBeginTime = false;
	}

}
