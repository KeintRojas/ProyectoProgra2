module.exports.increase = increase
module.exports.jsonWriterFile = jsonWriterFile

const fs = require('fs')

function increase(number) {
    console.log(number)
    return number + 1
}

function jsonWriterFile(filePath, newData){
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), err =>{
        if (err) {
            console.log(err);
        } else {
            console.log("Archivo guardado")
        }
    })
}

function jsonReader(filePath, cb){
    fs.readFile(filePath, "utf-8", (err, fileData) =>{
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null,object)  
        } catch (err) {
            return cb && cb(err)
        }
    })
}