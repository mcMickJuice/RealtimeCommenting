import {createTreeFromFlatList} from '../utility'

describe('createTreeFromFlatList', function() {
	describe('should create heirarchy', function() {
		var tree, list;
		beforeEach(function() {
			list = [
				{id: 1, parentId: undefined, text: 'hello'},
				{id: 2, parentId: 1, text: 'hello'},
				{id: 3, parentId: 1, text: 'hello'},
				{id: 4, parentId: undefined, text: 'hello'},
				{id: 5, parentId: 4, text: 'hello'},
			];
			tree = createTreeFromFlatList('id', 'parentId',list);
		})
		it('with parents at top', function() {
			var parentCount = list.filter(item => !item.parentId).length;
			expect(parentCount).toEqual(tree.length);
		})

		it('and children for each parent', function() {
			tree.forEach(parent => {
				expect(parent.children).not.toBeUndefined()
				expect(parent.children.length).not.toEqual(0);
			})
		})
	})

})