import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Pstake } from "../target/types/pstake";

describe("pstake", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Pstake as Program<Pstake>;
  const payer = anchor.web3.Keypair.generate()
  const mint = anchor.web3.Keypair.generate();
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize(
      payer.publicKey
    ).accounts({
      
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
