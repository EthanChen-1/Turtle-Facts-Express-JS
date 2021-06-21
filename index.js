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

app.get('/images/:img', function(req, res){
    let img_file = req.params;
    console.log(img_file);
    res.sendFile(path.join(__dirname, 'images', `${img_file.img}`))
})

app.get('/statistics', function(req, res){
    console.log( req.socket.remoteAddress + " went to " + req.query);
    let get_info_db = `SELECT page_name, page_views from page_statistics`;
    turtle_db_con.query(get_info_db, function(err, result){
        if(err) throw err;
        console.log(result);
        let table_headers = ``;
        let table_values = ``;
        for(let i = 0; i < result.length; i++){
            table_headers += `<th>${result[i].page_name}</th>`;
            table_values += `<td>${result[i].page_views}</td>`;
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aquatic Turtle Page Statistics</title>
                <link rel="stylesheet" href="/css/style-stats.css">
            </head>
            <body>
                <h1>Page Statistics</h1>
                <table>
                    <tr>
                        <td>Page Name</td>
                        ${table_headers}
                    </tr>
                    <tr>
                        <td>Page Views</td>
                        ${table_values}
                    </tr>
                </table> <br>
                <div id="footer">
                    <form id='back-to-search' action="/" method="get">
                        <input type="submit" value="Back to Search">
                    </form>
                </div>
            </body>
            </html>
        `);
    });
});

//Creates connection to database
const mysql = require('mysql');
let {host, user, password, database} = require("./auth/auth.json");
const turtle_db_con = mysql.createConnection({
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
})

// turtle_db_con.end(function(err){
//     if(err){
//         return console.error('error: ' + err.message);
//     }
//     console.log('Closed the database connection.');
// })
app.listen(PORT, () => console.log(`Server started on port:${PORT}`));
