
class AdminUsers {
    constructor (id, data) {
        this.id = id;

        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;

        this.role = data.role;
        this.googleId = data.googleId;
        this.where_house_id = data.where_house_id;
        this.isActive = data.isActive;
        this.isAdminAccepted = data.isAdminAccepted;

        this.verifyOtp = data.verifyOtp;
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt;
        this.isAccountVerified = data.isAccountVerified;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpiredAt = data.resetOtpExpiredAt;

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    };
    
};



export default AdminUsers;