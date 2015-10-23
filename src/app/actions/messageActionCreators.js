import chatDispatcher from '../dispatcher/chatDispatcher'
import messageConstants from '../constants/messageConstants'

var actionTypes = messageConstants.actionTypes;

export
default {
    sendMessage: function(text, author) {
        chatDispatcher.dispatch({
            type: actionTypes.SEND_MESSAGE,
            text,
            author
        })
    },
    editMessage: function(message) {
        chatDispatcher.dispatch({
            type: actionTypes.EDIT_MESSAGE,
            message
        })
    },
    deleteMessage: function(messageId) {
        chatDispatcher.dispatch({
            type: actionTypes.DELETE_MESSAGE,
            messageId
        })
    },
    onInitialDataLoad: function(collection) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_INITIAL_DATA_LOAD,
            collection
        })
    },
    onMessageAddedToReference: function(message) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_MESSAGE_REFERENCE_UPDATE,
            message
        })
    },

    onMessageDeletedFromReference: function(messageId) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_MESSAGE_DELETED_FROM_REFERENCE,
            messageId
        })
    },
    onUpdatedMessage: function(message) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_UPDATED_MESSAGE,
            message
        })
    }
}