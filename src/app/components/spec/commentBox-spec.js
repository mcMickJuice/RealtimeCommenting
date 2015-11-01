import React from 'react'
import testUtils from 'react/lib/ReactTestUtils'
import CommentBox from '../commentBox.jsx'

//yay it renders
//https://github.com/kentor/react-flux-testing/blob/master/src/components/__tests__/MemberList-test.js
//for examples on how to simulate interaction with component
describe('CommentBox', function() {
	it('renders', () => {
		var element = testUtils.renderIntoDocument(<CommentBox />);
		expect(element).toBeTruthy();
	})
})