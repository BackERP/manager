import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'operations/';

class OperationService {

  async issue(data) {
    return ApiProvider.post(SERVICE_API + 'issue', data, { headers: authHeader() });
  }
  async income(data) {
    return ApiProvider.post(SERVICE_API + 'income', data, { headers: authHeader() });
  }
  async makeOffer(data) {
    return ApiProvider.post(SERVICE_API + 'makeOffer', data, { headers: authHeader() });
  }
  async makeReserve(data) {
    return ApiProvider.post(SERVICE_API + 'makeReserve', data, { headers: authHeader() });
  }
  async freeReserve(data) {
    return ApiProvider.post(SERVICE_API + 'freeReserve', data, { headers: authHeader() });
  }
  async makeOrder(data) {
    return ApiProvider.post(SERVICE_API + 'makeOrder', data, { headers: authHeader() });
  }
  async makePaid(data) {
    return ApiProvider.post(SERVICE_API + 'makePaid', data, { headers: authHeader() });
  }
  async makeReturn(data) {
    return ApiProvider.post(SERVICE_API + 'makeReturn', data, { headers: authHeader() });
  }


}

export default new OperationService();
