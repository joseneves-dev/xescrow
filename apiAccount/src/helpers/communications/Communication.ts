import { User } from "../../database/models/account/User";

import { checkContact } from "../AppSettings";

interface methods {
  app?: {
    available: boolean;
  };
  emailAddress?: {
    available: boolean;
    email?: string;
  };
  phoneNumber?: {
    available: boolean;
    code?: string;
    number?: string;
  };
}

interface method {
  type?: "emailAddress" | "phoneNumber" | "app";
  email?: string;
  phoneNumber?: {
    code: string;
    number: string;
  };
  nextRequest?: number;
}

export async function availableMethods(userId: string) {
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: [
      {
        association: "emailAddress",
        where: {
          active: true,
        },
      },
      {
        association: "phoneNumber",
        where: {
          active: true,
        },
        include: {
          association: "country",
        },
        required: false,
      },
      {
        association: "app",
        where: {
          active: true,
        },
        required: false,
      },
    ],
  });

  let methods: methods = {};

  if (await checkContact("app")) {
    methods.app = { available: user.app && user.app.verified ? true : false };
  } else {
    methods.app = { available: false };
  }

  if (await checkContact("emailAddress")) {
    methods.emailAddress = {
      available: user.emailAddress && user.emailAddress.verified ? true : false,
      email: user.emailAddress.email,
    };
  } else {
    methods.emailAddress = {
      available: false,
    };
  }

  if (await checkContact("phoneNumber")) {
    methods.phoneNumber = {
      available: user.phoneNumber && user.phoneNumber.verified ? true : false,
      code: user.phoneNumber.country.code,
      number: user.phoneNumber.number,
    };
  } else {
    methods.phoneNumber = {
      available: false,
    };
  }

  return { methods };
}

export async function requestMethod(
  requestedMethod: "emailAddress" | "phoneNumber" | "app" | null,
  userId: string
) {
  const { methods } = await availableMethods(userId);

  let method: method = {};

  if (
    (requestedMethod === "app" || requestedMethod == null) &&
    methods.app.available
  ) {
    method = {
      type: "app",
      nextRequest: 10,
    };
  } else if (
    (requestedMethod === "emailAddress" || requestedMethod == null) &&
    methods.emailAddress.available
  ) {
    method = {
      email: methods.emailAddress.email,
      type: "emailAddress",
      nextRequest: 30,
    };
  } else if (
    (requestedMethod === "phoneNumber" || requestedMethod == null) &&
    methods.phoneNumber.available
  ) {
    method = {
      phoneNumber: {
        code: methods.phoneNumber.code,
        number: methods.phoneNumber.number,
      },
      type: "phoneNumber",
      nextRequest: 30,
    };
  }

  return { method };
}
