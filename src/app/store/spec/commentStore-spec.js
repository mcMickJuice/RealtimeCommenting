var _ = require('lodash'),
	rewire = require('rewire');
	

describe('CommentStore', () => {
	var CommentActions,
		CommentStore,
		uniqueId;

	beforeEach(() => {
		jasmine.clock().install(); //mock out the built in timers
		CommentStore = rewire('../commentStore')	
		CommentActions = require('../../actions/commentActionCreators')
		uniqueId = 'bestIdEvah';
		CommentStore.__set__('getUniqueId', () => uniqueId);
	})

	afterEach(() => {
		jasmine.clock().uninstall();
	})

	it('stores comment when comment sent', () => {
		var text = 'Hello',
			author = 'text Author';

		CommentActions.sendComment(text, author);
		jasmine.clock().tick(); //advance the clock to the next tick
		var first = CommentStore.getCommentTree()[0];
		expect(first['text']).toEqual(text)
		expect(first['author']).toEqual(author)
	})

	it('updates comment with id if it exists', function() {
		var newComment = {
			text: 'hello'
		};

		CommentActions.sendComment(newComment.text, 'new author');
		jasmine.clock().tick();
		var newId = 'myNewId';
		var updateComment = {
			clientId: uniqueId,
			id: newId
		}
		CommentActions.onCommentAddedToReference(updateComment);
		jasmine.clock().tick();
		var storedComment = CommentStore.getCommentTree()[0];
		expect(storedComment.id).toEqual(newId);
	})

	it('creates new comment if it doesn\'t exist', () => {
		var newComment = {
			text: 'im new!',
			id: 'fluff poof'
		};
		CommentActions.onCommentAddedToReference(newComment);
		jasmine.clock().tick();
		var storedComment = CommentStore.getCommentTree()[0];
		expect(storedComment.clientId).toBeUndefined();
		expect(storedComment.id).toEqual(newComment.id);
	})

	it('updates existing comment with text', () => {
		var id = 'hello';

		var newComment = {
			text: 'im new!',
			id
		};

		var internalList = CommentStore.__get__('_commentsList');
		internalList.push(newComment);
		jasmine.clock().tick();

		var updatedComment = {
			text: 'im updated!',
			id
		}

		CommentActions.onUpdatedComment(updatedComment);
		jasmine.clock().tick();
		var storedComment = CommentStore.getCommentTree()[0];
		expect(storedComment.text).toEqual(updatedComment.text);
	})
})