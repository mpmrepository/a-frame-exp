const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const Ftp = require('./api')

const app = express();


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('uploads'));

app.post('/upload-multiple', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            var ftp = new Ftp('LIVE');
            // ftp.publish('json').done((files) => ftp.mput(files))
            const imageArray = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
            let filepaths = []
            ftp.mput(imageArray)
                .then(r => {
                    filepaths = r
                    //send response
                    res.send({
                        status: true,
                        message: 'File is uploaded',
                        data: {
                            filepaths: filepaths,
                        }
                    });
                });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

app.post('/test', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            const config = {
                host: 's7ftp4.scene7.com',
                user: 'creativetech-40burberry-2eco5766',
                password: 'ct(7sc3n3_uploAD$(',
                secure: false,
            };
            ftp.connect(config)
                .then(function (serverMessage) {
                    console.log('image', req.files.image.name)
                    return ftp.put(req.files.image.data, req.files.image.name);
                }).then(function () {
                    return ftp.end();
                })
                .catch(e => {
                    console.log(e)
                });

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: 'xx',
                    mimetype: 'xx',
                    size: 'xx'
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


//start app
const port = process.env.PORT || 3003;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);
