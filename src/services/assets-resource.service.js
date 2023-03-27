import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'asset/assetsresources/';

class AssetsResourceService {

  async getList(asset) {
    return ApiProvider.get(SERVICE_API + 'list', { params:{page:-1, asset: asset}}, { headers: authHeader() });
  }
  async addNewItem(data) {
    return ApiProvider.post(SERVICE_API + 'create', data, { headers: authHeader() });
  }
  async updateItem(data) {
    return ApiProvider.post(SERVICE_API + 'update', data, { headers: authHeader() });
  }
  async deleteItem(uuid) {
    return ApiProvider.post(SERVICE_API + 'remove', {uuid:uuid}, { headers: authHeader() });
  }


}

export default new AssetsResourceService();
