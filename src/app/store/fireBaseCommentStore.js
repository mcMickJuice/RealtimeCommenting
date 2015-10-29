import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import commentActions from '../actions/commentActionCreators'
import editActions from '../actions/editActionCreators'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import tokenStoreProvider from './dispatchTokenStoreProvider'
import {nextTick} from '../common/utility'
import firebaseService from './services/firebaseService'

var actionTypes = commentConstants.actionTypes;
	
var initialDataSent = false;

function createNewMessageFromSnapshot(snapshot) {
	var {text, author, clientId, createdDate} = snapshot.val(),
		  key = snapshot.key(); 

	var comment = {
		text,
		author,
		clientId,
		createdDate,
		id: key
	};

	return comment
}

function createUpdatedMessageFromSnapshot(snapshot) {
	var {text, author, clientId, editedDate, deleted} = snapshot.val(),
		key = snapshot.key();

	var comment = {
		text,
		author,
		clientId,
		editedDate,
		deleted,
		id: key
	};

	return comment;
}

function onDataLoaded(referenceHash) {
	var hash = referenceHash.val();
	initialDataSent = true;


	//empty reference
	if(!hash) {
		return;
	}

	//reference id is hash key
	var commentCollection = Object.keys(hash).map(key => {
		var obj = hash[key];
		obj.id = key;
		return obj;
	})

	commentActions.onInitialDataLoad(commentCollection);
}

function onChildAdded(snapshot, previousChildKey) {
	if(!initialDataSent) {
		return;
	}

	var comment = createNewMessageFromSnapshot(snapshot);

	commentActions.onCommentAddedToReference(comment)
	
}

function onChildUpdated(snapshot) {
	var comment = createUpdatedMessageFromSnapshot(snapshot);

	commentActions.onUpdatedComment(comment);
}

var _firebaseInst;

function FirebaseStore(referenceUrl) {
	_firebaseInst = new firebaseService(referenceUrl);
}

FirebaseStore.prototype.startListening = function() {
		_firebaseInst.onceValue(onDataLoaded)
		_firebaseInst.onAdded(onChildAdded)
		_firebaseInst.onUpdated(onChildUpdated)

		_registerWithDispatcher();
}

function _registerWithDispatcher() {
	const dispatchToken = chatDispatcher.register(function(action) {
	var commentStoreToken = tokenStoreProvider.get('commentStore');
	switch(action.type) {
		case actionTypes.SEND_COMMENT: 
			chatDispatcher.waitFor([commentStoreToken]);
			var {text, author, clientId, createdDate} = action;
			var comment = {text, author, clientId, createdDate};
			// _fbCommentReference.push(comment);
			_firebaseInst.push(comment);
			break;

		case actionTypes.REPLY_TO_COMMENT:
			chatDispatcher.waitFor([commentStoreToken]);
			var {text, author, clientId, createdDate, parentId} = action.comment;
			var comment = {text, author, clientId, createdDate, parentId};
			// _fbCommentReference.push(comment, function() {
			// 	editActions.exitEditReplyMode();
			// });
			_firebaseInst.push(comment, () => editActions.exitEditReplyMode());
			break;

		case actionTypes.DELETE_COMMENT:
			//not removing comment. We will mark as deleted but keep the comment
			// _fbCommentReference.child(action.commentId).update({deleted:true})
			_firebaseInst.update({deleted: true}, action.commentId);
			break;

		case actionTypes.EDIT_COMMENT: 
			//chatDispatcher.waitFor([CommentStore.dispatchToken]);
			var timeStamp = new Date().getTime();
			var {author, text} = action.comment;
			var comment = {author, text, editedDate: timeStamp}
			// _fbCommentReference.child(action.comment.id).update(comment);
			_firebaseInst.update(comment, action.comment.id);
			break;
		default:
	}
})

	tokenStoreProvider.registerToken('fireBaseCommentStore', dispatchToken)
}



export default FirebaseStore