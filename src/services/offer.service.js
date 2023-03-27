import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'offers/';

class OfferService {

  async getList() {
    return ApiProvider.get(SERVICE_API + 'list', { params:{page:-1}}, { headers: authHeader() });
  }
  async offerItem(data) {
    return ApiProvider.post(SERVICE_API + 'createByAsset', data, { headers: authHeader() });
  }



}

export default new OfferService();
