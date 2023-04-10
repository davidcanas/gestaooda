
const express = require("express");
const router = express.Router();


// Home page route.
router.get('/getuser/:ID', (req , res) => {
  console.log(client)
  const id = req.params.ID
  const user = client.guilds.get("1001559876926976000").members.get(id)
if (!user) {
  res.json({erro: "Não existe nenhum usuário no discord da odacraft com esse ID"})
  return;
}  
  const avatar = user.user.staticAvatarURL

  res.json({id: user.id, username: user.username + "#" + user.discriminator, avatar: avatar})

})

module.exports = router;