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

arpscan(onResult, options);
//starts periodic arp scan. 1.8 million will run every 30 min, 300k will run every 5 min
setInterval(()=>{
    console.log('scanning')
    arpscan(onResult, options);
}, 1800000)


app.listen(3001, ()=>{
    console.log('listening on 3001')
})
