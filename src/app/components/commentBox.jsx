import React from 'react'
import CommentList from './commentList.jsx'
import CommentForm from './commentForm.jsx'
import MessageStore from '../store/messageStore'
import FireBaseMessageStore from '../store/fireBaseMessageStore'
import MessageActions from '../actions/messageActionCreators'

function getStateFromStores() {
	return {
		messages: MessageStore.getMessagesForThread()
	}
}

function getCommentList(data) {
	if(data.length > 0) {
		var now = (new Date()).toLocaleTimeString();
			return (
				<div>
					<span>Last Update - {now}</span>
					<CommentList data={data} deleteMessage={MessageActions.deleteMessage}/>
				</div>
				
				)
		} 

		return (<div><em>Currently no comments available</em></div>);
}

var CommentBox = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},
	componentDidMount: function() {
		MessageStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		MessageStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
		this.setState(getStateFromStores())
	},
	render: function() {
		var commentList = getCommentList(this.state.messages);

		return (
<div className="commentBox">
	<h1>Comments</h1>
	{commentList}
	<CommentForm />
</div>
			);
	}
});

export default CommentBox;