export default function formatToE164(phone, defaultCountryCode = "+91") {
  if (!phone) return "";

  // Remove spaces, dashes, brackets
  let digits = phone.replace(/\D/g, "");

  // If it already starts with country code, just return with +
  if (digits.startsWith(defaultCountryCode.replace("+", ""))) {
    return `+${digits}`;
  }

  // If 10 digits only, prefix country code
  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }

  // Otherwise return as-is with +
  return digits.startsWith("+") ? digits : `+${digits}`;
}
