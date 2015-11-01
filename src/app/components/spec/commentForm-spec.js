var React = require('react')
var testUtils = require('react/lib/ReactTestUtils')
var CommentForm = require('../commentForm.jsx')

describe('Comment Form', function() {
	var submitAction = jasmine.createSpy('submitAction');
	var defaultProps = {
		submitAction
	};
	var component;
	beforeEach(function() {
		//create component, inject defaultProps
		component = testUtils.renderIntoDocument(<CommentForm {...defaultProps} />)
	})

	it('should be in DOM', function() {
		expect(component).toBeTruthy();
	})

	xdescribe('clicking submit', function() {
		//this doesn't work because ReactTestUtils doesn't actually call a submit 
		//event??? - https://github.com/facebook/jest/issues/207
		var form;
		beforeEach(function() {
			spyOn(component,'handleSubmit');
			form = testUtils.findRenderedDOMComponentWithTag(component, "form");
			testUtils.Simulate.submit(form);
		})

		it('should have called submitAction', function() {

			expect(component.handleSubmit).toHaveBeenCalled();
		})
	})
})