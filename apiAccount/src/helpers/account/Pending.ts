import { get as getEmail } from "./user/EmailAddress";
import { get as getPhone } from "./user/PhoneNumber";
import { get as getUser } from "./user/User";

export async function verification(userId: string) {
  interface Identification {
    identity: boolean | undefined;
    residence: boolean | undefined;
  }

  interface Pending {
    emailAddress: boolean | undefined;
    phoneNumber: boolean | undefined;
    identification: Identification;
  }

  let pending: Pending = {
    emailAddress: undefined,
    phoneNumber: undefined,
    identification: {
      identity: undefined,
      residence: undefined,
    },
  };

  const { emailAddress } = await getEmail(userId);

  if (emailAddress && emailAddress.verified == false) {
    pending.emailAddress = true;
  }

  const { phoneNumber } = await getPhone(userId);

  if (phoneNumber && phoneNumber.verified == false) {
    pending.phoneNumber = true;
  }

  const getUserData = await getUser(userId);

  if (getUserData.pending?.identity || getUserData.pending?.residence) {
    if (getUserData.pending?.identity) {
      pending.identification.identity = getUserData.pending.identity
        ? true
        : false;
    }

    if (getUserData.pending?.residence) {
      pending.identification.residence = getUserData.pending.residence
        ? true
        : false;
    }
  } else {
    pending.identification = undefined;
  }

  const verification = Object.keys(pending).length ? pending : undefined;
  return {
    ...verification,
  };
}
