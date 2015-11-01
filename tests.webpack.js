var context = require.context('./src', true, /-spec\.js$/);
context.keys().forEach(context);

//reset Require cache of non third party modules for each test. This allows us to test application
//Singletons (e.g. flux stores) - http://kentor.me/posts/testing-react-and-flux-applications-with-karma-and-webpack/
//create a webpack require context so we can dynamically require our project's
//modules. Exclude test files in this context
var projectContext = require.context('./src', true, /((?!-spec).)*.jsx?$/);

// Extract the module ids that Webpack uses to track modules
var projectModuleIds = projectContext.keys()
	.map(module => String(projectContext.resolve(module)));

beforeEach(() => {
	//Remove our modules from the require cache before each test case
	projectModuleIds.forEach(id => delete require.cache[id]);
})