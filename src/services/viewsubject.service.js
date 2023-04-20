import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'representations/viewsubjects/';

class ViewSubjectService {

  async getItem(market, object_uuid) {
    return ApiProvider.get(SERVICE_API + 'get', { params:{market:market, object_uuid:object_uuid}}, { headers: authHeader() });
  }
  async saveItem(market, object_uuid, fields) {
    return ApiProvider.post(SERVICE_API + 'save', {market, object_uuid, fields}, { headers: authHeader() });
  }

}

export default new ViewSubjectService();
