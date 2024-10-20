import { v2 as cloudinary } from 'cloudinary';
import { ServerConfig } from '.';

// * Configure cloudinary
cloudinary.config({
    cloud_name: ServerConfig.CLOUDINARY.CLOUD_NAME,
    api_key: ServerConfig.CLOUDINARY.API_KEY,
    api_secret: ServerConfig.CLOUDINARY.API_SECRET,
});

export default cloudinary;
