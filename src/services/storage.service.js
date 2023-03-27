import ApiProvider from './api-provider';
import authHeader from './auth-header';
import {API_URL,SERVER_URL} from './api-host';

const SERVICE_API = API_URL + 'storage/';

class StorageService {

  getServerStorage() {
    return SERVER_URL + 'files/';
  }
  async uploadFile(fmData) {
     return ApiProvider.post(SERVICE_API + 'uploadFile', fmData,{headers: authHeader()});
  }
  async upload(fmData) {
     return ApiProvider.post(SERVICE_API + 'upload', fmData,{headers: authHeader()});
  }

  async testIPFS() {
     return ApiProvider.post(SERVICE_API + 'testAuthStorage',{}, {headers: authHeader()});
  }



}

export default new StorageService();
