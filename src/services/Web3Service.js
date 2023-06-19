import Web3 from "web3";
import { POLYGON_ALCHEMY } from "../constants";

class Web3Service {
  providerUrl = POLYGON_ALCHEMY;
  web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  contract = {};

  constructor() {
    this.initContract();
  }

  initContract() {
    try {
    } catch (error) {
      throw error;
    }
  }
}

export default new Web3Service();
