const InteractionBase = require("../../Structures/CommandBase");
const Staff = require("../../Models/staff");
module.exports = class PingInteraction extends InteractionBase {
    constructor(...args) {
        super(...args, {
            name: "addstaff",
            description: "Adiciona um staff ao servidor (com o cargo inicial Helper)",
            options: [
                {
                    name: "usuario",
                    type: 6,
                    description:
                        "A menção do usuário a adicionar na staff.",
                    required: true,
                },
                {
                    name: "minecraft",
                    type: 3,
                    description:
                        "O nick do minecraft do usuário.",
                    required: true,
                },
                {
                    name: "devo_anunciar",
                    type: 5,
                    description:
                        "Devo anunciar no canal de logs?.",
                    required: true,
                },
            ],
        });
    }
    async run(interaction) {
        if (!interaction.member.permissions.has('administrator')) {

            interaction.createMessage({
                content: `Hum, acho que você não pode usar esse comando , sorry!`,
                flags: 1 << 6,
            });
            return;

        }
        
        let date = new Date().toLocaleDateString("de-DE");


        let check = await Staff.findOne({ id: interaction.data.options[0].value })
        let user = interaction.channel.guild.members.get(interaction.data.options[0].value)

        if (check) return interaction.createMessage({
            content: `<@${interaction.data.options[0].value}> (${interaction.data.options[1].value}) já é um staff atual no servidor!`,
        });

        await Staff.create({
            id: interaction.data.options[0].value,
            minecraft: interaction.data.options[1].value,
            cargo: "Helper",
            data_entrada: date,
        })
        user.addRole("1073265017476087909", "Adicionado na staff (HELPER)")
        user.addRole("1079138235361542276", "Adicionado na staff (HELPER)")
        user.addRole("1078287710697029692", "Removido da staff (HELPER)")
        interaction.createMessage({
            content: `<@${interaction.data.options[0].value}> (${interaction.data.options[1].value}) foi adicionado na staff (Helper) com sucesso!`,
        });

        if (interaction.data.options[2].value) {

            interaction.channel.guild.channels.get("1092099304916799599").createMessage({
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
                                    "value": `<@${interaction.data.options[0].value}> (${interaction.data.options[1].value})`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": `Seja bem-vindo à nossa equipe! | DG0837`
                            }
                        }
                    ]
            });
        }
    }
};
