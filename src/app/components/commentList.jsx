import React from 'react'
import Comment from './comment.jsx'
import '../styles/commentList.less'

var propTypes = React.PropTypes;

var CommentList = React.createClass({
	propTypes: {
		data: propTypes.array,
		deleteComment: propTypes.func.isRequired,
		editState: propTypes.object
	},

	buildTree: function() {
		var tree = this.props.data;
		var deleteFunc = this.props.deleteComment.bind(this);
		var editState = this.props.editState;

		function buildCommentBlock(comment) {
			if(comment.deleted) {
				return (<div key={comment.clientId} className="deleted">Comment Has Been Deleted</div>)
			}

			var childrenComments;
			if(comment.children) {
				childrenComments = comment.children.map(buildCommentBlock);
			} else {
				return (
					<div className="comment-group" key={comment.clientId}>
						<Comment comment={comment} 
								 deleteComment={deleteFunc}
								 editState={editState}>
						</Comment>	
				</div>
					)
			}
			

			return (
				<div className="comment-group" key={comment.clientId} >
						<Comment comment={comment}  
								 deleteComment={deleteFunc}
								 editState={editState}>
						</Comment>	
						<div className="comment-children">
							{childrenComments}
						</div>
				</div>
				)
		}

		var commentTree = tree.map(buildCommentBlock);
		return commentTree;
	},

	render: function() {
		var commentTree = this.buildTree();

		return (
			<div className="commentList">
				{commentTree}
			</div>
			)
	}
})

export default CommentList