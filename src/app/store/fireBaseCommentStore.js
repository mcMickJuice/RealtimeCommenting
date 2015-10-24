import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import commentActions from '../actions/commentActionCreators'
import editActions from '../actions/editActionCreators'
import CommentStore from './commentStore'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import Firebase from 'firebase'

var actionTypes = commentConstants.actionTypes;
var _fbCommentReference = new Firebase('https://live-comments.firebaseio.com/comments');

_fbCommentReference.once('value', onDataLoaded);
_fbCommentReference.on('child_added', onChildAdded);
_fbCommentReference.on('child_removed', onChildRemoved);
_fbCommentReference.on('child_changed', onChildUpdated);
	
var initialDataSent = false;
var nextTick = function(callback) {
	setTimeout(callback,0);
}

function onDataLoaded(referenceHash) {
	var hash = referenceHash.val();

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
	initialDataSent = true;
}

function onChildAdded(snapshot, previousChildKey) {
	if(!initialDataSent) {
		return;
	}

	var {text, author, appId} = snapshot.val(),
		  key = snapshot.key();
	var comment = {
		text,
		author,
		appId,
		id:key
	};

	//persisted comment with key, should call out to stores that care about
	//new or created comments
	nextTick(() => commentActions.onCommentAddedToReference(comment));
	
}

function onChildUpdated(snapshot) {
	var {text, author, appId} = snapshot.val();
	var comment = {
		text,
		author,
		appId,
		id: snapshot.key()
	}

	nextTick(() => commentActions.onUpdatedComment(comment));
}

function onChildRemoved(snapshot) {
	var commentId = snapshot.key();
	nextTick(() => commentActions.onCommentDeletedFromReference(commentId));
}

var FirebaseStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {

	}
})

FirebaseStore.dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.SEND_COMMENT: 
			chatDispatcher.waitFor([CommentStore.dispatchToken]);
			var {text, author, appId, createdDate} = action;
			var comment = {text, author, appId, createdDate};
			_fbCommentReference.push(comment);
			break;

		case actionTypes.REPLY_TO_COMMENT:
			chatDispatcher.waitFor([CommentStore.dispatchToken]);
			var {text, author, appId, createdDate, parentId} = action.comment;
			var comment = {text, author, appId, createdDate, parentId};
			_fbCommentReference.push(comment, function() {
				editActions.exitEditReplyMode();
			});
			break;

		case actionTypes.DELETE_COMMENT:
			//not removing comment. We will mark as deleted but keep the comment
			_fbCommentReference.child(action.commentId).update({deleted:true})
			// _fbCommentReference.child(action.commentId).remove();
			break;

		case actionTypes.EDIT_COMMENT: 
			//chatDispatcher.waitFor([CommentStore.dispatchToken]);
			var timeStamp = new Date().getTime();
			var {author, text} = action.comment;
			var comment = {author, text, editedDate: timeStamp}
			_fbCommentReference.child(action.comment.id).update(comment);
			break;
		default:
	}
})