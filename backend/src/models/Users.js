
class Users {
    constructor (id, data) {
        this.user_id = id;

        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phoneNumber = data.phoneNumber;
        this.nic_number = data.nic_number;
        this.dateOfBirth = data.dateOfBirth;
        this.profilePicUrl = data.profilePicUrl || null;
        this.addresses = data.addresses;

        this.role = data.role;
        this.google_id = data.google_id;

        this.isActive = data.isActive;
        this.isAccountCompleted = data.isAccountCompleted || false;
        this.havePendingMembership = data.havePendingMembership || false;
        this.isAccountVerified = data.isAccountVerified || false;
        this.isEnterpriseMember = data.isEnterpriseMember || false;

        this.verifyOtp = data.verifyOtp;
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt;
        this.isAccountVerified = data.isAccountVerified;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpiredAt = data.resetOtpExpiredAt;

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    };
    
};



export default Users;