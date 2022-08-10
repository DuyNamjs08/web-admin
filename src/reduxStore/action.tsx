
export const Dark = (data: boolean) => {
  return {
    type: 'DARK',
    payload: data
  };
};
export const Light = (data: boolean) => {
  return {
    type: 'LIGHT',
    payload: data
  };
};
export const Toggle = (data: boolean) => {
  return {
    type: 'TOGGLE',
    payload: data
  };
};
export const Loginauth = (data:any) => {
  return {
    type: 'LOGIN',
    payload: data
  };
};
export const LogOutauth = (data:any) => {
  return {
    type: 'LOGOUT',
    payload: data
  };
};
