import React from 'react'
import CommentList from './commentList.jsx'
import CommentForm from './commentForm.jsx'
import CommentStore from '../store/commentStore'
import FireBaseCommentStore from '../store/fireBaseCommentStore'
import CommentActions from '../actions/commentActionCreators'

function getStateFromStores() {
	return {
		comments: CommentStore.getCommentsForThread(),
		treeComments: CommentStore.getCommentTree()
	}
}

function getCommentList(data) {
	if(data.length > 0) {
		var now = (new Date()).toLocaleTimeString();
			return (
				<div>
					<span>Last Update - {now}</span>
					<CommentList data={data} deleteComment={CommentActions.deleteComment}/>
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
	},
	componentWillUnmount: function() {
		CommentStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
		this.setState(getStateFromStores())
	},
	render: function() {
		var commentList = getCommentList(this.state.treeComments);

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