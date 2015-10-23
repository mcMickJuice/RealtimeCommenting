import React from 'react'
//import CommentStore from './store/commentStore.js'
import commentActionCreator from '../actions/commentActionCreators'

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.value.trim();
		var text = this.refs.text.value.trim();
		if(!text || !author) {
			return;
		}

		//TODO send request to server
		this.refs.author.value = '';
		this.refs.text.value = '';
		commentActionCreator.sendComment(text, author);
		return;
	},

	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your Name" ref="author"/>
				<input type="text" placeholder="Say something..." ref="text"/>
				<input type="submit" value="Post Comment" />
			</form>
			)
	}
})

export default CommentForm