interface InitState {
  darkMode: boolean;
  currentUser: string ;
}

const initState: InitState = {
  darkMode: false,
  currentUser: JSON.parse(localStorage.getItem('user') as string) || null
};
const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'DARK': {
      return {
        ...state,
        darkMode: action.payload
      };
    }
    case 'LIGHT': {
      return {
        ...state,
        darkMode: action.payload
      };
    }
    case 'TOGGLE': {
      return {
        ...state,
        darkMode: action.payload
      };
    }
    case 'LOGIN': {
      return {
        ...state,
        currentUser: action.payload
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        currentUser: action.payload
      };
    }
    default:
      return state;
  }
};
export default reducer;
