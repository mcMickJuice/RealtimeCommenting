import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import _ from 'lodash'
import utility from '../common/utility'
import tokenStoreProvider from './dispatchTokenStoreProvider'

//needed for rewire to work in tests. import {} deconstruction pattern doesn't seem to work...
var {createTreeFromFlatList, getUniqueId} = utility

var actionTypes = commentConstants.actionTypes;
var CHANGE_EVENT = commentConstants.eventTypes.CHANGE_EVENT;

//always refer to comments in collection used comment.id NEVER clientId. ClientId is a temporary key
//used to update a comment after we get an update from the firebase store with the firebase id
function _commentSortByDateDescending(a,b) {
	return b.createdDate - a.createdDate;
}

function _setInternalComments(commentCollection) {
	_commentsList = commentCollection;
}

function _pushComment(comment) {
	_commentsList.push(comment);
}

function _updateComment(newComment) {
	var foundIndex,
				commentToUpdate;

	_commentsList.every((msg, idx) => {
		if(msg.id === newComment.id) {
			foundIndex = idx;
			commentToUpdate = msg;
			return false;
		}

		return true
	})

	_commentsList[foundIndex] = _.extend(commentToUpdate, newComment);
}

function _pushOrUpdateComment(newComment) {
	var comment = _.find(_commentsList, comment => comment.clientId === newComment.clientId);

	if(comment) {
		comment.id = newComment.id
	} else {
		_pushComment(newComment);
	}
}
 
var _commentsList = [];

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
		var comment = _find(_commentsList, comment => comment.id === commentId);

		return comment;
	},
	getCommentTree: function() {
		const comments = _commentsList.slice(0).sort(_commentSortByDateDescending);

		var treeOfComments = createTreeFromFlatList('id','parentId', comments);

		return treeOfComments;
	}
})

const dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.SEND_COMMENT:
			var clientId = getUniqueId();
			//append this on action to flow to next store that needs it (e.g. firebase store)?
			action.clientId = clientId;
			action.createdDate = clientId
			var {text, author, clientId, createdDate} = action;

			_pushComment({text, 
										author,
										clientId,
										createdDate}) 
			break;

		case actionTypes.REPLY_TO_COMMENT:
			var clientId = getUniqueId();
			action.comment.clientId = clientId;
			action.comment.createdDate = new Date().getTime();
			var {text, author, clientId, createdDate, parentId} = action.comment;

			var comment = {text, author, clientId, createdDate, parentId}

			_pushComment(comment);
		break;

		case actionTypes.ON_COMMENT_REFERENCE_UPDATE:
			_pushOrUpdateComment(action.comment);
			console.log('CHANGE - ON_COMMENT_REFERENCE_UPDATE')
			CommentStore.emitChange();
		break;

		case actionTypes.ON_INITIAL_DATA_LOAD:
			var collection = action.collection;
			_setInternalComments(collection);
			console.log('CHANGE - ON_INITIAL_DATA_LOAD')
			CommentStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_COMMENT:
			_updateComment(action.comment);
			console.log('CHANGE - ON_UPDATED_COMMENT')

			CommentStore.emitChange();
		break;

		default:
	}
})

tokenStoreProvider.registerToken('commentStore', dispatchToken)

export default CommentStore