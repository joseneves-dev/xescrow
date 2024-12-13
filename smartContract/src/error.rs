use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum Error {
    /// Invalid instruction
    #[error("instruction_invalid")]
    InvalidInstruction,
    /// Account
    #[error("account_invalid")]
    InvalidAccount,
    #[error("account_not_initialized")]
    AccountNotInitialized,
    /// Autority
    #[error("autority_invalid")]
    InvalidAutority,
    #[error("autority_not_found")]
    NotFoundAutority,
    #[error("autority_notAllowed")]
    AutorityNotAllowed,
    /// Status
    #[error("transaction_concluded")]
    TransactionConclued,
    #[error("dispute_inProgress")]
    DisputeProgress,
}

impl From<Error> for ProgramError {
    fn from(e: Error) -> Self {
        ProgramError::Custom(e as u32)
    }
}