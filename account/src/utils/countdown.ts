import { createCountdownWorker } from "/@src/workers/countdown";
import { useCookies } from "@vueuse/integrations/useCookies";

import { useEmailAddress } from "/@userStores/emailAddress";
import { usePhoneNumber } from "/@userStores/phoneNumber";
import { useSecondFactor } from "/@userStores/secondFactor";
import { useSession } from "/@userStores/session";

export let emailAddressVerificationWorker: Worker;
export let phoneNumberVerificationWorker: Worker;
export let phoneNumberRemoveWorker: Worker;
export let secondFactorExpiresWorker: Worker;
export let secondFactorNextRequestWorker: Worker;
export let sessionExpiresWorker: Worker;

const { get } = useCookies();

export function emailAddressVerification() {
  const emailAddress = useEmailAddress();
  const date = get("emailAddressNextRequest");

  if (emailAddressVerificationWorker) {
    emailAddressVerificationWorker.terminate();
  }

  emailAddressVerificationWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      emailAddress.updateNextRequest(value);
    },
    () => {
      emailAddress.updateNextRequest(0);
    },
  );
}

export function phoneNumberVerification() {
  const phoneNumber = usePhoneNumber();
  const date = get("phoneNumberNextRequest");

  if (phoneNumberVerificationWorker) {
    phoneNumberVerificationWorker.terminate();
  }

  phoneNumberVerificationWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      phoneNumber.updateNextRequest(value);
    },
    () => {
      phoneNumber.updateNextRequest(0);
    },
  );
}

export function phoneNumberRemove() {
  const phoneNumber = usePhoneNumber();
  const date = get("phoneNumberNextRequest");

  if (phoneNumberRemoveWorker) {
    phoneNumberRemoveWorker.terminate();
  }

  phoneNumberRemoveWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      phoneNumber.updateNextRequest(value);
    },
    () => {
      phoneNumber.updateNextRequest(0);
    },
  );
}

export function secondFactorExpires() {
  const secondFactor = useSecondFactor();
  const date = get("secondFactorExpires");

  if (secondFactorExpiresWorker) {
    secondFactorExpiresWorker.terminate();
  }

  secondFactorExpiresWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      secondFactor.updateExpires(value);
    },
    () => {
      secondFactor.updateExpires(0);
    },
  );
}

export function secondFactorNextRequest() {
  const secondFactor = useSecondFactor();
  const date = get("secondFactorNextRequest");

  if (secondFactorNextRequestWorker) {
    secondFactorNextRequestWorker.terminate();
  }

  secondFactorNextRequestWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      secondFactor.updateNextRequest(value);
    },
    () => {
      secondFactor.updateNextRequest(0);
    },
  );
}

export function sessionExpires() {
  const session = useSession();
  const date = get("sessionExpires");

  if (sessionExpiresWorker) {
    sessionExpiresWorker.terminate();
  }

  sessionExpiresWorker = createCountdownWorker(
    new Date(date),
    (value) => {
      session.updateExpires(value);
    },
    () => {
      session.updateExpires(0);
    },
  );
}
