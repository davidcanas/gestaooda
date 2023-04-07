const InteractionBase = require("../../Structures/CommandBase");
module.exports = class PingInteraction extends InteractionBase {
  constructor(...args) {
    super(...args, {
      name: "ship_com_o_oda",
      description: "gay!",
      options: [
        {
          type: 6,
          name: "amigo",
          description: "quem",
          required: true,
        },
      ],
    });
  }
  async run(interaction) {
    const who = interaction.data.options[0].value;
    interaction.createMessage({
      content: `Eu shippo o <@${who}> e o Oda`,
    });
  }
};
