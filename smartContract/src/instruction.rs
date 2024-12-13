use borsh::{BorshDeserialize, BorshSerialize};

use solana_program::program_error::ProgramError;

use crate::error::Error::InvalidInstruction;

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum Instruction {
    UpdateAutority { action: u8 },
    Initialization { amount: u64 },
    Confirm,
    Cancel,
    DisputeStart,
    DisputeEnd,
}

impl Instruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError> {
      
        let instruction = instruction_data[0];
        Ok(match instruction {
            0 =>  {
                let action = instruction_data[1];  // Directly access the byte

                Self::UpdateAutority { action }
            },
            1 => {
                let amount_bytes: [u8; 8] = instruction_data[1..9].try_into().unwrap();
                let amount = u64::from_le_bytes(amount_bytes);

                Self::Initialization { amount }
            },
            2 => Self::Confirm,
            3 => Self::Cancel,
            4 => Self::DisputeStart,
            5 => Self::DisputeEnd,
            _ => return Err(InvalidInstruction.into()),
        })
    }
}