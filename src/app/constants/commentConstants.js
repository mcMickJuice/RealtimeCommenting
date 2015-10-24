var constants = {
	actionTypes: {
		SEND_COMMENT: 'send-comment',
		EDIT_COMMENT: 'edit-comment',
		DELETE_COMMENT: 'delete-comment',
		REPLY_TO_COMMENT: 'reply-to-comment',
		ON_COMMENT_REFERENCE_UPDATE: 'on-comment-reference-update',
		ON_INITIAL_DATA_LOAD: 'on-initial-data-load',
		ON_COMMENT_DELETED_FROM_REFERENCE: 'on-comment-deleted-from-reference',
		ON_UPDATED_COMMENT: 'on-updated-comment',
		ENTER_EDIT_MODE: 'enter-edit-mode',
		ENTER_REPLY_MODE: 'enter-reply-mode',
		EXIT_EDIT_REPLY_MODE: 'exit-edit-reply-mode'
	},
	eventTypes: {
		CHANGE_EVENT: 'change'
	},
	modeTypes: {
		EDIT_MODE: 'edit-mode',
		REPLY_MODE: 'reply-mode'
	}
}

export default constants;