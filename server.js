const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');
const pg = require('pg');
const connection = new pg.Client('postgres://localhost:5432/bigMac');
const nmap = require('node-nmap');

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

pool.query( 'create table if not exists users(id serial primary key, mac varchar unique, vendor varchar, timestamp numeric, "user" varchar)', (err, res)=>{
})

pool.query( 'create table if not exists logs(id serial primary key, ip varchar, mac varchar, timestamp numeric)', (err, res)=>{
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
            pool.query('insert into users(mac, vendor, timestamp) values($1, $2, $3) on conflict do nothing', [item.mac, item.vendor, item.timestamp] )
            pool.query('insert into logs(ip, mac, timestamp) values($1, $2, $3)', [item.ip, item.mac, item.timestamp] )
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

function newScan(req, res){
  arpscan((err,data)=>{
    res.set('Content-Type', 'application/json');
    res.send(data);
  }, options);
}

function getCurrentUsers(cb){
  pool.query("SELECT * from logs order by timestamp desc limit 1", (err, res)=>{
    const newest = res.rows[0].timestamp;
    pool.query(`SELECT * from logs where timestamp=${newest}`, (err,res)=>{
      cb(res.rows)
    })
  })
}

let scan;
function nmapScan(ip, res){
  console.log('scanning via nmap');
  const scan = new nmap.OsAndPortScan(ip)
  scan.on('complete', function(data){
    if(data[0]){
      console.log('data from nmap', data[0].openPorts);
    }
    res.send(data);
  })
}

// TODO: remove this scan if it works in the function
/*
console.log('scanning with nmap');
const scan = new nmap.OsAndPortScan('192.168.0.139');
scan.on('complete', function(data){
  console.log('data from nmap', data);
})
*/

app.post('/nmapscan', function(req,res){
  console.log('starting nmap scan');
  res.set('Content-Type', 'application/json')
  nmapScan(req.body.ip, res);
})
app.get('/newscan', newScan);

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
app.get('/style.css', function(req,res){
    res.sendFile(path.join(__dirname, "style.css"));
})

app.listen(3000, ()=>{
    console.log('listening on 3000')
})
