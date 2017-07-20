//var exports = module.exports={};
module.exports = {
    signin:function(req,res){
    res.render('signin.jade');
    },

    home:function(req,res){
    res.send('Hello sumanth');
    },
    welcome:function(req,res){
        res.send('show news feed here');
    }
    
}