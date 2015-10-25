const _tokenStore = {

}

function _isValidStoreName(storeName) {
	const storeNameType = typeof storeName;
	if(storeNameType === 'undefined' || storeName === '' || storeNameType !== 'string') {
		return false;
	}

	return true;
}

function registerToken(storeName, token) {
	if(!_isValidStoreName(storeName)) {
		throw new Error('Error in registerStoreDispatchToken. Provided storeName must be non empty string')
	}

	_tokenStore[storeName] = token;
}

function get(storeName) {
	if(!_isValidStoreName(storeName)) {
		throw new Error('Error in registerStoreDispatchToken. Provided storeName must be non empty string')
	}

	const foundToken = _tokenStore[storeName]

	if(typeof foundToken === 'undefined') {
		var msg = `'Error in registerStoreDispatchToken. Token not found for ${storeName}`
		throw new Error(msg)
	}

	return foundToken;
}

export default {
	registerToken,
	get
}