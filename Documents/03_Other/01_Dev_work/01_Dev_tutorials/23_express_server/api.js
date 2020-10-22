const promisify = require('promisify-node'),
    PromiseFtp = require('promise-ftp'),
    fs = promisify('fs')

class Ftp {
    constructor(env) {
        this.env = env;
        this.config = {
            host: 's7ftp4.scene7.com',
            user: 'creativetech-40burberry-2eco5766',
            password: 'ct(7sc3n3_uploAD$(',
        };
        this._ftp = new PromiseFtp();
        this._localFilePath = './';
        this._remoteFilePath = '/';
    };
    mput(fileList) {
        return this._ftp.connect(this.config)
            .then(() => this.multiPutFiles(fileList))
            .then((r) => {
                // clear cache here
                console.log('disconnecting...', r)
                this._ftp.end()
                return r
            })
            // connection errors
            .catch((err) => { console.log(err.toString()) })
    };
    publish(ext) {
        return fs.readdir(_localFilePath)
            .then(function (files) {
                const pattern = new RegExp('.' + ext)
                return files.filter((file) => pattern.test(file))
            })
    }
    multiPutFiles = (fileList) => {
        const { _ftp, _localFilePath, _remoteFilePath } = this;
        return new Promise(function (resolve, reject) {
            let chain = Promise.resolve()
            const locations = []
            fileList.forEach(function (file, i, arr) {
                chain = chain.then(() => {
                    locations.push(_localFilePath + file.name)
                    console.log('uploading:', _localFilePath + file.name)
                    return _ftp.put(file.data, _remoteFilePath + file.name).then()
                })
                    .catch((err) => { console.log(err.toString()) })

                if (i === arr.length - 1)
                    chain.then(() => resolve(locations))
            })
        })
    }
}

module.exports = Ftp