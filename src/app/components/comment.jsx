import React from 'react'
import marked from 'marked'
import EditComment from './editComment.jsx'
import _ from 'lodash'

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

	render: function() {
		var date = _formatDate(this.props.comment.appId)
		var clonedComment = _.clone(this.props.comment)

		return (
		 <div className="comment">
		 	<h2 className="commentAuthor">
		 		{this.props.comment.author} - <em>on {date}</em>
		 	</h2>
		 	<span dangerouslySetInnerHTML={this.rawMarkup()} /> 
		 	<div onClick={this.onDeleteComment}>[Delete]</div>
		 	<EditComment comment={clonedComment}></EditComment>
		 </div>
			)
	}
})

export default Comment