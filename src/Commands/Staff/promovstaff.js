const InteractionBase = require("../../Structures/CommandBase");
const Staff = require("../../Models/staff");
const cargos = require("../../../config.json")

module.exports = class PingInteraction extends InteractionBase {
    constructor(...args) {
        super(...args, {
            name: "promoverstaff",
            description: "Promove um staff do servidor.",
            options: [
                {
                    name: "usuario",
                    type: 6,
                    description:
                        "A menção do usuário a adicionar na staff.",
                    required: true,
                },
                {
                    type: 3,
                    name: "cargo",
                    description: "Promover para qual cargo?",
                    choices: [
                        {
                            name: "Promover para Staff",
                            value: "Staff",
                        },
                        {
                            name: "Promover para Moderador",
                            value: "Moderador",
                        },
                        {
                            name: "Promover para Admin",
                            value: "Admin",
                        },
                        {
                            name: "Promover para Gerente",
                            value: "Gerente",
                        },

                    ],
                    required: true

                },
                {
                    name: "devo_anunciar",
                    type: 5,
                    description:
                        "Devo anunciar no canal de logs?",
                    required: true,
                },
            ],
        });
    }
    async run(interaction) {

        if (!interaction.member.permissions.has("administrator")) {

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
            content: `<@${interaction.data.options[0].value}> (${interaction.data.options[1].value}) não é um staff atual no servidor!`,
        });


        if (interaction.data.options[1].value == "Staff") {
            user.addRole(cargos.staff.id, "Promovido para Staff")

            user.removeRole(cargos.helper.id, "Promovido para Staff")
            user.removeRole(cargos.mod.id, "Promovido para Staff")
            user.removeRole(cargos.admin.id, "Promovido para Staff")
            user.removeRole(cargos.gerente.id, "Promovido para Staff")

        } else if (interaction.data.options[1].value == "Moderador") {
            user.addRole(cargos.mod.id, "Promovido para Moderador")

            user.removeRole(cargos.helper.id, "Promovido para Moderador")
            user.removeRole(cargos.staff.id, "Promovido para Moderador")
            user.removeRole(cargos.admin.id, "Promovido para Moderador")
            user.removeRole(cargos.gerente.id, "Promovido para Moderador")

        } else if (interaction.data.options[1].value == "Admin") {
            user.addRole(cargos.admin.id, "Promovido para Admin")

            user.removeRole(cargos.helper.id, "Promovido para Admin")
            user.removeRole(cargos.mod.id, "Promovido para Admin")
            user.removeRole(cargos.staff.id, "Promovido para Admin")
            user.removeRole(cargos.gerente.id, "Promovido para Admin")

        } else if (interaction.data.options[1].value == "Gerente") {
            user.addRole(cargos.gerente.id, "Promovido para Gerente")

            user.removeRole(cargos.helper.id, "Promovido para Gerente")
            user.removeRole(cargos.mod.id, "Promovido para Gerente")
            user.removeRole(cargos.admin.id, "Promovido para Gerente")
            user.removeRole(cargos.staff.id, "Promovido para Gerente")

        }
        
        await Staff.updateOne({
            id: check.id
        }, {
            minecraft: check.minecraft,
            cargo: interaction.data.options[1].value,
            data_entrada: check.data_entrada,
        })

        interaction.createMessage({
            content: `<@${interaction.data.options[0].value}> (${check.minecraft}) foi promovido de ${check.cargo} para ${interaction.data.options[1].value} com sucesso!`,
        });

        if (interaction.data.options[2].value) {

            interaction.channel.guild.channels.get("1092099304916799599").createMessage({
                embeds:
                    [
                        {
                            "type": "rich",
                            "title": `<:Certo:1084974790101696603> **Membro da equipe promovido | OdaCraft**`,
                            "description": `Um **${check.cargo}** foi promovido para **${interaction.data.options[1].value}**!`,
                            "color": 0x00FFFF,
                            "fields": [
                                {
                                    "name": `Usuário promovido`,
                                    "value": `<@${interaction.data.options[0].value}> (${check.minecraft})`,
                                    "inline": true
                                }
                            ],
                            "footer": {
                                "text": `Obrigado pelo serviço sendo prestado por você! | DG0837`
                            }
                        }
                    ]
            });
        }

    }
};
