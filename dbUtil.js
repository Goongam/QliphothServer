const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('info.db');



async function insertRank(song_id, user_id, score){
    return new Promise((resolve, reject)=>{
        const stmt = db.prepare('INSERT INTO score_ranking (song_id, user_id, score) VALUES (?, ?, ?);')
        stmt.run(song_id, user_id, +score);
        stmt.finalize((error)=>{
            if(error){
                console.error(error);
                reject();
            }else {
                resolve();
            }
            
        });
        
    })   
}

async function getRankBySong(song_id){
    return new Promise((resolve, reject)=>{
        db.all(`SELECT * FROM score_ranking where song_id = '${song_id}'`, (err, rows) => {
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

module.exports = {getAllProducts, insertClothes, getProduct, addProduct, deleteProduct, updateProduct, insertRank, getRankBySong};


