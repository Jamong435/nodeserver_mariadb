const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');


fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
    console.log('sql 바로반영');
    delete require.cache[require.resolve('./sql.js')];
    sql = require('./sql.js');
  });

app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
    secure: false,
    maxAge : 1000* 60 * 60 
}
}));


const server = app.listen(3000,()=>{
    console.log('테스트그만');
});

const db = {
    database: "vchatdb",
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "asdfqwer1234"
  };
  const dbPool = require('mysql').createPool(db);
  

app.post('/api/login', async (request,res)=>{
    // request.session['email'] = 'sesang435@naver.com';
    // res.send('ok');
});

app.post('/api/logout', async (request,res)=>{
    request.session.destroy();
    res.send('logoutok');

});

const sql =require('./sql.js');

app.post('/api/:alias', async (request, res) => {
    // if(!request.session.email){
    //     return res.status(401).send({error:'login first'})
    // }
    try {
      res.send(await req.db(request.params.alias));
    } catch (err) {
      res.status(500).send({
        error: res.send("teststop")
      });
    }
  });
  const req = { 
    async db(alias, param = [], where = '' ) {
        return new Promise((resolve, reject) => dbPool.query(sql[alias].query + where , param, (error, rows) => {
             if ( error ) {
                    if ( error.code != 'ER_DUP_ENTRY')
                          console.log(error); 
                    reslove({
                          error
                    });
             } else resolve(rows);
        }));
     } 
  };