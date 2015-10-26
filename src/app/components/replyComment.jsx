import React from 'react'
import EditActions from '../actions/editActionCreators'
import CommentConstants from '../constants/commentConstants'
import CommentActions from '../actions/commentActionCreators'
// import EditStore from '../store/editStore'

var ReactPropTypes = React.PropTypes;
var REPLY_MODE = CommentConstants.modeTypes.REPLY_MODE;

//we still will enter a edit state when replying to comment so we'll need to close out all other
//reply or edit dialogs.

//user can only edit or reply to a comment, they can't do both

var initialState = {text: ''};

var ReplyComment = React.createClass({
	propTypes: {
		parentId: ReactPropTypes.string.isRequired,
		editState: ReactPropTypes.object.isRequired
	},
	getInitialState: function() {
		return initialState;
	},
	resetState: function() {
		this.setState(initialState);
	},
	onCancelReply: function() {
		EditActions.exitEditReplyMode();
		this.resetState();
	},
	onEnterReply: function() {
		EditActions.enterReplyMode(this.props.parentId);
	},
	onSubmit: function() {
		var text = this.state.text;
		var comment = {parentId: this.props.parentId, text, author: 'Replier!'}

		CommentActions.replyToComment(comment);
		this.resetState();
	},
	handleTextChange: function(e) {
		var text = e.target.value;
		this.setState({text})
	},
	getReplyTemplate: function() {
		var state = this.props.editState;
		var text = this.state.text;
		var isReplyingToCurrentComment = state.mode === REPLY_MODE && state.commentId === this.props.parentId;
	

		return isReplyingToCurrentComment
		?
		<div className="reply-input-container">
			<textarea ref="commentText" value={text} placeholder="Your reply here" onChange={this.handleTextChange}/>
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