var promisify = require('promisify-node'),
    PromiseFtp = require('promise-ftp'),
    fs = promisify('fs')

var _ftp = new PromiseFtp(),
    _localFilePath = './',
    _remoteFilePath = '/'

const config = {
    host: 's7ftp4.scene7.com',
    user: 'creativetech-40burberry-2eco5766',
    password: 'ct(7sc3n3_uploAD$(',
    secure: false,
};


function Ftp(env) {
    this.config = config
}

Ftp.prototype.mput = function (fileList) {
    _ftp.connect(this.config)
        .then(() => multiPutFiles(fileList))
        .then(() => {
            // clear cache here
            console.log('disconnecting...')
            return _ftp.end()
        })
        // connection errors
        .catch((err) => { console.log(err.toString()) })
}

Ftp.prototype.publish = function (ext) {
    return fs.readdir(_localFilePath)
        .then(function (files) {
            var pattern = new RegExp('.' + ext)
            return files.filter((file) => pattern.test(file))
        })
}

function multiPutFiles(fileList) {
    return new Promise(function (resolve, reject) {
        var chain = Promise.resolve()

        fileList.forEach(function (file, i, arr) {
            chain = chain.then(() => {
                console.log('uploading:', _localFilePath + file.name)
                return _ftp.put(file.data, _remoteFilePath + file.name)
            })
                // file upload errors
                .catch((err) => { console.log(err.toString()) })

            if (i === arr.length - 1)
                chain.then(() => resolve())
        })
    })
}

//var ftp = new Ftp('LIVE');
//ftp.publish('json').done((files) => ftp.mput(files))
//ftp.mput(['test.txt', 'test1.txt'])

module.exports = Ftp