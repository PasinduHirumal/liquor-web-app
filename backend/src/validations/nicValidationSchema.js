import Joi from 'joi';

const validateSriLankanNIC = (nic, helpers) => {
  const newFormat = /^\d{12}$/;
  const oldFormat = /^\d{9}[VX]$/;
  
  if (!newFormat.test(nic) && !oldFormat.test(nic)) {
    return helpers.error('nic.invalid');
  }
  
  // Date validation
  if (newFormat.test(nic)) {
    const year = parseInt(nic.substring(0, 4));
    const dayOfYear = parseInt(nic.substring(4, 7));
    
    if (year < 1900 || year > new Date().getFullYear() || dayOfYear < 1 || dayOfYear > 366) {
      return helpers.error('nic.invalid');
    }
  } else {
    const dayOfYear = parseInt(nic.substring(2, 5));
    if (dayOfYear < 1 || dayOfYear > 366) {
      return helpers.error('nic.invalid');
    }
  }
  
  return nic;
};

const validateForeignID = (id, helpers) => {
  const patterns = [
    /^[A-Z]{1,3}\d{6,9}$/,  // Passport: A1234567, AB1234567
    /^[A-Z0-9]{6,20}$/,     // General alphanumeric
    /^\d{8,15}$/,           // Numeric national IDs
  ];
  
  const isValid = patterns.some(pattern => pattern.test(id));
  
  if (!isValid) {
    return helpers.error('nic.invalid');
  }
  
  return id;
};

const nicValidator = Joi.string().custom((value, helpers) => {
  const nic = value.trim().toUpperCase();
  
  // Try Sri Lankan format first
  const sriLankanFormats = [/^\d{12}$/, /^\d{9}[VX]$/];
  const isSriLankan = sriLankanFormats.some(format => format.test(nic));
  
  if (isSriLankan) {
    return validateSriLankanNIC(nic, helpers);
  } else {
    return validateForeignID(nic, helpers);
  }
}).messages({
  'nic.invalid': 'Invalid NIC/ID number format'
});

export default nicValidator;