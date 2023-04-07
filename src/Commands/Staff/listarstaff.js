const InteractionBase = require("../../Structures/CommandBase");
const Staff = require("../../Models/staff");
const cargos = require("../../../config.json")
module.exports = class PingInteraction extends InteractionBase {
    constructor(...args) {
        super(...args, {
            name: "listarstaff",
            description: "Lista todos os staffs VÁLIDOS do servidor",
            options: [],
        });
    }
    async run(interaction) {

        const staffdb = await Staff.find({})
        var staffs = []
        var helpers = []
        var mods = []
        var admins = []
        var gerentes = []
        var diretordastaff = []
        staffdb.forEach(staff => {
            if (staff.cargo == "Staff") {
                staffs.push(`<@${staff.id}> (${staff.minecraft})`)
            }
            if (staff.cargo == "Helper") {
                helpers.push(`<@${staff.id}> (${staff.minecraft})`)
            }
            if (staff.cargo == "Moderador") {
                mods.push(`<@${staff.id}> (${staff.minecraft})`)
            }
            if (staff.cargo == "Admin") {
                admins.push(`<@${staff.id}> (${staff.minecraft})`)
            }
            if (staff.cargo == "Gerente") {
                gerentes.push(`<@${staff.id}> (${staff.minecraft})`)
            }
            if (staff.cargo == "Diretor da Staff") {

                diretordastaff.push(`<@${staff.id}> (${staff.minecraft})`)
            }

        })

        interaction.createMessage({
            content: `${cargos.gerente.emoji} **Gerentes:**\n${gerentes.join("\n")}\n\n${cargos.admin.emoji} **Admins:**\n${admins.join("\n")}\n\n${cargos.mod.emoji} **Moderadores:**\n${mods.join("\n")}\n\n${cargos.staff.emoji} **Staffs:**\n${staffs.join("\n")}\n\n${cargos.helper.emoji} **Helpers:**\n${helpers.join("\n")}`,
        });
    }
};
