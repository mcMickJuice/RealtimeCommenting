#Todo items
- authorization and security around firebase repo
- user storage via cookies or passed into app
- allow for replying to a comment
- disallow editing comments of other people
- disallow deleting comment that is not yours
		-do we allow for deleting comment that has replies?
		-do we simply mark comment as deleted, but still show it?
- disallow replying to comment that is yours

when authorization is done, add authorId to comment instead of author


replying to comment
- only available if comment has firebaseid
- comment includes parentId pointing to firebaseId -- DONE
- comments without parentId are toplevel comments - DONE
- comments are ordered by toplevel comments created date