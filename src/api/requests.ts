import { API_KEY } from './api.key';
import { apiEndpoints } from './endpoints';

/**
 * 
 * @see https://developers.giphy.com/docs/api/endpoint/#search
 */
const search = (searchText: string, offset: number = 0, limit = 25): Promise<Response> => {
    const url = new URL(apiEndpoints.search);
    url.searchParams.append('q', searchText);
    url.searchParams.append('offset', String(offset));
    url.searchParams.append('limit', String(limit));
    url.searchParams.append('api_key', API_KEY);

    return fetch(url.href);
};

const apiRequests = {
    search,
};

export {
    apiRequests,
};
