const InteractionBase = require("../../Structures/CommandBase");
const Staff = require("../../Models/staff");

module.exports = class PingInteraction extends InteractionBase {
    constructor(...args) {
        super(...args, {
            name: "remstaff",
            description: "Remove um staff do servidor.",
            options: [
                {
                    name: "usuario",
                    type: 6,
                    description:
                        "A menção do usuário a adicionar na staff.",
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
        if (!check) return interaction.createMessage({
            content: `<@${interaction.data.options[0].value}> não é um staff atual no servidor!`,
        });

        interaction.createMessage({
            content: `<@${interaction.data.options[0].value}> (${check.minecraft}) foi removido da staff com sucesso!`,
        });

        user.removeRole("1072584998793789523", "Removido da staff")
        user.removeRole("1056434731970994216", "Removido da staff")
        user.removeRole("1076574716212543568", "Removido da staff")
        user.removeRole("1001887906530590811", "Removido da staff")
        user.removeRole("1073265017476087909", "Removido da staff")
        user.removeRole("1079138235361542276", "Removido da staff")
        user.removeRole("1078287710697029692", "Removido da staff")

        if (interaction.data.options[1].value) {

            interaction.channel.guild.channels.get("1092099304916799599").createMessage({
                embeds:
                    [
                        {
                            "type": "rich",
                            "title": `<:block:1093550067341856809> **Expulsão da Equipe | OdaCraft**`,
                            "description": `Um **${check.cargo}** foi removido da staff do servidor!`,
                            "color": 0x00FFFF,
                            "fields": [
                                {
                                    "name": `${check.cargo} expulso:`,
                                    "value": `<@${interaction.data.options[0].value}> (${check.minecraft})`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": `Obrigado pelos seus serviços prestados pela odacraft! | DG0837`
                            }
                        }
                    ]
            });
        }

        await Staff.deleteOne({
            id: interaction.data.options[0].value,
        })



    }
};
