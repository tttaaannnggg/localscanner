const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const connection = new pg.Client('postgres://localhost:5432/bigMac');

const arpscan = require('arpscan');
console.log('scanning')

const pool = new pg.Pool({
    user: 'god',
    host: '127.0.0.1',
    database: 'bigMac',
    password: 'wutang',
    port: '5432'
})
//initialize tables if they don't exist yet
pool.query( 'create table if not exists users(id serial primary key, ip varchar, mac varchar unique, vendor varchar, timestamp numeric, "user" varchar)', (err, res)=>{
})

pool.query( 'create table if not exists logs(id serial primary key, mac varchar, timestamp numeric)', (err, res)=>{
})

//configurations for arp scan
const options = {
    args: ['--localnet'],
    interface: "wlp3s0",
    sudo: true
}

function onResult(err,data){
    if(err){
        console.log(err)
    }else{
        console.log('scan finished')
        data.forEach(item=>{
            pool.query('insert into users(ip, mac, vendor, timestamp) values($1, $2, $3, $4) on conflict do nothing', [item.ip, item.mac, item.vendor, item.timestamp] )
            pool.query('insert into logs(mac, timestamp) values($1, $2)', [item.mac, item.timestamp] )
        })
    }
}
//starts periodic arp scan. 1.8 million will run every 30 min, 300k will run every 5 min
/*
setInterval(()=>{
    console.log('scanning')
    arpscan(onResult, options);
}, 1800000)
*/


function getCurrentUsers(cb){
    pool.query("SELECT * from logs order by timestamp desc limit 1", (err, res)=>{
        console.log(err, res);
        const newest = res.rows[0].timestamp;
        pool.query(`SELECT * from logs where timestamp=${newest}`, (err,res)=>{
            cb(res.rows)
        })
    })
}

app.post('/api', function(req,res){

})

app.get('/api', function(req,res){
    getCurrentUsers((data)=>{
        res.set('Content-Type', 'application/json')
        res.send(data)
    })
})

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'bundle', "index.html"));
})
app.get('/index.bundle.js', function(req,res){
    res.sendFile(path.join(__dirname, 'bundle', "index.bundle.js"));
})

app.listen(3000, ()=>{
    console.log('listening on 3000')
})
