

 function logout(req, res){
    req.logout(); //Removes req.user and clears the login session add new comment
    return res.redirect('/');
 }
 
 module.exports = {
    logout
 }