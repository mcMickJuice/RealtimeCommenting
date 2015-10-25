import chatDispatcher from '../dispatcher/chatDispatcher'
import CommentConstants from '../constants/commentConstants'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import CommentStore from './commentStore'

var actionTypes = CommentConstants.actionTypes;
var CHANGE_EVENT = CommentConstants.eventTypes.CHANGE_EVENT;
var EDIT_MODE = CommentConstants.modeTypes.EDIT_MODE;
var REPLY_MODE = CommentConstants.modeTypes.REPLY_MODE;

var _editState = {}

function _setEditState(commentId) {
	_editState = {commentId, mode: EDIT_MODE}
}

//commentId is parentId
function _setReplyState(commentId) {
	_editState = {commentId, mode: REPLY_MODE}
}

function _resetState() {
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
			console.log('CHANGE - ENTER_EDIT_MODE')
			EditStore.emitChange();
		break;
		case actionTypes.EXIT_EDIT_REPLY_MODE:
			_resetState()
			console.log('CHANGE - EXIT_EDIT_REPLY_MODE')

			EditStore.emitChange();
		break;

		case actionTypes.ENTER_REPLY_MODE:
			_setReplyState(action.parentId);
			console.log('CHANGE - ENTER_REPLY_MODE')

			EditStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_COMMENT:
			chatDispatcher.waitFor([CommentStore.dispatchToken])
			console.log('CHANGE - ON_UPDATED_COMMENT')
			
			_resetState();
			EditStore.emitChange(CHANGE_EVENT);
		break;
		default:
	}
})

export default EditStore