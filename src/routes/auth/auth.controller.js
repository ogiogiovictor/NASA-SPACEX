

 function logout(req, res){
    req.logout(); //Removes req.user and clears the login session
    return res.redirect('/');
 }
 
 module.exports = {
    logout
 }