import React from 'react'
import testUtils from 'react/lib/ReactTestUtils'
import CommentBox from '../commentBox.jsx'

//yay it renders
describe('CommentBox', function() {
	it('renders', () => {
		var element = testUtils.renderIntoDocument(<CommentBox />);
		expect(element).toBeTruthy();
	})
})