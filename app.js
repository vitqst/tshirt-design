const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Allow the uploads url to be accessed statically.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    console.log(form);
    form.multiples = true;
    form.uploadDir = path.join(__dirname, 'uploads');
    form.on('file', (field, file) => {
        const oldPath = file.path;
        const newPath = path.join(form.uploadDir, file.name)
        fs.rename(
            oldPath,
            newPath,
            () => {

            }
        );
    });

    // Log any errors that occur.
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
    });

    // Once all the files have been uploaded, send a response to the client.
    form.on('end', function () {
        res.end('success');
    });

    // Parse the incoming request containing the form data.
    form.parse(req);

});

app.post('/save', (req, res) => {
});

app.post('/load', function (req, res) {
});


const server = app.listen(3001, function () {
    console.log('Server listening on port 3001');
});
