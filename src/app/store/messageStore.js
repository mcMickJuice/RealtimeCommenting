import chatDispatcher from '../dispatcher/chatDispatcher'
import messageConstants from '../constants/messageConstants'
import {EventEmitter} from 'events'
import Firebase from 'firebase'
import assign from 'object-assign'
import _ from 'lodash'

var actionTypes = messageConstants.actionTypes;
var CHANGE_EVENT = 'change';

function _setInternalMessages(messageCollection) {
	_internalData = messageCollection;
}

function _pushMessage(message) {
	_internalData.push(message);
}

function _updateMessage(newMessage) {
	//find index and message
	var foundIndex,
				messageToUpdate;

	_internalData.every((msg, idx) => {
		if(msg.id === newMessage.id) {
			foundIndex = idx;
			messageToUpdate = msg;
			return false;
		}

		return true
	})

	_internalData[foundIndex] = _.extend(messageToUpdate, newMessage);
}

function _pushOrUpdateMessage(newMessage) {
	//how do I update message thats been added? need to create reference when first created?
	var message = _.find(_internalData, message => message.appId === newMessage.appId);

	if(message) {
		message.id = newMessage.id
	} else {
		//push message
		_pushMessage(newMessage);
	}
}

function _removeMessage(messageId) {
	_.remove(_internalData, message => message.id === messageId);
}

var _internalData = [];

var MessageStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	},
	get: function(messageId) {
		var message = _find(_internalData, message => message.id === messageId);

		return message;
	},
	getMessagesForThread: function(threadId) {
		// const messages = _internalData.filter(message => message.threadId === threadId);
		const messages = _internalData.slice(0);


		return messages;
	}
})

MessageStore.dispatchToken = chatDispatcher.register(function(action) {
	switch(action.type) {
		case actionTypes.SEND_MESSAGE:
			var timeStamp = new Date().getTime();
			//append this on action to flow to next store that needs it...maybe?
			action.appId = timeStamp;
			var {text, author, appId} = action;

			_pushMessage({text, 
										author,
										appId}) 
			MessageStore.emitChange()
			break;

		case actionTypes.ON_MESSAGE_DELETED_FROM_REFERENCE:
		 _removeMessage(action.messageId)
		 MessageStore.emitChange();

		 break;

		case actionTypes.ON_MESSAGE_REFERENCE_UPDATE:
			_pushOrUpdateMessage(action.message);
			MessageStore.emitChange();
		break;

		case actionTypes.ON_INITIAL_DATA_LOAD:
			var collection = action.collection;
			_setInternalMessages(collection);
			MessageStore.emitChange();
		break;

		case actionTypes.ON_UPDATED_MESSAGE:
			_updateMessage(action.message);

			MessageStore.emitChange();
		break;

		default:
	}
})

export default MessageStore