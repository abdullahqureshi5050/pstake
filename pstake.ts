import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, associatedAddress, ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { Pstake } from "../target/types/pstake";

const {
  // Connection,
  //Keypair,
  //PublicKey,
  // clusterApiUrl,
  // LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
import 
 spltoken,
{
  //TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from "@solana/spl-token";
const { PublicKey, SystemProgram, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } = anchor.web3;

describe("pstake", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Pstake as Program<Pstake>;
  const payer = anchor.web3.Keypair.generate()
  const mint = anchor.web3.Keypair.generate();
  const connection = new Connection(clusterApiUrl("devnet"));

  async function derivePda(pubkey: anchor.web3.PublicKey) {
    let [pda, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        //pubkey.toBuffer(),
        Buffer.from("new_seed"),
        //Buffer.from(color),
      ],
      program.programId
    );
    return pda;
  }

  it("Is initialized!", async () => {
    const airdropTx = await connection.requestAirdrop(payer.publicKey, 0.01 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropTx);

    const pda = await derivePda(payer.publicKey);
    console.log(pda.toBase58())

    // const tx = await program.methods.initialize(payer.publicKey).accounts({
    //   ledgerAccount: pda,
    // }).rpc();

    const tx = await program.methods.initialize(payer.publicKey).accounts({
      ledgerAccount: pda,
      mint: mint.publicKey,
      payer: payer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY
     }).signers([payer, mint]).rpc();

    console.log("Your transaction signature", tx);
    //  setTimeout(async () => {
    //   console.log(`wait .....`)
      try {
        const predata = await program.account.ledger.fetch(pda);
     console.log(`data = `,predata.admin.toString());  
      } catch (error) {
        console.log(error)
      }
      try {
        let associatedTokenAccount = await getAssociatedTokenAddress(
          mint.publicKey,
          payer.publicKey,
        );

        // let associatedTokenAccount  = await associatedAddress({ mint: mint.publicKey, owner: payer.publicKey });
        console.log(`associatedTokenAccount: `, associatedTokenAccount.toString());
         await program.methods.mintToken().accounts({
          mint: mint.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenAccount: associatedTokenAccount,
          authority: payer.publicKey,
        }).signers([payer]).rpc();
        
      } catch (error) {
          console.log(`ATA or token minting issue: `,error);
      }
      
  
     
  });

  // it("token mint", async ()=> { 
  
  //   let associatedTokenAccount = await getAssociatedTokenAddress(
  //     mint.publicKey,
  //     payer.publicKey,
  //   );
  
  //   await program.methods.mintToken().accounts({
  //     mint: mint.publicKey,
  //     tokenProgram: TOKEN_PROGRAM_ID,
  //     tokenAccount: associatedTokenAccount,
  //     authority:payer.publicKey,
  //  }).signers([payer]).rpc();
     
  // })
});



    // Add your test here.
    // const tx = await program.methods.initialize(
    //   payer.publicKey
    // ).accounts({
    //   ledgerAccount: pda,
    //   mint: payer.publicKey,
    //   payer: payer.publicKey,
    //   systemProgram: SystemProgram.programId,
    //   tokenProgram: TOKEN_PROGRAM_ID,
    //   rent: anchor.web3.SYSVAR_RENT_PUBKEY
    // }).rpc();