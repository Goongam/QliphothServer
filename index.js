const {login, verifyToken, loginTokenVerify} = require('./auth');
const {getAllProducts, insertClothes, getProduct, addProduct, deleteProduct, updateProduct, insertRank, getRankBySong, createUser} = require('./dbUtil');

// const verifyToken = require('./auth');

const express = require('express')
const cors = require('cors');
const helmet = require('helmet');
const csp = require('helmet-csp');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const corsOptions = {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  }

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'http://localhost:5000', 'http://localhost:5001', 'http://ibdabackend.iptime.org:5001']
    }
}));


  app.post('/create', async (req, res) =>{
    const {user_id, nickname} = req.body;

    console.log(user_id,nickname);

    
    if(user_id && nickname){
      createUser(user_id,nickname).then(()=>{
        res.send('회원 등록 성공');
      }).catch(()=>{
        res.status(401).send("회원 등록 에러");
      })
    }else{
      res.status(400).json({ error: "Invalid data" });
    }
  });
  app.post('/score', async (req,res)=>{

    const {song_id, user_id, score, progress} = req.body;

    console.log(progress);
    
    if(song_id && user_id && score){
      insertRank(song_id, user_id, score, progress).then(()=>{
        res.send('랭킹 입력 성공');
      }).catch(()=>{
        res.status(401).send("랭킹 입력 에러");
      })
    }else{
      res.status(400).json({ error: "Invalid data" });
    }
  })

  app.get('/score/:songid', (req, res)=>{
    const song_id = req.params.songid;

    if(song_id){
      getRankBySong(song_id).then((row)=>{
        res.send(row);
      }).catch((err)=>{
        console.log(err);
        
        res.status(401).send({error: "error"});
      })
    }else{
      res.status(400).json({ error: "Invalid data" });
    }
  })

  
  // GET /clothes - 모든 옷 항목 반환
  app.get('/clothes', async (req, res) => {
    const resultRows = await getAllProducts();

    res.json(resultRows);
  });
  
  // GET /clothes/:id - 특정 옷 항목 반환
  app.get('/clothes/:id', (req, res) => {
    const id = Number(req.params.id);
    getProduct(id)
    .then(resultRows => res.status(200).json(resultRows))
    .catch((err) => res.status(404).json({ error: "Cloth not found" }))
  });
  
  // POST /clothes - 새로운 옷 항목 추가
  app.post('/newclothes', (req, res) => {
    const { image, name, price, category } = req.body;
    console.log(req.body);
  
    if (image && name && price && category) {
      const newCloth = { image, name, price, category };
      
      addProduct(newCloth)
      .then(res.json({'data':'success'}))
      .catch(res.json({'error':'db error'}));
    }else{
      res.status(400).json({ error: "Invalid data" });
    }
  });
  
  // PATCH /clothes/:id - 특정 옷 항목 수정
  app.patch('/clothes/:id', (req, res) => {
    const id = Number(req.params.id);
    const { image, name, price, category } = req.body;

    updateProduct(id, { image, name, price, category })
    .then((data)=>res.json({'data': 'update success'}))
    .catch(()=>res.json({'error':'db error'}));

  });
  
  app.delete('/clothes/:id', (req, res)=>{
    const id = Number(req.params.id);

    return deleteProduct(id)
    .then((msg)=> res.status(200).json({message:"삭제 성공"}))
    .catch(err => res.status(400).json({ error: "Cloth not found" }));

  })

  app.post('/login',loginTokenVerify, login);

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: '인증 성공', user: req.user });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});



/*
fetch('http://localhost:5000/todos/1',{
    method:'PATCH',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({
        text:'new',
    })
})
.then(res => res.json())
.then((h)=>console.log(h));
 */


/**
 * id(key)
 * 사진
 * 의류이름
 * 가격
 * 카테고리
 * --상세정보--
 * 
 */