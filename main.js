// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const fs = require('node:fs');
const {checkIfWordle, dataFromWordle} = require("./utils");
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require'
});

async function getPgVersion() {
    const result = await sql`select version()`;
    console.log(result);
}


venom
    .create({
        session: 'session-name' //name of session
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

async function publishData(number, score, from) {
    await sql`insert into wordle_score values (${number}, ${score}, ${from})`;
}

function start(client) {
    client.onMessage((message) => {
        if (checkIfWordle(message)) {
            const {number, score} = dataFromWordle(message)
            publishData(number, score, message.from).then(r => {
                fs.appendFile('/Users/lucho/Desktop/Repos/bot-wpp/log.txt', `number: ${number}, score: ${score}, from: ${message.from}`, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }).catch(e => {
                fs.appendFile('/Users/lucho/Desktop/Repos/bot-wpp/log.txt', e, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            });
        }
    });
}