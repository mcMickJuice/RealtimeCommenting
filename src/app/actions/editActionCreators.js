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
	exitEditMode: function(commentId) {
		chatDispatcher.dispatch({
			type: actionTypes.EXIT_EDIT_MODE,
			commentId
		})
	}
}