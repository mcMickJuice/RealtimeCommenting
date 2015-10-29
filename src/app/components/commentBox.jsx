import React from 'react'
import CommentList from './commentList.jsx'
import CommentForm from './commentForm.jsx'
import CommentStore from '../store/commentStore'
import EditStore from '../store/editStore'
import FireBaseCommentStore from '../store/fireBaseCommentStore'
import CommentActions from '../actions/commentActionCreators'

var refUrl = 'https://live-comments.firebaseio.com/comments';

new FireBaseCommentStore(refUrl)
	.startListening();

function getStateFromStores() {
	return {
		treeComments: CommentStore.getCommentTree(),
		editReplyState: EditStore.getState()
	}
}

function getCommentList(data, editReplyState) {
	if(data.length > 0) {
		var now = (new Date()).toLocaleTimeString();
			return (
				<div>
					<span>Last Update - {now}</span>
					<CommentList data={data} deleteComment={CommentActions.deleteComment} editState={editReplyState} />
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
		CommentStore.addChangeListener(this._onChange);
		EditStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		CommentStore.removeChangeListener(this._onChange);
		EditStore.removeChangeListener(this._oneChange);
	},
	_onChange: function() {
		this.setState(getStateFromStores())
	},
	render: function() {
		var commentList = getCommentList(this.state.treeComments, this.state.editReplyState);

		return (
<div className="commentBox">
	<h1>Comments</h1>
	<CommentForm submitAction={CommentActions.sendComment}/>
	{commentList}
</div>
			);
	}
});

export default CommentBox;