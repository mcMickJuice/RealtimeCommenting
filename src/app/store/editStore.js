import chatDispatcher from '../dispatcher/chatDispatcher'
import messageConstants from '../constants/messageConstants'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import MessageStore from './messageStore'

var actionTypes = messageConstants.actionTypes;
var CHANGE_EVENT = 'change';

var _editState = {}

function _setEditState(messageId) {
	_editState = {messageId, isEditMode: true}
}

function _removeEditState(messageId) {
	_editState = {}
}

var EditStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getState: function() {
		return _editState;
	}
})

EditStore.dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.ENTER_EDIT_MODE:
			_setEditState(action.messageId)
			EditStore.emitChange();
		break;
		case actionTypes.EXIT_EDIT_MODE:
			_removeEditState(action.messageId)
			EditStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_MESSAGE:
			chatDispatcher.waitFor([MessageStore.dispatchToken])
			_removeEditState(action.message.id);
			EditStore.emitChange(CHANGE_EVENT);
		break;
		default:
	}
})

export default EditStore