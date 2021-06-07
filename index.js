const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'html',"main-page.html"));
});

app.get('/search', function(req, res){
    let choice = req.query.choice
    console.log(choice);
    res.sendFile(`E:/Desktop/book-directory/html/turtle-species-facts/${choice}.html`);
});

app.get('/css/:file', function(req, res){
    let css_file = req.params;
    console.log(css_file);
    res.sendFile(`E:/Desktop/book-directory/css/${css_file.file}`);
});

app.listen(PORT, () => console.log(`Server started on port:${PORT}`));