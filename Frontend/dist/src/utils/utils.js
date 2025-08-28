import {Platform} from 'react-native';

export const checkNamevalidation = (name) => {
  const nameReg = /^[a-zA-Z ]{2,40}$/;
  const validName = nameReg.test(name);
  if (validName || name === '') {
    return false;
  }
  return true;
};

export const checkEmailValidation = (email) => {
  const value = String(email).toLowerCase().trim();

  // email regex (allows .in, .co, .com, etc.)
  const regEx = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const validEmail = regEx.test(value);

  // phone check (10 digits only, no negative)
  const phoneValue = /^\d{10}$/.test(value);

  return validEmail || phoneValue;
};


export const passwordValidation = (password) => {
  const re = {
    capital: /(?=.*[A-Z])/,
    length: /(?=.{8,40}$)/,
    specialChar: /[ -\/:-@\[-\`{-~]/,
    digit: /(?=.*[0-9])/,
  };
  const validPhone =
    re.capital.test(password) &&
    re.length.test(password) &&
    re.specialChar.test(password) &&
    re.digit.test(password);
  if (validPhone) {
    return false;
  }
  return true;
};

export const HYDERABAD_REGION = {
  latitude: 17.4507997,
  longitude: 78.3914563,
  latitudeDelta: 0.13574692073802552,
  longitudeDelta: 0.07062625139951706,
};

export const CURRENT_POSITION = {
  latitude: 17.4507997,
  longitude: 78.3914563,
};





export function capitalize(word) {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}
