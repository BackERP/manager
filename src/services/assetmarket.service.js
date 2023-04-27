import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'assetmarket/';

class AssetMarketService {

  async getItem(market, object_uuid) {
    return ApiProvider.get(SERVICE_API + 'get', { params:{market:market, object_uuid:object_uuid}}, { headers: authHeader() });
  }

}

export default new AssetMarketService();
