
class MoneyWithdraws {
    constructor (id, data) {
        this.withdraw_id = id;
        
        this.withdraw_amount = data.withdraw_amount;
        this.description = data.description;
        this.admin_id = data.admin_id;
        this.admin_email = data.admin_email;
        this.admin_role = data.admin_role;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default MoneyWithdraws;