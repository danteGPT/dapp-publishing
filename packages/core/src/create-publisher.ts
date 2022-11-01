import { mintNft } from "./utils";
import type { Context } from "./types";
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
  TransactionBuilder,
} from "@metaplex-foundation/js";
import debugModule from "debug";
import { Signer, Transaction } from "@solana/web3.js";

const debug = debugModule("PUBLISHER");

type CreatePublisherInput = { mintAddress: Signer };

export const createPublisher = async (
  { mintAddress }: CreatePublisherInput,
  { connection, publisher }: Context
): Promise<TransactionBuilder> => {
  debug(`Minting publisher NFT`);

  // This is a little leaky
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(publisher))
    .use(
      connection.rpcEndpoint.includes("devnet")
        ? bundlrStorage({
            address: "https://devnet.bundlr.network",
          })
        : bundlrStorage()
    );

  const txBuilder = await mintNft(
    metaplex,
    // TODO(jon): Add more interesting stuff here
    { name: "My first great publisher!" },
    {
      isCollection: true,
      isMutable: true,
      useNewMint: mintAddress,
    }
  );

  return txBuilder;
};