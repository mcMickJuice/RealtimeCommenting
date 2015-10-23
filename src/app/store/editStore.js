import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import CommentStore from './commentStore'

var actionTypes = commentConstants.actionTypes;
var CHANGE_EVENT = 'change';

var _editState = {}

function _setEditState(commentId) {
	_editState = {commentId, isEditMode: true}
}

function _removeEditState(commentId) {
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
			_setEditState(action.commentId)
			EditStore.emitChange();
		break;
		case actionTypes.EXIT_EDIT_MODE:
			_removeEditState(action.commentId)
			EditStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_COMMENT:
			chatDispatcher.waitFor([CommentStore.dispatchToken])
			_removeEditState(action.comment.id);
			EditStore.emitChange(CHANGE_EVENT);
		break;
		default:
	}
})

export default EditStore