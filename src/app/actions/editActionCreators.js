import chatDispatcher from '../dispatcher/chatDispatcher'
import commentConstants from '../constants/commentConstants'

var actionTypes = commentConstants.actionTypes;

export default {
	enterEditMode: function(commentId) {
		chatDispatcher.dispatch({
			type: actionTypes.ENTER_EDIT_MODE,
			commentId
		})
	},
	enterReplyMode: function(parentId) {
		chatDispatcher.dispatch({
			type: actionTypes.ENTER_REPLY_MODE,
			parentId
		})
	},
	exitEditReplyMode: function() {
		chatDispatcher.dispatch({
			type: actionTypes.EXIT_EDIT_REPLY_MODE
		})
	},

}