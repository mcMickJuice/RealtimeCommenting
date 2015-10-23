import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'
import commentActions from '../actions/commentActionCreators'
import CommentStore from './commentStore'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import Firebase from 'firebase'

var actionTypes = commentConstants.actionTypes;
var _fbCommentReference = new Firebase('https://jsbincomment.firebaseio.com/comments');

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
			var {text, author, appId} = action
			var comment = {text, author, appId };
			_fbCommentReference.push(comment);
		break;

		case actionTypes.DELETE_COMMENT:
			_fbCommentReference.child(action.commentId).remove();
		break;

		case actionTypes.EDIT_COMMENT: 
			//chatDispatcher.waitFor([CommentStore.dispatchToken]);
			var {author, text} = action.comment;
			var comment = {author, text}
			_fbCommentReference.child(action.comment.id).update(comment);
		break;
		default:
	}
})