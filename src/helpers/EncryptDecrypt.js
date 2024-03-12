import CryptoJS from 'crypto-js';

const KEY1 = process.env.REACT_APP_ENC_KEY1;
const KEY2 = process.env.REACT_APP_ENC_KEY2;
const KEY3 = process.env.REACT_APP_ENC_KEY3;

const PART_LENGTH =
  parseInt(process.env.REACT_APP_ENC_PART_LENGTH || 0) || 1000;
const JWT_SECRET = process.env.REACT_APP_JWT_TOKEN_SECRET;

const CHUNK_JOIN_SPLIT_STR = 'asdkljqweopi';

const encryptAES = (data, key, iv) => {
  let cipherText = CryptoJS.AES.encrypt(data, key).toString();

  return cipherText;
};

const decryptAES = (data, key, iv) => {
  let decryptedData = CryptoJS.AES.decrypt(data, key).toString(
    CryptoJS.enc.Utf8
  );

  return decryptedData;
};

const encryptDataToArray = (data) => {
  try {
    if (!data) {
      return data;
    }

    let stringifiedData = data;

    if (typeof data === 'object') {
      stringifiedData = JSON.stringify(data);
    }

    let chunk = [];
    let chunkLength = 0;

    while (chunkLength < stringifiedData?.length) {
      let random = Math.random() * PART_LENGTH;
      chunk.push(stringifiedData?.slice(chunkLength, chunkLength + random));

      chunkLength += random;
    }

    let finalResult = [];

    for (let ch of chunk) {
      let firstEnc = encryptAES(ch, KEY1);

      let secondEnc = encryptAES(firstEnc, KEY2);

      let thirdEnc = encryptAES(secondEnc, KEY3);

      finalResult.push(thirdEnc);
    }

    return finalResult;
  } catch (err) {
    return data;
  }
};

const decryptDataFromArray = (data) => {
  try {
    if (!data) {
      return data;
    }

    let encryptedData = data;

    if (!Array.isArray(encryptedData)) {
      encryptedData = encryptedData?.split(CHUNK_JOIN_SPLIT_STR);
    }

    let actualEncrypted = [];

    for (let enc of encryptedData) {
      let thirdDec = decryptAES(enc, KEY3);

      let secondDec = decryptAES(thirdDec, KEY2);

      let firstDec = decryptAES(secondDec, KEY1);

      actualEncrypted.push(firstDec);
    }

    let finalResult = actualEncrypted?.join('');
    if (['{', '['].some((ch) => actualEncrypted?.[0]?.startsWith(ch))) {
      finalResult = JSON.parse(finalResult);
    }

    return finalResult;
  } catch (err) {
    return data;
  }
};

export {
  JWT_SECRET,
  CHUNK_JOIN_SPLIT_STR,
  encryptDataToArray,
  decryptDataFromArray,
};
