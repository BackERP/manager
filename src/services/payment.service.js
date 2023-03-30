import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'payments/';

class PaymentService {

  async paid(data) {
    return ApiProvider.post(SERVICE_API + 'paid', data);
  }

}

export default new PaymentService();
