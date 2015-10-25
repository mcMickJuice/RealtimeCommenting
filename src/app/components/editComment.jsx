import React from 'react'
import EditActions from '../actions/editActionCreators'
import CommentConstants from '../constants/commentConstants'
import CommentActions from '../actions/commentActionCreators'
import EditStore from '../store/editStore'
import _ from 'lodash'
//edit Store to listen for edit state update

var ReactPropTypes = React.PropTypes;
var EDIT_MODE = CommentConstants.modeTypes.EDIT_MODE;

function getStateFromStores() {
	return {
		editState: EditStore.getState()
	}
}

var EditComment = React.createClass({
  //TODO require that message is passed in!
  propTypes: {
    comment: ReactPropTypes.object.isRequired
  },

	getInitialState: function() {
    var editState = getStateFromStores();
    editState.text = this.props.comment.text;
		return editState;
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
      EditActions.exitEditReplyMode();
  },

  onEnterEdit: function() {
      EditActions.enterEditMode(this.props.comment.id)
  },
  onSubmit: function() {
  		var updatedText = this.refs.commentText.value;
  		var updatedComment = _.extend(this.props.comment, {text: updatedText});

      CommentActions.editComment(updatedComment);
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  getEditTemplate: function () {
  	var state = this.state.editState;
    var textVal = this.state.text;
  	var isEditingCurrentComment = state.mode === EDIT_MODE && state.commentId === this.props.comment.id;

  	return isEditingCurrentComment
  		? 
  		<div className="edit-input-container">
  			<textarea ref="commentText" value={textVal} onChange={this.handleTextChange} />
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
  	var template = this.getEditTemplate() 

  	return (<div className="edit-container">
  		{template}
  		</div>)
  	}
 
})

export
default EditComment