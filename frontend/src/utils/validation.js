import { checkDuplicatedEmail } from '@/api/user';

export const validatePassword = (rule, value, callback) => {
  const regex = new RegExp('^(?=.*[a-zA-Z0-9])(?=.*[a-zA-Z!@#$%^&*])(?=.*[0-9!@#$%^&*]).{8,20}$').test(value);
  if (!regex) { 
    callback(new Error('8~20자, 숫자, 알파벳, 특수문자 중 2가지 이상을 조합해주세요.'));
  } else {
    callback();
  }
};

export const validateUsername = (rule, value, callback) => {
  const regex = new RegExp('^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$').test(value);
  if (!regex) { 
    callback(new Error('2~8자, 숫자, 알파벳, 한글만 입력할 수 있습니다.'));
  } else {
    callback();
  }
};

export const validateDuplicatedEmail = (rule, value, callback) => {
  // 이메일 중복 여부를 확인한다.
  checkDuplicatedEmail({
    email: value,
  })
    .then((data) => {
      const result = data.data;
      if (result.success) {
        if (result.data) {
          callback(new Error('이미 가입된 이메일입니다.'));
        } else {
          callback();
        }
      } else {
        callback(new Error('이메일 중복 여부를 확인하지 못하였습니다.'));
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const validateExistEmail = (rule, value, callback) => {
  // 이메일 존재 여부를 확인한다.
  checkDuplicatedEmail({
    email: value,
  })
    .then((data) => {
      const result = data.data;
      if (result.success) {
        if (result.data) {
          callback();
        } else {
          callback(new Error('가입되지 않은 이메일입니다.'));
        }
      } else {
        callback(new Error('가입 여부를 확인하지 못하였습니다.'));
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};