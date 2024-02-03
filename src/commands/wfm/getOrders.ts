import { ApplyOptions } from '@sapphire/decorators';

import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { WFM } from '../../lib/utils/wfmApiCalls';
import { blue } from '../../lib/constants';

@ApplyOptions<Command.Options>({
	name: 'getorders',
	description: 'get 5 lowest cost sell orders for x item'
})
export default class serverStatusCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((command) => {
			command
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => option.setName('itemname').setDescription('name of the item').setRequired(true));
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();
			const itemName = interaction.options.getString('itemname');
			const itemInfo = await WFM.getSellOrders(itemName!);

			const responseEmbed = new EmbedBuilder()
				.setTitle(`Sell Orders ➜ ${itemName}`)
				.setColor(blue)
				.setFooter({ text: 'Cephalon Creth' })

				.setTimestamp();

			for (const item of itemInfo) {
				responseEmbed.addFields({
					name: `${item.user.ingame_name}`,
					value: `Price: ${item.platinum} Platinum \n Quantity: ${item.quantity}`
				});
				responseEmbed.setImage(`http://warframe.market/static/assets/${item.item.items_in_set[0].thumb}`);
			}
			await interaction.editReply({ embeds: [responseEmbed] });
		} catch (err) {
			await interaction.editReply({ content: `${err}` });
		}
	}
}
