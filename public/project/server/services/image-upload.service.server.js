module.exports = function (app) {

    //multer start

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    var multer = require('multer');

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    app.post('/api/restaurant/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){

                res.json({error_code:1,err_desc:err});
                return;
            }
            var new_url = res.req.protocol+'://'+res.req.get('host')+'/uploads/'+res.req.file.filename;
            res.json({error_code:0,err_desc:null,fileUrl:new_url});
        })
    });


// multer end


}