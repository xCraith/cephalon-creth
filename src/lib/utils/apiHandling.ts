import { AxiosResponse, AxiosError } from 'axios';

export function handleSuccess<T>(response: AxiosResponse<T>): T {
	return response.data;
}

export function handleFailure(error: AxiosError<unknown>): never {
	if (error.response) {
		console.error('API Error - Response Data:', error.response.data);
		console.error('API Error - Status Code:', error.response.status);
	} else if (error.request) {
		console.error('API Error - No Response Received');
	} else {
		console.error('API Error - Request Setup Issues');
	}
	if (error.response && error.response.status === 404) {
		throw new Error('Invalid Item', error);
	} else {
		throw new Error('API request failed', error);
	}
}
