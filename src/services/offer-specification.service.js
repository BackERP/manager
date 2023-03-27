import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'offer/specification/';

class OfferSpecificationService {

  async getList(document) {
    return ApiProvider.get(SERVICE_API + 'list', { params:{page:-1, document:document}}, { headers: authHeader() });
  }

}

export default new OfferSpecificationService();
