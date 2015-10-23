import React from 'react'
import ReactDOM from 'react-dom'
import CommentBox from './components/commentBox.jsx'
import chatDispatcher from './dispatcher/chatDispatcher'

ReactDOM.render(
	<CommentBox url="api/comments"/>,
	document.getElementById('reactContainer')
	)
