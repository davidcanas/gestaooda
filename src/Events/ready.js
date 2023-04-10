const Event = require('../Structures/EventBase');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}
	async run() {
		this.client.utils.loadInteractions()
			.then(console.log('-------------------================================----------------------'))
			.then(console.log('-------------------        BOT ON      ----------------------'))
			.catch(console.error);
  this.client.editStatus("dnd", {activities: [{name: "De olho na staff da odacraft", type: 3}]})
	}
};