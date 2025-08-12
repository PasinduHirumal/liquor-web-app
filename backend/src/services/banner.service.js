import BaseService from "./BaseService";
import Banners from "../models/Banner";


class BannerService extends BaseService {
    constructor() {
        super('banners', Banners, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }
}

export default BannerService;