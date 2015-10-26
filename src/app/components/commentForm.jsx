import React from 'react'
//import CommentStore from './store/commentStore.js'
import commentActionCreator from '../actions/commentActionCreators'

var initialState = {text: ''};

var CommentForm = React.createClass({
	getInitialState: function() {
		return initialState;
	},
	resetState: function() {
		this.setState(initialState)
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.value.trim();
		var text = this.state.text;
		if(!text || !author) {
			return;
		}

		//TODO send request to server
		this.refs.author.value = '';
		this.refs.commentText.value = '';
		this.resetState();
		commentActionCreator.sendComment(text, author);
		return;
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value})
	},

	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your Name" ref="author"/>
				<input type="text" placeholder="Say something..." ref="commentText" onChange={this.handleTextChange}/>
				<input type="submit" value="Post Comment" />
			</form>
			)
	}
})

export default CommentForm