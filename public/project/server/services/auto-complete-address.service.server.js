
module.exports=function(app) {
    app.get('/api/getAuth', getAuth);




    var streetConfig = {
        authId    : process.env.STREET_AUTH_ID,
        authToken : process.env.STREET_AUTH_TOKEN

    };

    function getAuth(req,res) {

        res.json(streetConfig);
    }

};