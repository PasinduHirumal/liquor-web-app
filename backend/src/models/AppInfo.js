
class AppInfo {
    constructor (id, data) {
        this.id = id;

        this.reg_number = data.reg_number; // for backend usage
        this.description = data.description;
        this.app_version = data.app_version;
        this.is_liquor_show = data.is_liquor_show;
        this.commissionRate_drivers = data.commissionRate_drivers;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export default AppInfo;