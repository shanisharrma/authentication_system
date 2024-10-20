import { cloudinary } from '../config';
import { AppError } from '../utils/errors';
import { StatusCodes } from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';

interface IUploadOptions {
    folder?: string;
    public_id?: string;
}

interface IFileValidationOptions {
    fieldName: string;
    allowedMimeTypes: string[];
    maxSize: number;
}

class FileUploaderService {
    private static async uploadFileToCloudinary(
        fileBuffer: Buffer,
        fileType: 'image' | 'video',
        options?: IUploadOptions,
    ): Promise<UploadApiResponse | undefined> {
        return new Promise((resolve, reject) => {
            // * create upload options for file
            const uploadOptions = {
                folder: options?.folder || 'default',
                public_id: options?.public_id || `${fileType}-${Date.now()}`,
                resource_type: fileType,
            };

            // * start the upload file stream
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                // * --> if error -> reject with error
                if (error) {
                    return reject(error);
                }
                // * --> else -> resolve with result
                resolve(result);
            });

            // * end the upload stream
            uploadStream.end(fileBuffer);
        });
    }

    public static async uploadImageToCloudinary(fileBuffer: Buffer, options?: IUploadOptions): Promise<UploadApiResponse | undefined> {
        return await this.uploadFileToCloudinary(fileBuffer, 'image', options);
    }

    public static async uploadVideoToCloudinary(fileBuffer: Buffer, options?: IUploadOptions): Promise<UploadApiResponse | undefined> {
        return await this.uploadFileToCloudinary(fileBuffer, 'video', options);
    }

    public static validateFile(file: Express.Multer.File, options: IFileValidationOptions) {
        // * destructure the options
        const { fieldName, allowedMimeTypes, maxSize } = options;

        // Check if the file exists
        if (!file) {
            throw new AppError(`${fieldName} is required.`, StatusCodes.UNPROCESSABLE_ENTITY);
        }

        // Check for valid MIME type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new AppError(`Only ${allowedMimeTypes.join(', ')} formats are allowed.`, StatusCodes.UNSUPPORTED_MEDIA_TYPE);
        }

        // Check for file size
        if (file.size > maxSize) {
            throw new AppError(`File size must not exceed ${maxSize / (1024 * 1024)}MB.`, StatusCodes.REQUEST_TOO_LONG);
        }

        // If all validations pass, return the file object
        return file;
    }
}
export default FileUploaderService;
