import { message, Upload } from 'antd';
import StorageService from "../services/storage.service";
import EventBus from "./EventBus";




const uploaderHelper = {

  getBase64(img, callback){
     const reader = new FileReader();
     reader.addEventListener('load', () => callback(reader.result));
     reader.readAsDataURL(img);
  },

  beforeUpload(file){
     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
     if (!isJpgOrPng) 
        message.error('You can only upload JPG/PNG file!');
/*
     const isLt2M = file.size / 1024 / 1024 < 2;

     if (!isLt2M)
        message.error('Image must smaller than 2MB!');
*/
     return isJpgOrPng;
   },
   async uploadImage(options){
      const { onSuccess, onError, file, onProgress } = options;

      const fmData = new FormData();
      fmData.append("image", file);
      try {
         const data = await StorageService.uploadFile(fmData);
         console.log('data', data)
         EventBus.dispatch("fileUploaded", data);
         onSuccess(data);

    } catch (err) {
       console.log("Eroor: ", err);
       const error = new Error("Some error");
       onError({ err });
    }
  },
   async uploadIPFS(options){
      const { onSuccess, onError, file, onProgress } = options;

      const fmData = new FormData();
      fmData.append("image", file);
      try {
         const data = await StorageService.upload(fmData);
         console.log('data', data)
         EventBus.dispatch("fileUploadedToIPFS", data);
         onSuccess(data);

    } catch (err) {
       console.log("Eroor: ", err);
       const error = new Error("Some error");
       onError({ err });
    }
  },

  getFullPath(filename)
  {
     return StorageService.getServerStorage() +  filename;
  },
  async testIPFS()
  {
    await StorageService.testIPFS();
  }



}

export default uploaderHelper;
