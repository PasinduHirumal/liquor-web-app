import BaseService from "./BaseService.js";
import StockHistory from "../models/StockHistory.js";


class StockHistoryService extends BaseService {
    constructor () {
        super('stock_history', StockHistory, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

}

export default StockHistoryService;