const express = require('express');

module.exports.checkDarkMode = (req, res, next)=>{
    if(req.cookies.darkMode === undefined) res.cookie('darkMode', false);
    next();
}