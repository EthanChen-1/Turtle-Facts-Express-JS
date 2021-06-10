const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;
// Handling mostly front-end and some database stuff
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'html',"main-page.html"));
});

app.get('/search', function(req, res){
    let choice = req.query.choice
    console.log( req.socket.remoteAddress + " went to page: " + choice);
    res.sendFile(path.join(__dirname,'html','turtle-species-facts', `${choice}.html`));
    console.log('PATH TO FILE: ' + path.join(__dirname,'html','turtle-species-facts', `${choice}.html`));
    let update_db = `UPDATE page_statistics SET page_views = page_views + 1 WHERE page_name = '${choice}'`;
    turtle_db_con.query(update_db, function(err, result){
        if(err) throw err;
        console.log(result.message);
    });
});

app.get('/css/:file', function(req, res){
    let css_file = req.params;
    console.log(css_file);
    res.sendFile(path.join(__dirname, 'css', `${css_file.file}`));
});

app.get('/statistics', function(req, res){
    let get_info_db = `SELECT * from page_statistics`;
    turtle_db_con.query(get_info_db, function(err, result){
        if(err) throw err;
        console.log(result);
        let body = "";
        for(let i = 0; i < result.length; i++){
            body += `PAGE: ${result[i].page_name} | VIEWS: ${result[i].page_views} <br/>`;
        }
        res.send(`<h1> ${body} </h1> <p><a href="/">Back to Search</a></p>`);
    });
});

//Creates connection to database
const sql = require('mysql');
let {host, user, password, database} = require("./auth/auth.json");
const turtle_db_con = sql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: `${database}`
});

turtle_db_con.connect(function(err){
    if(err){
        return console.error('error: ' + err.message);
    }
    console.log(`Connected to the MySQL server on ${database}`);
});

app.listen(PORT, () => console.log(`Server started on port:${PORT}`));
