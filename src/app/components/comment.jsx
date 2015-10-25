import React from 'react'
import marked from 'marked'
import EditComment from './editComment.jsx'
import ReplyComment from './replyComment.jsx'
import _ from 'lodash'
import '../styles/comment.less'

function _formatDate(milliseconds) {
		var date  = new Date(milliseconds);
		return date.toLocaleString();
}

var Comment = React.createClass({
	rawMarkup: function() {
		var rawMarkup = marked(this.props.comment.text, {sanitize:true});
		return { __html: rawMarkup};
	},

	onDeleteComment: function(){
		this.props.deleteComment(this.props.comment.id);
	},
	getEditOrReplyComponent: function() {
		//placeholder for now. Just return both
		var clonedComment = _.clone(this.props.comment)

		return this.props.comment.id 
			? <div>
			<EditComment comment={clonedComment} />
			<ReplyComment parentId={this.props.comment.id} />
			</div>
			: false
	},

	render: function() {
		var date = _formatDate(this.props.comment.appId)
		var changeComponent = this.getEditOrReplyComponent();
		var isDeleted = this.props.isDeleted;

		if(isDeleted) {
			return (<div className="deleted">Comment Has Been Deleted</div>)
		} 

		return (
		 <div className="comment">
		 	<h2 className="commentAuthor">
		 		{this.props.comment.author} - <em>on {date}</em>
		 	</h2>
		 	<span dangerouslySetInnerHTML={this.rawMarkup()} /> 
		 	<div onClick={this.onDeleteComment}>[Delete]</div>
		 	{changeComponent}

		 </div>
			)
	}
})

export default Comment