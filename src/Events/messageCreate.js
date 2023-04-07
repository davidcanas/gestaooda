const Eris = require('eris');
const Event = require('../Structures/EventBase');
const staffdb = require('../Models/staff');
module.exports = class extends Event {

	async run(message) {
        const client = message.channel.client
        const args = message.content.slice("-eval").trim().split(/ +/g);
        if(message.author.bot) return;
        if(message.content.startsWith("-eval")) {

            if (message.author.id == "733963304610824252" || message.author.id == "402190502172295168") {
                try {
                    if(!args.join(' ')) return message.channel.createMessage(`<@${message.author.id}> Insira algo para ser executado!`)
                   console.log(args[1])
                    let code = eval(args[1])
                    console.log(code)
                    if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
                   
                    message.channel.createMessage(`\`\`\`js\n${code}\n\`\`\``)
                } catch(e) {
                    message.channel.createMessage(`\`\`\`js\n${e}\n\`\`\``);
                }
            }
            else{
                message.channel.createMessage("noobs não podem usar esse comando")
            }
        }

}

}