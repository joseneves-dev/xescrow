// @ts-ignore
import * as BufferLayout from "buffer-layout";

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("Initialize"),
  BufferLayout.u8("Confirm"),
  BufferLayout.u8("Dispute"),
  BufferLayout.u8("Cancel"),
  publicKey("FromPubkey"),
  publicKey("FromAccountPubkey"),
  publicKey("ToPubkey"),
  publicKey("ToAccountPubkey"),
  publicKey("AccountAutorityPubkey"),
  publicKey("AutorityPubkey"),
  publicKey("DataPubkey"),
  publicKey("AccountPubkey"),
  publicKey("TokenProgramId"),
  publicKey("TokenProgramMint"),
  uint64("Amount"),
]);
