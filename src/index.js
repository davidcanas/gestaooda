require('dotenv').config();


const Acol = require('./Structures/Bot');
const config = require('./Structures/BotConfig');
const mongoose = require('mongoose');
const client = new Acol(config);
const staffdb = require("./Models/staff")
mongoose.connect(process.env.MONGO, { //loga no mongodb
useNewUrlParser: true, 
useUnifiedTopology: true 
}).then(() => {
console.log("Conectado ao MongoDB")
}).catch((err) => {
console.log(`Deu erro: ${err}`)
})
client.connect();

const express = require('express');
const app = express();
const port = 8000;


app.get('/', async (req, res)  => {
res.send(`Olá mundo cruel :/`)
})

app.get('/api/staff/get/:ID', async (req , res) => {
  const id = req.params.ID
  var staff; 

  
  if (isNaN(id)) {
  staff = await staffdb.findOne({minecraft: id}) 
  } else {
    staff = await staffdb.findOne({id: id})
  }
  if (!staff) {
    res.json({erro: "Não existe nenhum staff com esse nick minecraft/id discord"})
    return;
  }
   const user = client.guilds.get("1001559876926976000").members.get(staff.id)

 
if (!user) {
  res.json({erro: "Não existe nenhum usuário no discord da odacraft com esse ID"})
  return
}  
  const avatar = user.user.staticAvatarURL

  res.json({
    discord: { 
     id: user.id,
     username: user.username + "#" + 
      user.discriminator,
     avatar: avatar
    }, 
     minecraft: {
      nick: staff.minecraft
   },
    cargo: staff.cargo,
    data_entrada: staff.data_entrada
  })

})

app.listen(process.env.PORT, () => {
console.log(`App ligada na porta ` + process.env.PORT)
})