import chatDispatcher from '../dispatcher/chatDispatcher'
import messageConstants from '../constants/messageConstants'
import messageActions from '../actions/messageActionCreators'
import MessageStore from './messageStore'
import {EventEmitter} from 'events'
import assign from 'object-assign'
import Firebase from 'firebase'

var actionTypes = messageConstants.actionTypes;
var _fbMessageReference = new Firebase('https://jsbincomment.firebaseio.com/comments');

_fbMessageReference.once('value', onDataLoaded);
_fbMessageReference.on('child_added', onChildAdded);
_fbMessageReference.on('child_removed', onChildRemoved);
_fbMessageReference.on('child_changed', onChildUpdated);
	
var initialDataSent = false;
var nextTick = function(callback) {
	setTimeout(callback,0);
}

function onDataLoaded(referenceHash) {
	var hash = referenceHash.val();

	//reference id is hash key
	var messageCollection = Object.keys(hash).map(key => {
		var obj = hash[key];
		obj.id = key;
		return obj;
	})

	messageActions.onInitialDataLoad(messageCollection);
	initialDataSent = true;
}

function onChildAdded(snapshot, previousChildKey) {
	if(!initialDataSent) {
		return;
	}

	var {text, author, appId} = snapshot.val(),
		  key = snapshot.key();
	var message = {
		text,
		author,
		appId,
		id:key
	};

	//persisted message with key, should call out to stores that care about
	//new or created messages
	nextTick(() => messageActions.onMessageAddedToReference(message));
	
}

function onChildUpdated(snapshot) {
	var {text, author, appId} = snapshot.val();
	var message = {
		text,
		author,
		appId,
		id: snapshot.key()
	}

	nextTick(() => messageActions.onUpdatedMessage(message));
}

function onChildRemoved(snapshot) {
	var messageId = snapshot.key();
	nextTick(() => messageActions.onMessageDeletedFromReference(messageId));
}

var FirebaseStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {

	}
})

FirebaseStore.dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.SEND_MESSAGE: 
			chatDispatcher.waitFor([MessageStore.dispatchToken]);
			var {text, author, appId} = action
			var message = {text, author, appId };
			_fbMessageReference.push(message);
		break;

		case actionTypes.DELETE_MESSAGE:
			_fbMessageReference.child(action.messageId).remove();
		break;

		case actionTypes.EDIT_MESSAGE: 
			//chatDispatcher.waitFor([MessageStore.dispatchToken]);
			var {author, text} = action.message;
			var message = {author, text}
			_fbMessageReference.child(action.message.id).update(message);
		break;
		default:
	}
})