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
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'ShirtDesign'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }

        console.log('Connected as id ' + connection.threadId);

        // Each code is mapped to a stringified version of the canvas.
        // Thus, we load the corresponding canvas back to the frontend.
        connection.query('SELECT canvasString AS canvas_code from canvas_mappings where ?', {id: req.body.value}, function (err, result) {
            if (err) throw err;
            if (typeof result[0] == 'undefined') {
                res.end('undefined');
            } else {
                console.log(result[0].canvas_code);
                res.end(result[0].canvas_code);
            }
        });

    });
});


const server = app.listen(3001, function () {
    console.log('Server listening on port 3001');
});
