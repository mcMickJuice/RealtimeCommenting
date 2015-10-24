import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'

var actionTypes = commentConstants.actionTypes;

export
default {
    sendComment: function(text, author) {
        chatDispatcher.dispatch({
            type: actionTypes.SEND_COMMENT,
            text,
            author
        })
    },
    editComment: function(comment) {
        chatDispatcher.dispatch({
            type: actionTypes.EDIT_COMMENT,
            comment
        })
    },
    deleteComment: function(commentId) {
        chatDispatcher.dispatch({
            type: actionTypes.DELETE_COMMENT,
            commentId
        })
    },
    replyToComment: function(comment) {
        chatDispatcher.dispatch({
            type: actionTypes.REPLY_TO_COMMENT,
            comment
        })
    },
    onInitialDataLoad: function(collection) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_INITIAL_DATA_LOAD,
            collection
        })
    },
    onCommentAddedToReference: function(comment) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_COMMENT_REFERENCE_UPDATE,
            comment
        })
    },

    onCommentDeletedFromReference: function(commentId) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_COMMENT_DELETED_FROM_REFERENCE,
            commentId
        })
    },
    onUpdatedComment: function(comment) {
        chatDispatcher.dispatch({
            type: actionTypes.ON_UPDATED_COMMENT,
            comment
        })
    }
}