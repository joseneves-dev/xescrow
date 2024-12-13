use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    program::{invoke, invoke_signed},
    msg
};

use crate::{ 
    instruction::Instruction, 
    error::Error,
    state::{EscrowState, EscrowAutoritys},
 };

pub struct Processor;

const ESCROW_AUTHORITY_ACCOUNT_PUBKEY: Pubkey = Pubkey::new_from_array([
    28,  56, 186, 233, 241,  57, 114, 171,
    68, 208,  14,  60,   1,  28, 114, 174,
   182, 101, 227, 208, 193,  25,  39, 240,
   124, 121, 232, 231,  47, 215,  62,  19
 ]);  // Replace with actual Pubkey

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {

        let instruction = Instruction::unpack(instruction_data)?;

        match instruction {
            Instruction::UpdateAutority { action} => {
                msg!("Instruction: Update Autority");
                Self::process_update_autority(action, accounts, program_id)
            }
            Instruction::Initialization { amount} => {
                msg!("Instruction: Initialization");
                Self::process_initialization(amount, accounts, program_id)
            }
            Instruction::Confirm => {
                msg!("Instruction: Confirm");
                Self::process_confirm(accounts, program_id)
            }
            Instruction::DisputeStart => {
                msg!("Instruction: Dispute");
                Self::process_dispute_start(accounts, program_id)
            }
            Instruction::DisputeEnd => {
                msg!("Instruction: DisputeEnd");
                Self::process_dispute_end(accounts, program_id)
            }
            Instruction::Cancel => {
                msg!("Instruction: Cancel");
                Self::process_cancel(accounts, program_id)
            }
        }
    }

    fn process_update_autority(
        action: u8,
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let escrow_authority_account = next_account_info(account_info_iter)?;

        let request_account: &Pubkey = next_account_info(account_info_iter)?.key;

        let publickey: &Pubkey = next_account_info(account_info_iter)?.key;

        const UPDATE_AUTHORITY_PUBKEY: Pubkey = Pubkey::new_from_array([
            35, 106, 170, 185,   4, 219, 146, 113,
           188, 176,  23, 234, 225, 110,   9, 107,
           182,  84, 130, 130,  11, 211, 137, 149,
            76, 162,  83,  79,  66,  68,  59,  66
         ]
         );  // Replace with actual Pubkey

         if *request_account != UPDATE_AUTHORITY_PUBKEY {
            return Err(Error::AutorityNotAllowed.into());
        }

        if *escrow_authority_account.key != ESCROW_AUTHORITY_ACCOUNT_PUBKEY {
            return Err(Error::InvalidAccount.into());
        }

        // Deserialize the current state of the account
        let mut escrow_authoritys = EscrowAutoritys::unpack_unchecked(&escrow_authority_account.try_borrow_data()?)?;

        match action {
            1 => {
                if !escrow_authoritys.autority.contains(publickey) {
                    escrow_authoritys.autority.push(*publickey);
                } else {
                    return Err(Error::NotFoundAutority.into());
                    
                }
            }
            0 => {
                if let Some(pos) = escrow_authoritys.autority.iter().position(|x| x == publickey) {
                    escrow_authoritys.autority.remove(pos);
                } else {
                    return Err(Error::NotFoundAutority.into());
                }
            }
            _ => {
                return Err(ProgramError::InvalidInstructionData);
            }
        }

        // After modifying the list, re-pack the data and write it back to the account
        EscrowAutoritys::pack(escrow_authoritys, &mut escrow_authority_account.try_borrow_mut_data()?)?;

        Ok(())
    }

    fn process_initialization(
        amount: u64,
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();

        let from = next_account_info(accounts_iter)?;
        let from_account = next_account_info(accounts_iter)?;
        
        let to = next_account_info(accounts_iter)?;
        let to_account = next_account_info(accounts_iter)?;
        
        let escrow_authority_account = next_account_info(accounts_iter)?;
        let escrow_autority = next_account_info(accounts_iter)?;
        let escrow_data: &AccountInfo<'_> = next_account_info(accounts_iter)?;
        let escrow_account = next_account_info(accounts_iter)?;

        let token_program_id = next_account_info(accounts_iter)?;
        let token_program_mint = next_account_info(accounts_iter)?;

        if !escrow_autority.is_signer {
            return Err(Error::InvalidAutority.into());
        }

        if *escrow_authority_account.key != ESCROW_AUTHORITY_ACCOUNT_PUBKEY {
            return Err(Error::InvalidAccount.into());
        }

        let escrow_authoritys = EscrowAutoritys::unpack_unchecked(&escrow_authority_account.try_borrow_data()?)?;

        if !escrow_authoritys.autority.contains(&escrow_autority.key) {
            return Err(Error::InvalidAutority.into());
        }

        let find_from_account = spl_associated_token_account::get_associated_token_address_with_program_id(from.key, token_program_mint.key, token_program_id.key);
        
        if !from.is_signer && find_from_account != *from_account.key{
            return Err(Error::InvalidAccount.into());
        }

        let find_to_account = spl_associated_token_account::get_associated_token_address_with_program_id(to.key,token_program_mint.key, token_program_id.key);

        if find_to_account != *to_account.key{
            return Err(Error::InvalidAccount.into());
        }
        
        let mut escrow_state = EscrowState::unpack_unchecked(&escrow_data.try_borrow_data()?)?;

        if escrow_state.is_initialized() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        escrow_state.initialize = true;
        escrow_state.confirm = false;
        escrow_state.dispute = false;
        escrow_state.cancel = false;
        
        escrow_state.from = *from.key;
        escrow_state.from_account = *from_account.key;
        escrow_state.to = *to.key;
        escrow_state.to_account = *to_account.key;

        escrow_state.escrow_authority_account = *escrow_authority_account.key;
        escrow_state.escrow_autority = *escrow_autority.key;
        escrow_state.escrow_data = *escrow_data.key;
        escrow_state.escrow_account = *escrow_account.key;
        
        escrow_state.token_program_id = *token_program_id.key; 
        escrow_state.token_program_mint = *token_program_mint.key; 

        escrow_state.amount = amount;

        EscrowState::pack(escrow_state, &mut escrow_data.try_borrow_mut_data()?)?;

        let transfer_ix = spl_token_2022::instruction::transfer_checked(
            token_program_id.key,
            from_account.key,
            token_program_mint.key,
            escrow_account.key,
            &from.key,
            &[&from.key],
           amount,
           9
        )?;

        invoke(
            &transfer_ix,
            &[
                escrow_account.clone(),
                from_account.clone(),
                from.clone(),
                token_program_id.clone(),
                token_program_mint.clone(),
            ],
        )?;

        Ok(())
    }

    fn process_confirm(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        
        let request_account = next_account_info(accounts_iter)?;

        let escrow_data = next_account_info(accounts_iter)?;
        let escrow_account = next_account_info(accounts_iter)?;

        let to_account = next_account_info(accounts_iter)?;

        let program_pda = next_account_info(accounts_iter)?;

        let token_program_id = next_account_info(accounts_iter)?;
        let token_program_mint = next_account_info(accounts_iter)?;

        let mut escrow_state = EscrowState::unpack(&escrow_data.try_borrow_data()?)?;

        let (pda, bump_seed) = Pubkey::find_program_address(&[b"escrow", &escrow_data.key.as_ref()], program_id);

        if escrow_state.dispute {
            return Err(Error::DisputeProgress.into());
        }

        if !request_account.is_signer || request_account.key != &escrow_state.from {
            return Err(Error::InvalidAccount.into());
        }

        let transfer_ix = spl_token_2022::instruction::transfer_checked(
            &escrow_state.token_program_id,
            &escrow_state.escrow_account,
            &escrow_state.token_program_mint,
            &escrow_state.to_account,
            &pda,
            &[&pda],
            escrow_state.amount,
            9
        )?;

        invoke_signed(
            &transfer_ix,
            &[
                escrow_account.clone(),
                to_account.clone(),
                program_pda.clone(),
                token_program_id.clone(),
                token_program_mint.clone()
            ],
            &[&[&b"escrow"[..], &escrow_data.key.as_ref()[..], &[bump_seed]]],
        )?;

        escrow_state.initialize = false;
        escrow_state.confirm = true;
            
        EscrowState::pack(escrow_state, &mut escrow_data.try_borrow_mut_data()?)?;

        Ok(())
    }

    fn process_cancel(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
    ) -> ProgramResult {

        let accounts_iter = &mut accounts.iter();
        
        let request_account = next_account_info(accounts_iter)?;

        let escrow_data = next_account_info(accounts_iter)?;
        let escrow_account = next_account_info(accounts_iter)?;

        let from_account = next_account_info(accounts_iter)?;

        let program_pda = next_account_info(accounts_iter)?;

        let token_program_id = next_account_info(accounts_iter)?;
        let token_program_mint = next_account_info(accounts_iter)?;

        let mut escrow_state = EscrowState::unpack(&escrow_data.try_borrow_data()?)?;

        let (pda, bump_seed) = Pubkey::find_program_address(&[b"escrow", &escrow_data.key.as_ref()], program_id);
        
        if escrow_state.dispute {
            return Err(Error::DisputeProgress.into());
        }

        if !request_account.is_signer || request_account.key != &escrow_state.to {
            return Err(Error::InvalidAccount.into());
        }
        
        let transfer_ix = spl_token_2022::instruction::transfer_checked(
            &escrow_state.token_program_id,
            &escrow_state.escrow_account,
            &escrow_state.token_program_mint,
            &escrow_state.from_account,
            &pda,
            &[&pda],
            escrow_state.amount,
            9
        )?;
        
        invoke_signed(
            &transfer_ix,
            &[
                escrow_account.clone(),
                from_account.clone(),
                program_pda.clone(),
                token_program_id.clone(),
                token_program_mint.clone(),
            ],
            &[&[&b"escrow"[..], &escrow_data.key.as_ref()[..], &[bump_seed]]],
        )?;
           
        escrow_state.initialize = false;
        escrow_state.cancel = true;
           
        EscrowState::pack(escrow_state, &mut escrow_data.try_borrow_mut_data()?)?;


        Ok(())
    }

    fn process_dispute_start(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {

        let accounts_iter = &mut accounts.iter();
        
        let request_account = next_account_info(accounts_iter)?;
        let escrow_data = next_account_info(accounts_iter)?;
    
        let mut escrow_state = EscrowState::unpack(&escrow_data.try_borrow_data()?)?;

        if escrow_state.confirm || escrow_state.cancel {
            return Err(Error::TransactionConclued.into());
        }

        if !request_account.is_signer && (request_account.key != &escrow_state.to || request_account.key != &escrow_state.from) {
            return Err(Error::InvalidAccount.into());
        }

        escrow_state.initialize = true;
        escrow_state.dispute = true;
            
        EscrowState::pack(escrow_state, &mut escrow_data.try_borrow_mut_data()?)?;

        Ok(())
    }

    fn process_dispute_end(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
    ) -> ProgramResult {

        let accounts_iter = &mut accounts.iter();
        
        let request_account = next_account_info(accounts_iter)?;
        let escrow_data = next_account_info(accounts_iter)?;
        let escrow_account = next_account_info(accounts_iter)?;
        let to_account = next_account_info(accounts_iter)?;
        let program_pda = next_account_info(accounts_iter)?;
        let token_program_id = next_account_info(accounts_iter)?;
        let token_program_mint = next_account_info(accounts_iter)?;

        let mut escrow_state = EscrowState::unpack(&escrow_data.try_borrow_data()?)?;

        if !request_account.is_signer || request_account.key != &escrow_state.escrow_autority {
            return Err(Error::InvalidAccount.into());
        }
        let (pda, bump_seed) = Pubkey::find_program_address(&[b"escrow", &escrow_data.key.as_ref()], program_id);
        let transfer_ix = spl_token_2022::instruction::transfer_checked(
            &escrow_state.token_program_id,
            &escrow_state.escrow_account,
            &escrow_state.token_program_mint,
            &to_account.key,
            &pda,
            &[&pda],
            escrow_state.amount,
            9
        )?;

        invoke_signed(
            &transfer_ix,
            &[
                escrow_account.clone(),
                to_account.clone(),
                program_pda.clone(),
                token_program_id.clone(),
                token_program_mint.clone()
            ],
            &[&[&b"escrow"[..], &escrow_data.key.as_ref()[..], &[bump_seed]]],
        )?;

        escrow_state.confirm = true;
            
        EscrowState::pack(escrow_state, &mut escrow_data.try_borrow_mut_data()?)?;
    
        Ok(())
    }
}