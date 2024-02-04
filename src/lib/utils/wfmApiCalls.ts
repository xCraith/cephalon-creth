import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleFailure, handleSuccess } from './apiHandling';
import { Order } from '../../types/wfmTypes';
import { formatInput } from './bot';
import { Item } from '../../types/wfmTypes';

export class WFM {
	private static baseUrl = 'https://api.warframe.market/v1';

	static async getSellOrders(urlName: string, modRank?: number): Promise<Order[]> {
		try {
			const itemName = formatInput(urlName);
			const response: AxiosResponse<{ payload: { orders: Order[] }; include?: { item?: Item } }> = await axios.get(
				`${this.baseUrl}/items/${itemName}/orders?include=item`
			);
			const orders = handleSuccess(response).payload.orders;

			const enrichedOrders = orders.map((order) => {
				return {
					...order,
					...(response.data.include || {})
				};
			});

			const filteredOrders = WFM.filterOrders(enrichedOrders, modRank);
			return filteredOrders;
		} catch (error) {
			console.log(error);
			handleFailure(error as AxiosError);
		}
	}

	private static filterOrders(orders: Order[], modRank?: number): Order[] {
		const filteredOrders = orders
			.filter((order) => order.user.status.toLowerCase() === 'ingame' && order.order_type.toLowerCase() === 'sell')
			.sort((a, b) => a.platinum - b.platinum)
			.slice(0, 5)
			.map((order) => ({
				...order,
				mod_rank: typeof order.mod_rank !== 'undefined' ? order.mod_rank : modRank !== undefined ? 0 : undefined
			})) as Order[];

		return filteredOrders;
	}
}
