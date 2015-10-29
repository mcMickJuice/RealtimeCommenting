//completely separate from flux environment
//handles subscriptions from stores, reports out
//constructor where reference is passed into constructor

//register once

//register on

import Firebase from 'firebase'
import Q from 'q'
import {nextTick, noop} from '../../common/utility'

function wrap(callback) {
	return function() {
		nextTick(() => callback(...arguments));
	}
}

class FirebaseFactory {
	constructor(reference) {
		this._reference = new Firebase(reference);
	}

	onceValue(callback) {
		this._reference.once('value', wrap(callback));
	}

	onAdded(callback) {
		this._reference.on('child_added', wrap(callback));
	}

	onUpdated(callback) {
		this._reference.on('child_changed', wrap(callback));
	}

	push(object, callback) {
		callback = callback || noop;
		this._reference.push(object,callback)
	}

	update(object, referenceId, callback) {
		callback = callback || noop;
		if(referenceId && referenceId.length > 0){
			this._reference.child(referenceId).update(object, callback);
		} else {
			this._reference.update(object, callback)
		}
	}
}

export default FirebaseFactory