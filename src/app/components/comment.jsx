import React from 'react'
import marked from 'marked'
import EditComment from './editComment.jsx'
import ReplyComment from './replyComment.jsx'
import _ from 'lodash'
import '../styles/comment.less'

var propTypes = React.PropTypes;

function _formatDate(milliseconds) {
		var date  = new Date(milliseconds);
		return date.toLocaleString();
}

var Comment = React.createClass({
	propTypes: {
		comment: propTypes.shape({
			text: propTypes.string.isRequired,
			author:propTypes.string.isRequired,
			appId: propTypes.number,
			id: propTypes.string,
			createdDate: propTypes.number.isRequired,
			editedDate: propTypes.number
		})
	},
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
			<EditComment comment={clonedComment} editState={this.props.editState}/>
			<ReplyComment parentId={this.props.comment.id} editState={this.props.editState}/>
			</div>
			: false
	},

	render: function() {
		var date = _formatDate(this.props.comment.clientId)
		var changeComponent = this.getEditOrReplyComponent();

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