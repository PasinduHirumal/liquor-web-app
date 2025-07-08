
class User {
    constructor (id, data) {
        this.id = id;

        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.addresses = data.addresses;
        this.role = data.role;
        this.googleId = data.googleId;

        this.verifyOtp = data.verifyOtp;
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt;
        this.isAccountVerified = data.isAccountVerified;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpiredAt = data.resetOtpExpiredAt;

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    };
    
};



export default User;