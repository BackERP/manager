import axios from 'axios';
import EventBus from "../common/EventBus";




class ApiProvider {

   async get(url, data, headers)
   {
      try{
        const response = await axios.get(url, data, headers);
        if(response.data.ok)
          return response.data.data;
        EventBus.dispatch("server_error", response.data.error);
      }
      catch(err)
      {
        if (err.response && err.response.status === 401) {
          EventBus.dispatch("unauthorized", err.message);
          return;
        }
        EventBus.dispatch("server_error", err.message);
      }
   }
   async post(url, data, headers)
   {
      try{
        const response = await axios.post(url, data, headers);
        if(response.data.ok)
          return response.data.data;
        EventBus.dispatch("server_error", response.data.error);
      }
      catch(err)
      {
        if (err.response && err.response.status === 401) {
          EventBus.dispatch("unauthorized", err.message);
          return;
        }
        EventBus.dispatch("server_error", err.message);
      }
   }

}

export default new ApiProvider();

