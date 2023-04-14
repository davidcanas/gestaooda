require('dotenv').config();


const Acol = require('./Structures/Bot');
const config = require('./Structures/BotConfig');
const mongoose = require('mongoose');
const client = new Acol(config);
const staffdb = require("./Models/staff")
const cargos = require("../config.json")
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


app.get('/', async (req, res) => {
    res.send(`Olá mundo cruel :/`)
})

app.get('/api/staff/get/:ID', async (req, res) => {
    const id = req.params.ID
    var staff;


    if (isNaN(id)) {
        staff = await staffdb.findOne({
            minecraft: id
        })
    } else {
        staff = await staffdb.findOne({
            id: id
        })
    }
    if (!staff) {
        res.json({
            erro: "Não existe nenhum staff com esse nick minecraft/id discord"
        })
        return;
    }
    const user = client.guilds.get("1001559876926976000").members.get(staff.id)


    if (!user) {
        res.json({
            erro: "Não existe nenhum usuário no discord da odacraft com esse ID"
        })
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
app.get("/api/staff/listar", async (req,res) => {
    const lista = await staffdb.find({})
    res.json({number: lista.length, data: lista})
  
})

app.get("/api/staff/add/:ID/:MINECRAFT", async (req,res) => {
  
  if (req.query.auth !== process.env.AUTH) {
     res.json({
            erro: "Não estás autorizado a fazer isso!"
        })
        return;
  }
 const mine = req.params.MINECRAFT
    const id = req.params.ID


 
        const staffdc = await staffdb.findOne({
            id: id
        })

     const staffmine = await staffdb.findOne({
            minecraft: mine
        })
    if (staffdc) {
        res.json({
            erro: "Já existe um staff com esse nick minecraft/id discord"
        })
        return;
    }
   if (staffmine) {
        res.json({
            erro: "Já existe um staff com esse nick minecraft/id discord"
        })
        return;
    }
  
   const user = client.guilds.get("1001559876926976000").members.get(id)
if (!user) {
  res.json({erro: "Não existe nenhum usuário com esse ID no nosso discord"})
  return;
}
 
        let date = new Date().toLocaleDateString("de-DE");

await staffdb.create({
            id: id,
            minecraft: mine,
            cargo: "Helper",
            data_entrada: date,
        })
res.json({id:id,minecraft:mine,cargo:"Helper", data_entrada: date})
   user.addRole("1073265017476087909", "Adicionado na staff (HELPER)")
        user.addRole("1079138235361542276", "Adicionado na staff (HELPER)")
        user.addRole("1078287710697029692", "Removido da staff (HELPER)")

  const staffaviso = client.guilds.get("1001559876926976000").channels.get("1092099304916799599")

  staffaviso.createMessage({
                embeds:
                    [
                        {
                            "type": "rich",
                            "title": `<:Certo:1084974790101696603> **Adicionado na Equipe | OdaCraft**`,
                            "description": `Um **Helper** foi adicionado na equipe do servidor!`,
                            "color": 0x00FFFF,
                            "fields": [
                                {
                                    "name": `Helper adicionado`,
                                    "value": `<@${staff.id}>(${staff.cargo})`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": `Seja bem-vindo à nossa equipe! | DG0837`
                            }
                        }
                    ]
            })
  })
app.get("/api/staff/remove/:ID", async (req,res) => {
  
  if (req.query.auth !== process.env.AUTH) {
     res.json({
            erro: "Não estás autorizado a fazer isso!"
        })
        return;
  }

    const id = req.params.ID


 
      if (isNaN(id)) {
        staff = await staffdb.findOne({
            minecraft: id
        })
    } else {
        staff = await staffdb.findOne({
            id: id
        })
    }
    if (!staff) {
        res.json({
            erro: "Não existe nenhum staff com esse nick minecraft/id discord"
        })
        return;
    }
  
   const user = client.guilds.get("1001559876926976000").members.get(staff.id)
if (!user) {
  res.json({erro: "Não existe nenhum usuário com esse ID no nosso discord"})
  return;
}
 


await staffdb.deleteOne({
            id: staff.id,
        })
  
res.json({id: staff.id, minecraft:staff.minecraft, data_entrada:staff.data_entrada, cargo_antigo:staff.cargo})

         user.removeRole("1072584998793789523", "Removido da staff")
        user.removeRole("1056434731970994216", "Removido da staff")
        user.removeRole("1076574716212543568", "Removido da staff")
        user.removeRole("1001887906530590811", "Removido da staff")
        user.removeRole("1073265017476087909", "Removido da staff")
        user.removeRole("1079138235361542276", "Removido da staff")
        user.removeRole("1078287710697029692", "Removido da staff")
 const staffaviso = client.guilds.get("1001559876926976000").channels.get("1092099304916799599")

  staffaviso.createMessage({
                embeds:
                    [
                        {
                            "type": "rich",
                            "title": `<:block:1093550067341856809> **Expulsão da Equipe | OdaCraft**`,
                            "description": `Um **${staff.cargo}** foi removido da staff do servidor!`,
                            "color": 0x00FFFF,
                            "fields": [
                                {
                                    "name": `${staff.cargo} expulso:`,
                                    "value": `<@${staff.id}> (${staff.minecraft})`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": `Obrigado pelos seus serviços prestados pela odacraft! | A direção`
                            }
                        }
                    ]
            })
  })
app.get("/api/staff/promover/:CARGO/:ID", async (req, res) => {
    if (req.query.auth !== process.env.AUTH) {
        res.json({
            erro: "Não estás autorizado a fazer isso!"
        })
        return;
    }
    const cargo = req.params.CARGO
    const id = req.params.ID


    const arrayStaffCargos = ["Staff", "Moderador", "Admin", "Gerente"]

    if (!arrayStaffCargos.includes(cargo)) {
        res.json({
            erro: "Esse cargo não é promovivel, ou não existe!"
        })
        return;
    }
    var staff;


    if (isNaN(id)) {
        staff = await staffdb.findOne({
            minecraft: id
        })
    } else {
        staff = await staffdb.findOne({
            id: id
        })
    }
    if (!staff) {
        res.json({
            erro: "Não existe nenhum staff com esse nick minecraft/id discord"
        })
        return;
    }
    const user = client.guilds.get("1001559876926976000").members.get(staff.id)


    if (!user) {
        res.json({
            erro: "Não existe nenhum usuário no discord da odacraft com esse ID"
        })

        return;
    }
    /*ESSA PARTE AQUI ELE ADD OS CARGOS E REMOVE OS ANTIGOS*/
    if (cargo == "Staff") {
        user.addRole(cargos.staff.id, "Promovido para Staff")

        user.removeRole(cargos.helper.id, "Promovido para Staff")
        user.removeRole(cargos.mod.id, "Promovido para Staff")
        user.removeRole(cargos.admin.id, "Promovido para Staff")
        user.removeRole(cargos.gerente.id, "Promovido para Staff")

    } else if (cargo == "Moderador") {
        user.addRole(cargos.mod.id, "Promovido para Moderador")

        user.removeRole(cargos.helper.id, "Promovido para Moderador")
        user.removeRole(cargos.staff.id, "Promovido para Moderador")
        user.removeRole(cargos.admin.id, "Promovido para Moderador")
        user.removeRole(cargos.gerente.id, "Promovido para Moderador")

    } else if (cargo == "Admin") {
        user.addRole(cargos.admin.id, "Promovido para Admin")

        user.removeRole(cargos.helper.id, "Promovido para Admin")
        user.removeRole(cargos.mod.id, "Promovido para Admin")
        user.removeRole(cargos.staff.id, "Promovido para Admin")
        user.removeRole(cargos.gerente.id, "Promovido para Admin")

    } else if (cargo == "Gerente") {
        user.addRole(cargos.gerente.id, "Promovido para Gerente")

        user.removeRole(cargos.helper.id, "Promovido para Gerente")
        user.removeRole(cargos.mod.id, "Promovido para Gerente")
        user.removeRole(cargos.admin.id, "Promovido para Gerente")
        user.removeRole(cargos.staff.id, "Promovido para Gerente")

    }

    /*FIM*/
    await staffdb.updateOne({
        id: staff.id
    }, {
        minecraft: staff.minecraft,
        cargo: cargo,
        data_entrada: staff.data_entrada,
    })

    res.json({
        id: staff.id,
        minecraft: staff.minecraft,
        antigo_cargo: staff.cargo,
        novo_cargo: cargo,
        data_entrada: staff.data_entrada
    })

    const announceguild = client.guilds.get("1001559876926976000").channels.get("1092099304916799599").createMessage({
        embeds: [{
            "type": "rich",
            "title": `<:Certo:1084974790101696603> **Membro da equipe promovido | OdaCraft**`,
            "description": `Um **${staff.cargo}** foi promovido para **${cargo}**!`,
            "color": 0x00FFFF,
            "fields": [{
                "name": `Usuário promovido`,
                "value": `<@${staff.id}> (${staff.minecraft})`,
                "inline": true
            }],
            "footer": {
                "text": `Obrigado pelo serviço sendo prestado por você! | DG0837`
            }
        }]
    });

})


app.listen(process.env.PORT, () => {
    console.log(`App ligada na porta ` + process.env.PORT)
})