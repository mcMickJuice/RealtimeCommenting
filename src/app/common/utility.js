//common utility functions used throughout the app
import _ from 'lodash'


/**
 * Pure Function that takes item and parentIds and builds a tree from a list. 
 * @param  {string} String of ItemId to be used to identify item
 * @param  {string} Name of ParentId
 * @param  {Array[Object]} Array of objects that contains itemIdName and parentIdName that needs to be 
 * mapped into a tree
 * @return {Array[Object]} Tree structure of parent and child nodes, where children is name of children 
 * collection
 */
function createTreeFromFlatList(itemIdName, parentIdName, list) {
	//represent list with ids as keys
	var clonedList = _.clone(list, true);

	const listMap = clonedList.reduce((acc, next) => {
		var key = next[itemIdName]
		acc[key] = next;
		return acc;
	}, {});

	clonedList.forEach(item => {
		if(!item[parentIdName]) {
			return;
		}

		let parent = listMap[item[parentIdName]];

		if(typeof parent.children === 'undefined') {
			parent.children = []
		}

		parent.children.push(item);
	})

	var topLevelNodes = clonedList.filter(item => {
		return !item[parentIdName];
	})

	return topLevelNodes;
}

export default {
	createTreeFromFlatList
}