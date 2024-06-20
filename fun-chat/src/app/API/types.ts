export type AuthRequest = {
  id: string | null;
  type: 'USER_LOGIN';
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export type LogoutRequest = {
  id: string;
  type: 'USER_LOGOUT';
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export type GetAuth = {
  id: string;
  type: 'USER_ACTIVE';
  payload: null;
};

export type GetUnauth = {
  id: string;
  type: 'USER_INACTIVE';
  payload: null;
};

export type GetMsg = {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    user: {
      login: string;
    };
  };
};

export type SendMsg = {
  id: string;
  type: 'MSG_SEND';
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
};

export type SetMsgRead = {
  id: string;
  type: 'MSG_READ';
  payload: {
    message: {
      id: string;
    };
  };
};

export type SetMsgEdit = {
  id: string;
  type: 'MSG_EDIT';
  payload: {
    message: {
      id: string;
      text: string;
    };
  };
};

export type DeleteMsg = {
  id: string;
  type: 'MSG_DELETE';
  payload: {
    message: {
      id: string;
    };
  };
};
