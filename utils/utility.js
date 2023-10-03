function formatPhoneNumber(number) {
  number = number.toString();
  // Remove any non-numeric characters from the input
  const cleanedNumber = number.replace(/\D/g, "");

  // Check if the cleaned number starts with "0" (local number)
  if (cleanedNumber.startsWith("0")) {
    // Replace the leading "0" with "+62"
    return `+62${cleanedNumber.substring(1)}`;
  } else if (cleanedNumber.startsWith("8")) {
    return `+62${cleanedNumber}`;
  } else if (cleanedNumber.startsWith("+")) {
    return cleanedNumber;
  }

  return `+${cleanedNumber}`;
}

function isEmpty(str) {
  return !str || str.length === 0;
}

function isEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isPhoneFormat(phone) {
  phone = phone.toString();
  if (phone.startsWith("0")) {
    phone = phone.substring(1);
  } else if (phone.startsWith("+62")) {
    phone = phone.substring(3);
  }
  const phoneRegex = /^\+?\d{1,4}[-. ]?\d{1,14}$/;
  return phoneRegex.test(phone);
}

module.exports = {
  formatPhoneNumber,
  isEmpty,
  isEmailFormat,
  isPhoneFormat,
};
