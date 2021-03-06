const { List, Card, Event } = require('../models');

module.exports = {
	post: async ctx => {
		let card = await Card.findById(ctx.params.cardId);

		let list = await List.create({
			title: ctx.request.body.title,
			card: card._id,
			tasks: []
		});

		ctx.body = list;

		card.lists.push(list._id);
		card.save();
	},
	patch: async ctx => {
		delete ctx.request.body._id;
		delete ctx.request.body.__v;

		let list = await List.findByIdAndUpdate(
			ctx.params.listId, ctx.request.body, {new: true}
		);

		ctx.body = list;

		Event.create({
			user: ctx.state.user._id,
			action: (list.__v === 1)? 'new_list' : 'edit_list',
			card: list.card,
			title: list.title
		})
	}
};
