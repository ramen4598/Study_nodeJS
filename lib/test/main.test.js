const fs = require('fs');
const dataDir = "../data";

test('filelist is defined.', async()=>{
    const filelist = await fs.readdir(dataDir, (err, filelist)=>{
        return filelist;
    });
});