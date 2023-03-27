import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'registers/sale/';

class SaleRegistrService {

  async getList() {
    return ApiProvider.get(SERVICE_API + 'list', { params:{page:-1}}, { headers: authHeader() });
  }


}

export default new SaleRegistrService();
