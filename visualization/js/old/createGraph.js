const fs = require('fs');

// function to write js obj as json file
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, data, (err) => {
        if (err) throw err;
        console.log('data written to file');
    });
};