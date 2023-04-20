import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'representations/';

class RepresentationService {

  async getItem(name) {
    return ApiProvider.get(SERVICE_API + 'get', { params:{name:name}}, { headers: authHeader() });
  }


}

export default new RepresentationService();
