
class StockHistory {
    constructor (id, data){
        this.id = id;

        this.type = data.type; // add, withdraw
        this.quantity = data.quantity
        this.productId = data.productId;

        this.userId = data.userId;

        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }
}

export default StockHistory;