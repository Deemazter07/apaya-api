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

function getPagination(pageNumber, pageSize) {
  let offset = +pageNumber - 1;
  const limit = +pageSize;

  if (offset >= 1) {
    offset = offset * limit;
  }

  return { offset, limit };
}

function getPagingData(data, pageNumber, pageSize) {
  const { count: totalItems, rows } = data;

  const totalPages = Math.ceil(totalItems / +pageSize);

  const returnData = {
    currentPage: +pageNumber,
    currentItems: rows.length,
    totalPages,
    totalItems,
    rows,
  };

  return returnData;
}

module.exports = {
  formatPhoneNumber,
  isEmpty,
  isEmailFormat,
  isPhoneFormat,
  getPagination,
  getPagingData,
};
