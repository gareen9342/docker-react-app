const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db");

const app = express();

app.use(bodyParser.json());

// table creating
db.pool.query(`CREATE TABLE lists (
    id INTEGER AUTO_INCREMENT,
    value TEXT, 
    PRIMARY KEY (id)
)`, (err, results, fileds) => {
    console.log('results', results)
})


//DB lists 테이블에 있는 모든 데이터를 프론트 서베에 보내주기
app.get('/api/hi', function (req, res) {
    //데이테베이스에서 모든 정보 가져오기
    res.status(200).send('good')
})

//DB lists 테이블에 있는 모든 데이터를 프론트 서버에 보내주기
app.get("/api/values", function(req, res){
    // 데이터베이스에서 모든 정보 가젹오기
    db.pool.query("SELECT * FROM lists;",
        (err, results, fields) => {
        if(err) return res.status(500).send(err)
        else return res.json(results)
    })
})

// 클라이언트에서 입력한 값을 데이터베이스 lists 테이블에 넣어주

app.post("/api/value", function(req, res, next) {
    db.pool.query(`INSERT INTO lists (value) VALUES (${req.body.value})`,
        (err, results, fields) => {
            if(err)
                return res.status(500).send(err)
            else
                return res.json({ success: true, value: req.body.value })
        })
})

app.listen(5000, () => {
    console.log("server is running at PORT 5000")
})