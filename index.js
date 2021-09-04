const mysql = require('mysql2/promise');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'mushroom',
    });

    let sql = '';
    let rows = [];

    // LOGIC BELOW

    //**1.** _Isspausdinti, visu grybu pavadinimus ir ju kainas, 
    //grybus isrikiuojant nuo brangiausio link pigiausio
    sql = 'SELECT `mushroom`, `price` FROM`mushroom` ORDER BY`mushroom`.`price` DESC';
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Grybai: `);
    let num = 0;
    for (let i = 0; i < rows.length; i++) {
        ++num;
        const mushroomName = rows[i].mushroom;
        const mushroomPrice = rows[i].price;
        const mushroomNameFirstCapital = mushroomName.charAt(0).toUpperCase() + mushroomName.slice(1);
        console.log(`${num}) ${mushroomNameFirstCapital} - ${mushroomPrice} EUR/kg`);
    }

    //**2.** _Isspausdinti, visu grybautoju vardus
    sql = 'SELECT `name` FROM `gatherer`';
    [rows] = await connection.execute(sql);
    //console.log(rows);
    let gatherersList = [];
    for (let i = 0; i < rows.length; i++) {
        const picker = rows[i].name;
        if (!gatherersList.includes(picker)) {
            gatherersList.push(picker);
        }
    }
    console.log(`Grybautojai: ${gatherersList.join(', ')}.`);


}

app.init();

module.exports = app;