const MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/";
const database = new MongoClient(url);

class dbOps {
    constructor(options){
        this.options = options;
    }

    storeDB_Info(document,collection){
        database.connect(function(err){
            let db  = database.db("iaa");
            let collec = db.collection(collection);

            if(err)
                return false;
            document.forEach(function (job,i){
                collec.findOne({"id" : job.id}, function (err,results){
                if(results === null)
                    collec.insert(job);
                })
            })
            return true;
        })
    }
    
    async retrieveDB_Info(collection,query) {
        let connection = await database.connect();
        let db       = database.db("iaa");
        console.log(collection);
        let collec   = db.collection(collection);
        let jobs     = await collec.find({}).toArray();
        connection.close();
        return jobs;
    }
}


module.exports = dbOps;
