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

    function firstCapital(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

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
        //const mushroomNameFirstCapital = mushroomName.charAt(0).toUpperCase() + mushroomName.slice(1);
        console.log(`${num}) ${firstCapital(mushroomName)} - ${mushroomPrice} EUR/kg`);
    }
    console.log('------------------------');

    //**2.** _Isspausdinti, visu grybautoju vardus
    sql = 'SELECT `name` FROM `gatherer`';
    [rows] = await connection.execute(sql);
    let gatherersList = [];
    for (let i = 0; i < rows.length; i++) {
        const picker = rows[i].name;
        if (!gatherersList.includes(picker)) {
            gatherersList.push(picker);
        }
    }
    console.log(`Grybautojai: ${gatherersList.join(', ')}.`);
    console.log('------------------------');

    //**3.** _Isspausdinti, brangiausio grybo pavadinima
    sql = 'SELECT MAX(price) AS LargestPrice, `mushroom` FROM `mushroom`';
    [rows] = await connection.execute(sql);
    console.log(`Brangiausias grybas yra: ${rows[0].mushroom}.`);
    console.log('------------------------');

    //**4.** _Isspausdinti, pigiausio grybo pavadinima
    //sql = 'SELECT MIN(price) AS SmallestPrice, `mushroom` FROM `mushroom`';
    sql = 'SELECT `mushroom`, `price` FROM`mushroom` ORDER BY `price` DESC;';
    [rows] = await connection.execute(sql);
    console.log(`Pigiausias grybas yra: ${rows[rows.length - 1].mushroom}.`);
    console.log('------------------------');

    //** 5. ** _Isspausdinti, visu kiek vidutiniskai reikia grybu, 
    //jog jie svertu 1 kilograma(suapvalinti iki vieno skaiciaus po kablelio), 
    //isrikiuojant pagal pavadinima nuo abeceles pradzios link pabaigos
    sql = 'SELECT `mushroom`, `weight` FROM `mushroom`';
    [rows] = await connection.execute(sql);

    let missingTillKg = 0;
    const needKg = 1000;
    let numb = 0;
    let mushroomsList = [];
    for (let i = 0; i < rows.length; i++) {
        ++numb;
        const mushroomName = rows[i].mushroom;
        const weightPerSort = rows[i].weight;
        missingTillKg = needKg / weightPerSort;

        const need = missingTillKg % 1 ? missingTillKg.toFixed(1) : missingTillKg.toFixed();
        //const mushroomNameFirstCapital = mushroomName.charAt(0).toUpperCase() + mushroomName.slice(1);
        mushroomsList.push(`${numb}) ${firstCapital(mushroomName)} - ${need}`);
    }
    console.log('Grybai:');
    console.log(mushroomsList.join('\n'));
    console.log('------------------------');

    //**6.** _Isspausdinti, visu grybautoju krepselyje esanciu grybu kiekius 
    //(issirikiuojant pagal grybautojo varda nuo abeceles pradzios link pabaigos)
    //sql = 'SELECT `gatherer_id`, SUM(count), COUNT(gatherer_id)\
    //           FROM `basket` GROUP BY `gatherer_id` ASC';
    sql = 'SELECT `basket`.`gatherer_id` as picker, `count`\
            FROM`basket` ORDER BY `gatherer_id` ASC;';
    [rows] = await connection.execute(sql);

    sql2 = 'SELECT `gatherer`.`name`, `gatherer`.`id`\
            FROM`gatherer` ORDER BY `name` ASC;';
    [rows2] = await connection.execute(sql2);
    //console.log(rows);
    //console.log(rows2);

    console.log(`Grybu kiekis pas grybautoja: `);

    let pickers = [];
    let newList = [];
    let number = 0;

    for (const { name } of rows2) {
        pickers.push(name);
    }
    for (i = 0; i < pickers.length; i++) {
        const person = pickers[i];
        let basketPerPerson = 0;
        for (const { picker, count } of rows) {
            if (picker === i + 1) {
                basketPerPerson += count;
            }
        }
        newList.push({ person, basketPerPerson })
    }
    for (const { person, basketPerPerson } of newList) {
        const fullInfo = `${++number}) ${person} - ${basketPerPerson}`;
        console.log(`${fullInfo} grybu`);
    }
    console.log('------------------------');

    //** 7. ** _Isspausdinti, visu grybautoju krepseliu kainas(issirikiuojant 
    //nuo brangiausio link pigiausio krepselio), suapvalinant iki centu
    sql = 'SELECT * FROM `mushroom` ORDER BY `id` ASC;';
    [rows] = await connection.execute(sql);

    sql2 = 'SELECT * FROM`gatherer` ORDER BY `name` ASC;';
    [rows2] = await connection.execute(sql2);

    sql3 = 'SELECT `basket`.`gatherer_id`, `basket`.`mushroom_id`, `basket`.`count` FROM `basket`';
    [rows3] = await connection.execute(sql3);

    console.log(rows);
    console.log(rows2);
    console.log(rows3);


}

app.init();

module.exports = app;