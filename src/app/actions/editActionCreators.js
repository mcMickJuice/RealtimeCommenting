import chatDispatcher from '../dispatcher/chatDispatcher'
import messageConstants from '../constants/messageConstants'

var actionTypes = messageConstants.actionTypes;

export default {
	enterEditMode: function(messageId) {
		chatDispatcher.dispatch({
			type: actionTypes.ENTER_EDIT_MODE,
			messageId
		})
	},
	exitEditMode: function(messageId) {
		chatDispatcher.dispatch({
			type: actionTypes.EXIT_EDIT_MODE,
			messageId
		})
	}
}