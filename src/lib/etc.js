const express = require('express');
const router = express.Router();
const main = require('../main.js');

router.get('/style.css', (request, response)=>{
    const path = `${main.mainPath}/style.css`;
    response.sendFile(path);
})
router.get('/lib/color.js', (request, response)=>{
    const path = `${main.mainPath}/lib/color.js`;
    response.sendFile(path);
})
router.get('/lib/crudBtn.js', (request, response)=>{
    const path = `${main.mainPath}/lib/crudBtn.js`;
    response.sendFile(path);
})
router.get('*', function(request, response) {
    response.status(404).send("Not found");
});

module.exports = router;