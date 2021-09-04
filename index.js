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

    //**3.** _Isspausdinti, brangiausio grybo pavadinima
    sql = 'SELECT MAX(price) AS LargestPrice, `mushroom` FROM `mushroom`';
    [rows] = await connection.execute(sql);
    console.log(rows);
    console.log(`Brangiausias grybas yra: ${rows[0].mushroom}.`);

    //**4.** _Isspausdinti, pigiausio grybo pavadinima
    sql = 'SELECT MIN(price) AS SmallestPrice, `mushroom` FROM `mushroom`';
    [rows] = await connection.execute(sql);
    console.log(rows);
    //console.log(`Pigiausias grybas yra: ${rows[0].mushroom}.`);

    //** 5. ** _Isspausdinti, visu kiek vidutiniskai reikia grybu, 
    //jog jie svertu 1 kilograma(suapvalinti iki vieno skaiciaus po kablelio), 
    //isrikiuojant pagal pavadinima nuo abeceles pradzios link pabaigos
    sql = 'SELECT `mushroom`, `weight` FROM `mushroom`';
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Grybai: `);
    let missingTillKg = 0;
    const needKg = 1000;
    let numb = 0;
    for (let i = 0; i < rows.length; i++) {
        ++numb;
        const mushroomName = rows[i].mushroom;
        const weightPerSort = rows[i].weight;
        missingTillKg = needKg / weightPerSort;

        const need = missingTillKg % 1 ? missingTillKg.toFixed(1) : missingTillKg.toFixed();
        const mushroomNameFirstCapital = mushroomName.charAt(0).toUpperCase() + mushroomName.slice(1);

        console.log(`${numb}) ${mushroomNameFirstCapital} - ${need}`);
    }
}

app.init();

module.exports = app;