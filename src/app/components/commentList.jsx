import React from 'react'
import Comment from './comment.jsx'

var CommentList = React.createClass({
	render: function() {
		var self = this;
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment comment={comment} key={comment.appId}  
						 deleteMessage={self.props.deleteMessage}>
				</Comment>
				)
		})

		return (
			<div className="commentList">
				{commentNodes}
			</div>
			)
	}
})

export default CommentList