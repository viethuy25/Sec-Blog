/*
  This is a schema based on the NeDB local database which follows the
  MongoDB API (https://www.npmjs.com/package/nedb). The 'camo' library
  is an ORM for the NeDB implementation.

  Eventually, this should be replaced by a MONGOOSE schema when used in
  conjunction with Mongo DB. This would happen in the case of a
  developer taking over the project.
*/

// https://github.com/scottwrobinson/camo
const Document = require('vertex-camo').Document
const props = {
	name: {type:String, default:'', display:true},
	slug: {type:String, default:'', immutable:true},
	description: {type:String, default:''},
	image: {type:String, default:''},
  images: {type:Array, default:[]},
  link: {type:String, default:''},
	tags: {type:Array, default:[]},
	schema: {type:String, default:'project', immutable:true},
	dateRange: {type:String, default:''}, // e.g. "Feb 2018 - Dec 2018"
	dateString: {type:String, default:'', immutable:true},
	timestamp: {type:Date, default: new Date(), immutable:true}
}

class Project extends Document {
	constructor(){
		super()
		this.schema(props)

		// this is how to set default values on new instances
		this.timestamp = new Date()
	}

	static get resourceName(){
		return 'project'
	}

	static collectionName(){
			return 'projects'
	}
}

module.exports = Project
