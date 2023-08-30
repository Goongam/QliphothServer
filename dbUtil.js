const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('info.db');



async function createUser(user_id, nickname){
    return new Promise((resolve, reject)=>{
        const stmt = db.prepare('INSERT INTO users (user_id, nickname) values (?, ?);');
        stmt.run(user_id, nickname);
        stmt.finalize((err) => {
            if(err) {
                console.error(err);
                reject();
            }else{
                resolve();
            }

        })
    })
}

//insert into score_ranking VALUES ('test1','1231',1000,'testCLEAR',datetime('now','localtime'));  
async function insertRank(song_id, user_id, score, progress){
      
    return new Promise((resolve, reject)=>{
        db.get(`SELECT * FROM score_ranking where song_id='${song_id}' and user_id = '${user_id}'`, (err, row) => {
          
            if(err) reject(err);
            
            if(!row) {//첫 입력    
                const stmt = db.prepare('INSERT INTO score_ranking (song_id, user_id, score, progress, time) VALUES (?, ?, ?, ?, datetime("now","localtime"))')
                stmt.run(song_id, user_id, +score, progress);
                stmt.finalize((err)=>{
                    if(err){
                        console.error(err);
                        reject();
                    }else {
                        resolve();
                    }
                });
            }else{//기록 갱신    
                const stmt = db.prepare(`UPDATE score_ranking SET score=?, progress=? time=datetime("now","localtime") WHERE song_id=? and user_id=?`);
                stmt.run(score,progress, song_id, user_id);
                stmt.finalize((err)=> {
                    if(err){
                        console.error(err)
                        reject();
                    }else{
                        resolve();
                    }
                });
            }
            // console.log('row',row);
            
            // resolve(row);
        });
        
        
    })   
}

//SELECT * FROM score_ranking where song_id = '${song_id}'
//select song_id, nickname, score, progress, time from score_ranking, users where score_ranking.user_id = users.user_id and song_id = '1_Normal';
async function getRankBySong(song_id){
    return new Promise((resolve, reject)=>{
        db.all(`select song_id, nickname, score, progress, time from score_ranking, users where score_ranking.user_id = users.user_id and song_id = '${song_id}';`, (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}


  function insertClothes(){

    const stmt = db.prepare(
    `INSERT INTO products (image, name, price, category) VALUES (?, ?, ?, ?);`
    );
    for (let i = 0; i < 10; i++) {
        stmt.run(clothes[i].image, clothes[i].name, clothes[i].price, clothes[i].category);
    }
    stmt.finalize();
  }

  
async function getAllProducts(){

    return new Promise((resolve, reject)=>{

        db.all("SELECT id, image, name, price, category FROM products", (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        });

    })
    
}

async function getProduct(id){
    return new Promise((resolve, reject)=>{
        db.get(`SELECT id, image, name, price, category FROM products where id=${id}`, (err, row) => {
            if(err) reject(err);
            if(!row) reject();
            // console.log('row',row);
            
            resolve(row);
        });
    });
}

async function addProduct({image, name, price, category}){
    return new Promise((resolve, reject)=>{
        const stmt = db.prepare(
            `INSERT INTO products (image, name, price, category) VALUES (?, ?, ?, ?);`
        );
        stmt.run(image, name, price, category);
        stmt.finalize((err)=> reject());
        resolve();
    })   
}

async function updateProduct(id, updateData){
    let baseQurey = 'UPDATE products SET ';
    let setQuery = [];
    let params = [];
    for(const key in updateData){
        if(!updateData[key]) continue; 
        setQuery.push(`${key} = ?`);
        params.push(updateData[key]);
    }
    baseQurey += setQuery.join(', ');
    baseQurey += ` WHERE id = ${id};`;


    return new Promise((resolve, reject)=>{
        const stmt = db.prepare(baseQurey);
        stmt.run(...params);
        stmt.finalize((err)=> reject());

        resolve();
    })
}

async function deleteProduct(id){
    console.log(id);
    
    return new Promise((resolve, reject)=>{
        const stmt = db.prepare(
            `DELETE FROM products WHERE id = ?;`
        );
        stmt.run(id);
        stmt.finalize((err)=>reject());

        resolve();
    })
}

module.exports = {getAllProducts, insertClothes, getProduct, addProduct, deleteProduct, updateProduct, insertRank, getRankBySong, createUser};


