use anchor_lang::prelude::*;
//use anchor_lang::solana_program::program::invoke;
//use anchor_lang::solana_program::system_instruction;
//use rand::rngs::OsRng;
// use anchor_spl::token;
use anchor_spl::token::{
    MintTo, 
    Token,
    Mint,
    mint_to
};
declare_id!("2W1dtkJdDkpc2xAA1Pi7CrU7vVybvsdc3jULmFxeV8Vm");

#[program]
pub mod pstake {
    
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, admin: Pubkey) -> Result<()> {
        let ledger_account = &mut ctx.accounts.ledger_account;
        ledger_account.admin = admin;    
        Ok(())
    }
   

    pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {
        // Create the MintTo struct for our context
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to mint tokens
        mint_to(cpi_ctx, 1)?;
        Ok(())
  }

}

#[derive(Accounts)]
// pub struct Initialize {

//     #[account(mut)]
//     pub ledger_account: Account<'info, Ledger>,

//     #[account(
//         init,
//         payer = wallet,
//         space = 82,// + (4 + 32),
//         seeds = [
//             wallet.key().as_ref(),
//             b"player_seed",
//         ],
//         bump
//     )]
//     pub player_account: Account<'info, PlayerLedger>,
//     /// CHECK: This is not dangerous because we don't read or write from this account
//     #[account(mut)]
//     pub admin_account: AccountInfo<'info>,
//     #[account(mut)]
//     pub wallet: Signer<'info>,
// }

pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        space = 82,// + (4 + 32),
        seeds = [
            //wallet.key().as_ref(),
            b"new_seed",
            //color.as_ref(),
        ],
        bump
    )]
    pub ledger_account: Account<'info, Ledger>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    ///CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct MintToken<'info> {
   /// CHECK: This is the token that we want to mint
   #[account(mut)]
   pub mint: Account<'info, Mint>,
   pub token_program: Program<'info, Token>,
   /// CHECK: This is the token account that we want to mint tokens to
   #[account(mut)]
   pub token_account: AccountInfo<'info>,
   /// CHECK: the authority of the mint account
   pub authority: Signer<'info>,  
}

// #[account]
// // #[derive(Default)]
// pub struct PlayerLedger {
//     pubkey: Pubkey,
//     nfts: Vec<(String,String)>
// }

#[account]
pub struct Ledger {
    admin: Pubkey
}