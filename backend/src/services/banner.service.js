import BaseService from "./BaseService.js";
import Banners from "../models/Banner.js";


class BannerService extends BaseService {
    constructor() {
        super('banners', Banners, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }
}

export default BannerService;