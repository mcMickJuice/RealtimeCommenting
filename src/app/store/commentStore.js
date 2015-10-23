import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import {EventEmitter} from 'events'
import Firebase from 'firebase'
import assign from 'object-assign'
import _ from 'lodash'

var actionTypes = commentConstants.actionTypes;
var CHANGE_EVENT = 'change';

function _setInternalComments(commentCollection) {
	_internalData = commentCollection;
}

function _pushComment(comment) {
	_internalData.push(comment);
}

function _updateComment(newComment) {
	//find index and comment
	var foundIndex,
				commentToUpdate;

	_internalData.every((msg, idx) => {
		if(msg.id === newComment.id) {
			foundIndex = idx;
			commentToUpdate = msg;
			return false;
		}

		return true
	})

	_internalData[foundIndex] = _.extend(commentToUpdate, newComment);
}

function _pushOrUpdateComment(newComment) {
	//how do I update comment thats been added? need to create reference when first created?
	var comment = _.find(_internalData, comment => comment.appId === newComment.appId);

	if(comment) {
		comment.id = newComment.id
	} else {
		//push comment
		_pushComment(newComment);
	}
}

function _removeComment(commentId) {
	_.remove(_internalData, comment => comment.id === commentId);
}

var _internalData = [];

var CommentStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	},
	get: function(commentId) {
		var comment = _find(_internalData, comment => comment.id === commentId);

		return comment;
	},
	getCommentsForThread: function(threadId) {
		// const comments = _internalData.filter(comment => comment.threadId === threadId);
		const comments = _internalData.slice(0);


		return comments;
	}
})

CommentStore.dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.SEND_COMMENT:
			var timeStamp = new Date().getTime();
			//append this on action to flow to next store that needs it...maybe?
			action.appId = timeStamp;
			var {text, author, appId} = action;

			_pushComment({text, 
										author,
										appId}) 
			CommentStore.emitChange()
			break;

		case actionTypes.ON_COMMENT_DELETED_FROM_REFERENCE:
		 _removeComment(action.commentId)
		 CommentStore.emitChange();

		 break;

		case actionTypes.ON_COMMENT_REFERENCE_UPDATE:
			_pushOrUpdateComment(action.comment);
			CommentStore.emitChange();
		break;

		case actionTypes.ON_INITIAL_DATA_LOAD:
			var collection = action.collection;
			_setInternalComments(collection);
			CommentStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_COMMENT:
			_updateComment(action.comment);

			CommentStore.emitChange();
		break;

		default:
	}
})

export default CommentStore