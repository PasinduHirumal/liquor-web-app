import BaseService from "./BaseService.js";
import DriverDuties from "../models/DriverDuties.js";


class DriverDutyService extends BaseService {
    constructor () {
        super('driver_duties', DriverDuties, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

}

export default DriverDutyService;