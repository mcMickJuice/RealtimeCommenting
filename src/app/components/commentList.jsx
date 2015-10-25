import React from 'react'
import Comment from './comment.jsx'
import '../styles/commentList.less'

var CommentList = React.createClass({

	buildTree: function(deleteFunc) {
		var tree = this.props.data;
		var deleteFunc = this.props.deleteComment.bind(this);

		function buildCommentBlock(comment) {
			// if(comment.deleted) {
			// 	return (<div key={comment.appId} className="deleted">Comment Has Been Deleted</div>)
			// }

			var childrenComments;
			if(comment.children) {
				childrenComments = comment.children.map(buildCommentBlock);
			} else {
				return (
					<div className="comment-group" key={comment.appId}>
						<Comment comment={comment}  isDeleted={comment.deleted}
								 deleteComment={deleteFunc}>
						</Comment>	
				</div>
					)
			}
			

			return (
				<div className="comment-group" key={comment.appId} >
						<Comment comment={comment}  
								 deleteComment={deleteFunc}>
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