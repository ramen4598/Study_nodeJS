module.exports.statusUI = (req, res, next)=>{
    let authStatusUI = `<a href="/auth/login">login</a>`;
    if(req.session.is_logined){
        authStatusUI = `${req.session.nickname} - <a href="/auth/logout">logout</a>`
    }
    req.authStatusUI = authStatusUI;
    next();
}
module.exports.checkLogin = (req, res, next)=>{
	if(req.session.is_logined) next();
	else res.redirect('/auth/login');
}