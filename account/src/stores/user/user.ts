import { defineStore } from "pinia";

interface user {
  identity: identity;
  address?: address;
  role?: string;
}

interface identity {
  firstName: string;
  lastName: string;
  full_name?: string;
  dob?: Date;
  country?: string;
  gender?: string;
  verified: boolean;
}

interface address {
  contry?: string;
  address_1?: string;
  address_2?: string;
  area_lvl1?: string;
  area_lvl2?: string;
  area_lvl3?: string;
  zip_code?: string;
  verified: boolean;
}

export const useUser = defineStore("user", () => {
  const role = ref<string | undefined>(undefined);
  const identity = ref<identity | undefined>(undefined);
  const address = ref<address | undefined>(undefined);

  function set(data: Partial<user>) {
    identity.value = data.identity;
    address.value = data.address;
    role.value = data.role;
  }

  function clear() {
    identity.value = undefined;
    address.value = undefined;
  }

  return {
    identity,
    address,
    role,
    set,
    clear,
  } as const;
});
