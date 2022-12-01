import { isNil } from 'lodash';
import { required, email } from 'vee-validate/dist/rules';

export const requiredRule = {
    ...required,
    message: '필수 항목입니다.',
 };

export const emailRule = {
    ...email,
    message: '올바른 형식이 아닙니다.'
};

export const validatePassword = {
    validate: (value) => {
        const regex = new RegExp('^(?=.*[a-zA-Z0-9])(?=.*[a-zA-Z!@#$%^&*])(?=.*[0-9!@#$%^&*]).{8,20}$').test(value);
        if (!regex) {
          return false;
        }
        return true;
      },
    message: '8~20자, 숫자, 알파벳, 특수문자 중 2가지 이상 조합을 권장합니다.',
};

export const validateUsername = {
    validate: (value) => {
        const regex = new RegExp('^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$').test(value);
        if (!regex) {
          return false;
        }
        return true;
      },
    message: '2~8자, 숫자, 알파벳, 한글만 입력할 수 있습니다.',
};