import React from 'react'
import EditActions from '../actions/editActionCreators'
import CommentConstants from '../constants/commentConstants'
import CommentActions from '../actions/commentActionCreators'
import EditStore from '../store/editStore'

var ReactPropTypes = React.PropTypes;
var REPLY_MODE = CommentConstants.modeTypes.REPLY_MODE;

//we still will enter a edit state when replying to comment so we'll need to close out all other
//reply or edit dialogs.

//user can only edit or reply to a comment, they can't do both

function getStateFromStores() {
	return {
		replyState: EditStore.getState()
	}
}

var ReplyComment = React.createClass({
	propTypes: {
		parentId: ReactPropTypes.string.isRequired
	},
	getInitialState: function() {
		return getStateFromStores();
	},
	componentDidMount: function() {
		EditStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		EditStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
		this.setState(getStateFromStores())
	},
	onCancelReply: function() {
		EditActions.exitEditReplyMode();
	},
	onEnterReply: function() {
		EditActions.enterReplyMode(this.props.parentId);
	},
	onSubmit: function() {
		var text = this.refs.commentText.value;
		var comment = {parentId: this.props.parentId, text, author: 'Replier!'}

		CommentActions.replyToComment(comment);
	},
	getReplyTemplate: function() {
		var state = this.state.replyState;
		var isReplyingToCurrentComment = state.mode === REPLY_MODE && state.commentId === this.props.parentId;
	

		return isReplyingToCurrentComment
		?
		<div className="reply-input-container">
			<textarea ref="commentText" placeholder="Your reply here"/>
			<div className="btn-group">
					<button type="button" onClick={this.onSubmit}>Submit Reply</button>
				  <button type="button" onClick={this.onCancelReply}>Cancel</button>
	  		</div>
		</div>
		:
		<div className="btn-group"> 
  			<button type="button" onClick={this.onEnterReply}>Reply To Comment</button>
  	</div>
	},
	//require a parent Id
	render: function() {
		var template = this.getReplyTemplate()

		return (<div className="reply-container">
			{template}
				</div>
			)
	}
})

export default ReplyComment