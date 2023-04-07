require('dotenv').config();
const Acol = require('./Structures/Bot');
const config = require('./Structures/BotConfig');
const mongoose = require('mongoose');
const client = new Acol(config);

mongoose.connect(process.env.MONGO, { //loga no mongodb
useNewUrlParser: true, 
useUnifiedTopology: true 
}).then(() => {
console.log("Conectado ao MongoDB")
}).catch((err) => {
console.log(`Deu erro: ${err}`)
})
client.connect();