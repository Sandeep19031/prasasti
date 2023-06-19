export const mint = async (toAddr, sbtParams, tokenUri, contract, eoa) => {
  try {
    const res = await contract.methods.mint(toAddr, sbtParams, tokenUri).send({
      from: eoa,
    });

    console.log("res mint: ", res);

    return res;
  } catch (err) {
    console.log("Error in minting SBT", err);
    return false;
  }
};

export default {
  mint,
};
