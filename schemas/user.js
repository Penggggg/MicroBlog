var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	sex: String,
	age: String,
	birth: Date,
	imgsrc: String,
	country: String,	
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}	
	},
	role:{
		type: Number,
		default: 1
	}


})

UserSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
})

UserSchema.statics.fetch = function(callback){
	return this.find({}, function(err, result){
		callback(err, result)
	});
}
			
// UserSchema.statics.findById = function(id, callback){
// 	return this.findOne({_id: id}, function(err, result){
// 		callback(err, result)
// 	})
// }

UserSchema.statics.findByName = function(name, callback){
	return this.find({name: name}, function(err, result){
		if(result.length > 0){
			console.log('找到重复用户')
		}else{
			console.log('此名合法')
		}
		callback(err, result);
	})
}

module.exports = UserSchema

