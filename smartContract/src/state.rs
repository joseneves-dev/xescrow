use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

#[derive(Debug)]
pub struct EscrowState {
    pub initialize: bool,
    pub confirm: bool,
    pub dispute: bool,
    pub cancel: bool,
    pub from: Pubkey,
    pub from_account: Pubkey,
    pub to: Pubkey,
    pub to_account: Pubkey,
    pub escrow_authority_account: Pubkey,
    pub escrow_autority: Pubkey,
    pub escrow_data: Pubkey,
    pub escrow_account: Pubkey,
    pub token_program_id: Pubkey,
    pub token_program_mint: Pubkey,
    pub amount: u64,
}

pub struct EscrowAutoritys {
    pub autority: Vec<Pubkey>,
}

impl Sealed for EscrowState {}

impl Sealed for EscrowAutoritys {}  

impl EscrowAutoritys {
    const MAX_AUTORITIES: usize = 100;  // Max 100 public keys
    const LEN: usize = 4 + 32 * Self::MAX_AUTORITIES;  // 4 bytes for length + 32 bytes per Pubkey
}

impl IsInitialized for EscrowState {
    fn is_initialized(&self) -> bool {
        self.initialize
    }
}

impl Pack for EscrowState {
    const LEN: usize = 332;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, EscrowState::LEN];
        let (
            initialize,
            confirm,
            dispute,
            cancel,
            from,
            from_account,
            to,
            to_account,
            escrow_authority_account,
            escrow_autority,
            escrow_data,
            escrow_account,
            token_program_id,
            token_program_mint,
            amount,
        ) = array_refs![src, 1,1,1,1,32,32,32,32,32,32,32,32,32, 32, 8];
        let initialize = match initialize {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        let confirm = match confirm {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        let dispute = match dispute {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        let cancel = match cancel {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        Ok(EscrowState {
            initialize,
            confirm,
            dispute,
            cancel,
            from: Pubkey::new_from_array(*from),
            from_account: Pubkey::new_from_array(*from_account),
            to: Pubkey::new_from_array(*to),
            to_account: Pubkey::new_from_array(*to_account),
            escrow_authority_account: Pubkey::new_from_array(*escrow_authority_account),
            escrow_autority: Pubkey::new_from_array(*escrow_autority),
            escrow_data: Pubkey::new_from_array(*escrow_data),
            escrow_account: Pubkey::new_from_array(*escrow_account),
            token_program_id: Pubkey::new_from_array(*token_program_id),
            token_program_mint: Pubkey::new_from_array(*token_program_mint),
            amount:  u64::from_le_bytes(*amount),
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, EscrowState::LEN];
        let (
            initialize_dst,
            confirm_dst,
            dispute_dst,
            cancel_dst,
            from_dst,
            from_ata_dst,
            to_dst,
            to_ata_dst,
            escrow_authority_account_dst,
            escrow_autority_dst,
            escrow_data_dst,
            escrow_account_dst,
            token_program_id_dst,
            token_program_mint_dst,
            amount_dst,
        ) = mut_array_refs![dst, 1,1,1,1,32,32,32,32,32,32,32,32,32,32, 8];

        let EscrowState {
            initialize,
            confirm,
            dispute,
            cancel,
            from,
            from_account,
            to,
            to_account,
            escrow_authority_account,
            escrow_autority,
            escrow_data,
            escrow_account,
            token_program_id,
            token_program_mint,
            amount,
        } = self;

        initialize_dst[0] = *initialize as u8;
        confirm_dst[0] = *confirm as u8;
        dispute_dst[0] = *dispute as u8;
        cancel_dst[0] = *cancel as u8;
        from_dst.copy_from_slice(from.as_ref());
        from_ata_dst.copy_from_slice(from_account.as_ref());
        to_dst.copy_from_slice(to.as_ref());
        to_ata_dst.copy_from_slice(to_account.as_ref());
        escrow_authority_account_dst.copy_from_slice(escrow_authority_account.as_ref());
        escrow_autority_dst.copy_from_slice(escrow_autority.as_ref());
        escrow_data_dst.copy_from_slice(escrow_data.as_ref());
        escrow_account_dst.copy_from_slice(escrow_account.as_ref());
        token_program_id_dst.copy_from_slice(token_program_id.as_ref());
        token_program_mint_dst.copy_from_slice(token_program_mint.as_ref());
        *amount_dst = amount.to_le_bytes();   
     
    }
}


impl Pack for EscrowAutoritys {
    const LEN: usize = EscrowAutoritys::LEN;  // Add this line

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, EscrowAutoritys::LEN];
        let (len_bytes, pubkeys_bytes) = array_refs![src, 4, EscrowAutoritys::LEN - 4];

        let len = u32::from_le_bytes(*len_bytes) as usize;
        if len > EscrowAutoritys::MAX_AUTORITIES {
            return Err(ProgramError::InvalidAccountData);
        }

        let mut autority = Vec::with_capacity(len);
        for i in 0..len {
            let pubkey = Pubkey::new_from_array(*array_ref![pubkeys_bytes, i * 32, 32]);
            autority.push(pubkey);
        }

        Ok(EscrowAutoritys { autority })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, EscrowAutoritys::LEN];
        let (len_bytes, pubkeys_bytes) = mut_array_refs![dst, 4, EscrowAutoritys::LEN - 4];

        let len = self.autority.len() as u32;
        *len_bytes = len.to_le_bytes();

        for (i, pubkey) in self.autority.iter().enumerate() {
            let start = i * 32;
            pubkeys_bytes[start..start + 32].copy_from_slice(pubkey.as_ref());
        }
    }
}