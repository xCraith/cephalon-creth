import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleFailure, handleSuccess } from './apiHandling';
import { Order } from '../../types/wfmTypes';
import { formatInput } from './bot';
import { Item } from '../../types/wfmTypes';

export class WFM {
	private static baseUrl = 'https://api.warframe.market/v1';

	static async getSellOrders(urlName: string): Promise<Order[]> {
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

			const filteredOrders = WFM.filterOrders(enrichedOrders);
			return filteredOrders;
		} catch (error) {
			console.log(error);
			handleFailure(error as AxiosError);
		}
	}

	private static filterOrders(orders: Order[]): Order[] {
		return orders
			.filter((order) => order.user.status.toLowerCase() === 'ingame')
			.sort((a, b) => a.platinum - b.platinum)
			.slice(0, 5)
			.map((order) => ({
				...order
			}));
	}
}
