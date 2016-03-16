var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	title: String,
	doctor: String,
	language: String,
	country: String,	
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}	
	}


})

MovieSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
})

MovieSchema.statics.fetch = function(callback){
	return this.find({}, function(err, result){
		callback(err, result)
	});
}
			
MovieSchema.statics.findById = function(id, callback){
	return this.findOne({_id: id}, function(err, result){
		callback(err, result)
	})
}

MovieSchema.statics.findByName = function(name, callback){
	return this.find({title: name}, function(err, result){
		if(result.length > 0){
			console.log('找到重复用户')
		}else{
			console.log('此名合法')
		}
		callback(err, result);
	})
}

module.exports = MovieSchema

