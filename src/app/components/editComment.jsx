import React from 'react'
import EditActions from '../actions/editActionCreators'
import MessageActions from '../actions/messageActionCreators'
import EditStore from '../store/editStore'
import _ from 'lodash'
//edit Store to listen for edit state update

function getStateFromStores() {
	return {
		editState: EditStore.getState()
	}
}

var EditComment = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},
	componentDidMount: function() {
		EditStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		EditStore.removeChangeListener(this._onChange);
	},
	_onChange: function() {
		this.setState(getStateFromStores());
	},

  //accepts comment as prop
  onCancelEdit: function() {
      EditActions.exitEditMode(this.props.comment.id);
  },

  onEnterEdit: function() {
      EditActions.enterEditMode(this.props.comment.id)
  },
  onSubmit: function() {
  		var updatedText = this.refs.commentText.value;
  		var updatedComment = _.extend(this.props.comment, {text: updatedText});

      MessageActions.editMessage(updatedComment);
  },

  getEditTemplate: function () {
  	var state = this.state.editState;
  	var isEditingCurrentMessage = state.isEditMode && state.messageId === this.props.comment.id;

  	return isEditingCurrentMessage
  		? 
  		<div className="edit-input-container">
  			<textarea ref="commentText" defaultValue={this.props.comment.text} />
	  		<div className="btn-group">
					<button type="button" onClick={this.onSubmit}>Submit Changes</button>
				  <button type="button" onClick={this.onCancelEdit}>Cancel Changes</button>
	  		</div>
  		</div>
  		: 
  		<div className="btn-group"> 
  			<button type="button" onClick={this.onEnterEdit}>Edit Comment</button>
  		</div>
  },

  render: function() {
  	var template = this.props.comment.id 
  		? this.getEditTemplate() 
  		: "";

  	return (<div className="edit-container">
  		{template}
  		</div>)
  	}
 
})

export
default EditComment