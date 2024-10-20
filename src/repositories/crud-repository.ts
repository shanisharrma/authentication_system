import { CreationAttributes, FindOptions, Model, ModelStatic } from 'sequelize';
import AppError from '../utils/errors/app-error';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';

class CrudRepository<T extends Model> {
    private model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    public async create(data: CreationAttributes<T>): Promise<T> {
        const response = await this.model.create(data);
        return response;
    }

    public async get(id: number): Promise<T | null> {
        const response = await this.model.findByPk(id);
        if (!response) {
            throw new AppError(ResponseMessage.NOT_FOUND('Resource'), StatusCodes.NOT_FOUND);
        }
        return response;
    }

    public async getAll(options?: FindOptions): Promise<T[]> {
        const response = await this.model.findAll(options);
        return response;
    }

    public async getOne(options: FindOptions) {
        return await this.model.findOne(options);
    }

    public async getOneById(id: number): Promise<T> {
        const response = await this.model.findByPk(id);
        if (!response) {
            throw new AppError(ResponseMessage.NOT_FOUND('Resource'), StatusCodes.NOT_FOUND);
        }
        return response;
    }

    public async destroy(id: number): Promise<boolean> {
        const response = await this.model.findByPk(id);
        if (!response) throw new AppError(ResponseMessage.NOT_FOUND('Resource'), StatusCodes.NOT_FOUND);
        await response.destroy();
        return true;
    }

    public async update(id: number, data: Partial<T['_attributes']>): Promise<T | null> {
        const response = await this.model.findByPk(id);
        if (!response) throw new AppError(ResponseMessage.NOT_FOUND('Resource'), StatusCodes.NOT_FOUND);
        return await response.update(data);
    }
}

export default CrudRepository;
