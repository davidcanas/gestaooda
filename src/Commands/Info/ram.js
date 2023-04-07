const InteractionBase = require("../../Structures/CommandBase");
module.exports = class PingInteraction extends InteractionBase {
  constructor(...args) {
    super(...args, {
      name: "ram",
      description: "vê quanta ram estou usando",
      options: [],
    });
  }
  async run(interaction) {
    interaction.createMessage({
      content: `Eu estou usando ${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB de ram | ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)}MB de heap `,
    });
  }
};
