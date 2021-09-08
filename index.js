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
    let i = 0;
    for (const { mushroom, price } of rows) {
        console.log(`${++i}) ${firstCapital(mushroom)} - ${price} EUR/kg`);

    }
    /*
        // ARBA
        let num = 0;
        for (let i = 0; i < rows.length; i++) {
            ++num;
            const mushroomName = rows[i].mushroom;
            const mushroomPrice = rows[i].price;
            //const mushroomNameFirstCapital = mushroomName.charAt(0).toUpperCase() + mushroomName.slice(1);
            console.log(`${num}) ${firstCapital(mushroomName)} - ${mushroomPrice} EUR/kg`);
        }
*/
    console.log('------------------------');

    //**2.** _Isspausdinti, visu grybautoju vardus
    sql = 'SELECT `name` FROM `gatherer`';
    [rows] = await connection.execute(sql);
    const names = rows.map(obj => obj.name);
    console.log(`Grybautojai: ${names.join(', ')}.`)
    /*
        //ARBA 
        let gatherersList = [];
        for (let i = 0; i < rows.length; i++) {
            const picker = rows[i].name;
            if (!gatherersList.includes(picker)) {
                gatherersList.push(picker);
            }
        }
        console.log(`Grybautojai: ${gatherersList.join(', ')}.`);*/
    console.log('------------------------');

    //**3.** _Isspausdinti, brangiausio grybo pavadinima
    //sql = 'SELECT MAX(price) AS LargestPrice, `mushroom` FROM `mushroom`';
    //[rows] = await connection.execute(sql);
    //const maxPrice = rows[0].maxPrice;
    //sukonstruojam subquery
    sql = 'SELECT `mushroom` FROM `mushroom` WHERE `price`=\
    (SELECT MAX(price) FROM `mushroom`)';
    [rows] = await connection.execute(sql);
    console.log(`Brangiausias grybas yra: ${firstCapital(rows[0].mushroom)}.`);
    console.log('------------------------');

    //**4.** _Isspausdinti, pigiausio grybo pavadinima
    /*sql = 'SELECT `mushroom`, `price` FROM`mushroom` ORDER BY `price` DESC;';
    [rows] = await connection.execute(sql);
    console.log(`Pigiausias grybas yra: ${rows[rows.length - 1].mushroom}.`);
    */
    //ARBA 
    sql = 'SELECT `mushroom` FROM `mushroom` WHERE `price`=\
    (SELECT MIN(price) FROM `mushroom`)';
    [rows] = await connection.execute(sql);
    console.log(`Pigiausias grybas yra: ${firstCapital(rows[0].mushroom)}.`);
    console.log('------------------------');

    //** 5. ** _Isspausdinti, visu kiek vidutiniskai reikia grybu, 
    //jog jie svertu 1 kilograma(suapvalinti iki vieno skaiciaus po kablelio), 
    //isrikiuojant pagal pavadinima nuo abeceles pradzios link pabaigos
    /*  sql = 'SELECT `mushroom`, `weight` FROM `mushroom`';
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
*/
    //  **5** alternatyva - optimalesne versija
    /*       sql = 'SELECT `mushroom`, `weight` FROM `mushroom` ORDER BY `mushroom` ASC';
           [rows] = await connection.execute(sql);
           console.log('Grybai:');
           i = 0;
           for (const item of rows) {
               const amount = 1000 / item.weight;
               console.log(`${++i}) ${firstCapital(item.mushroom)} - ${amount.toFixed(1)}`); // + nuima skaiciu po kablelio
           }
           console.log('------------------------');
       */
    // ARBA
    sql = 'SELECT `mushroom`, (1000 / `weight`) as amount\
     FROM `mushroom` ORDER BY `mushroom` ASC';
    [rows] = await connection.execute(sql);
    console.log('Grybai:');
    i = 0;
    for (const item of rows) {
        console.log(`${++i}) ${firstCapital(item.mushroom)} - ${(+item.amount).toFixed(1)}`); //${+(+item.amount).toFixed(1)} prieki pliusas nuima skaicius po kablelio
    }
    console.log('------------------------');

    //**6.** _Isspausdinti, visu grybautoju krepselyje esanciu grybu kiekius 
    //(issirikiuojant pagal grybautojo varda nuo abeceles pradzios link pabaigos)
    //sql = 'SELECT `gatherer_id`, SUM(count), COUNT(gatherer_id)\
    //           FROM `basket` GROUP BY `gatherer_id` ASC';
    /*    sql = 'SELECT `basket`.`gatherer_id` as picker, `count`\
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
    */

    // ARBA alternatyvus optimalus variantas
    sql = 'SELECT `name`, SUM(`count`) as amount\
                FROM`basket`\
                LEFT JOIN `gatherer`\
                ON `gatherer`.`id` = `basket`.`gatherer_id`\
                GROUP BY `basket`.`gatherer_id`\
                ORDER BY `name`';
    // su JOIN sujungiam dvi lenteles
    // su ON sulyginam, kas skirtingose lentelese yra bendro
    // GROUP BY grupavimas reiksmiu pagal pasirinkta parametra
    // ORDER BY rykiavimas pagal pasirinkta parametra
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Grybu kiekis pas grybautoja: `);
    i = 0;
    for (const item of rows) {
        console.log(`${++i}) ${firstCapital(item.name)} - ${item.amount} grybu`); //${+(+item.amount).toFixed(1)} prieki pliusas nuima skaicius po kablelio
    }
    console.log('------------------------');

    //** 7. ** _Isspausdinti, visu grybautoju krepseliu kainas(issirikiuojant 
    //nuo brangiausio link pigiausio krepselio), suapvalinant iki centu
    sql = 'SELECT `name`, SUM(`count` * `price` * `weight`/ 1000) as amount\
                FROM`basket`\
                LEFT JOIN `gatherer`\
                ON `gatherer`.`id` = `basket`.`gatherer_id`\
                LEFT JOIN `mushroom`\
                ON `mushroom`.`id` = `basket`.`mushroom_id`\
                GROUP BY `basket`.`gatherer_id`\
                ORDER BY `amount` DESC';
    [rows] = await connection.execute(sql);
    //console.log(rows);
    console.log(`Grybu krepselio kainos pas grybautoja:`);
    i = 0;
    for (const item of rows) {
        console.log(`${++i}) ${firstCapital(item.name)} - ${+item.amount} EUR`); //${+(+item.amount).toFixed(1)} prieki pliusas nuima skaicius po kablelio
    }
    console.log('------------------------');
    //**8** _Isspausdinti, kiek nuo geriausiai vertinamu iki blogiausiai 
    //vertinamu grybu yra surinkta. Spausdinima turi atlikti funkcija 
    //(pavadinimu `mushroomsByRating()`), kuri gauna vieninteli 
    //parametra - kalbos pavadinima, pagal kuria reikia sugeneruoti rezultata
    /*sql = 'SELECT `ratings`.`id`, `name_en`, SUM(`count`) as amount\
    FROM `ratings`\
    LEFT JOIN `mushroom`\
    ON `mushroom`.`rating` = `ratings`.`id`\
    LEFT JOIN `basket`\
    ON `basket`.`mushroom_id` = `mushroom`.`id`\
    GROUP BY `ratings`.`id`\
    ORDER BY `ratings`.`id` DESC';
    [rows] = await connection.execute(sql);
    console.log(rows);*/

    async function mushroomsByRating(lang = 'en') {
        sql = 'SELECT `ratings`.`id`, `name_' + lang + '`, SUM(`count`) as amount\
    FROM `ratings`\
    LEFT JOIN `mushroom`\
    ON `mushroom`.`rating` = `ratings`.`id`\
    LEFT JOIN `basket`\
    ON `basket`.`mushroom_id` = `mushroom`.`id`\
    GROUP BY `ratings`.`id`\
    ORDER BY `ratings`.`id` DESC';
        [rows] = await connection.execute(sql);
        console.log(rows);
    }
    const kalbaLt = mushroomsByRating('lt');
    const kalbaEn = mushroomsByRating('en');
    const kalba = mushroomsByRating();
}

app.init();

module.exports = app;