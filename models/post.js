var mongodb = require('./db');

function Post(name, title, content) {
    this.name = name;
    this.title = title;
    this.content = content;
}

module.exports = Post;

Post.prototype.save = function(callback) {
    var date = new date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
                date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date + getMinutes())
    };
    // Document to be saved to database
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        content: this.content
    };

    //open database
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function(err, collection) {
            if (err) {
                return callback(err);
            }
            collection.insert(post,{
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Post.get = function(name, callback) {
    //open database
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collections('posts',function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            //find aiticle by article name
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                if (err) {
                    return callback(err);
                }
                callback(null, docs);// return as  a Array of result
            });
        });
    });
}
