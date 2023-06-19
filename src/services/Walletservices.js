import { toast } from "../Components/Layout/Toasts/Toast";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { chainID } from "../constants";
import { create } from "ipfs-http-client";

let walletTypeObject = "Metamask";
let web3Object;

export let provider = new WalletConnectProvider({
  rpc: {
    80001: "https://rpc-mumbai.maticvigil.com/",
  },
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ["metamask"],
    desktopLinks: ["encrypted ink"],
  },
});

const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
  headers: {
    Authorization:
      "Basic " +
      Buffer.from(
        "22GTL2haD1H7GuqNrG6mIpc9aze" + ":" + "540fe896bfd2f47c0225811b868dbb4b"
      ).toString("base64"),
  },
});
export const ipfsAdd = async (data) => {
  try {
    const address = await isMetamaskInstalled();
    if (address) {
      let hashRes = await ipfs.add(data);
      hashRes = hashRes.path;
      return hashRes;
    }
  } catch (err) {
    console.log(err);
  }
};

const isMetamaskInstalled = async () => {
  const { ethereum } = window;
  const result = Boolean(ethereum && ethereum.isMetaMask);
  walletTypeObject = "Metamask";
  if (result) {
    //metamask
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else if (provider) {
    // const account = walletConnect();
    // return account;
  } else {
    const quote =
      "Please install and initialize Metamask wallet extension first";
    toast.error(quote);
    setTimeout(() => {
      window.location.href = "https://metamask.io/";
    }, 2000);
    return false;
  }
};

const callWeb3 = async () => {
  const { ethereum, web3 } = window;
  return new Promise(async (resolve, reject) => {
    if (ethereum && ethereum.isMetaMask) {
      web3Object = new Web3(ethereum);
    } else if (ethereum) {
      web3Object = new Web3(ethereum);
    } else if (web3) {
      web3Object = new Web3(web3.currentProvider);
    } else if (provider) {
      web3Object = new Web3(provider);
      console.log(web3Object, "web3Objectweb3Object");
    } else {
      toast.error("You have to install MetaMask!");
      return;
    }
    resolve(web3Object);
  });
};

const networkSwitch = async () => {
  try {
    const Browsprovider = window.ethereum;
    // const result = isMetamaskInstalled();
    if (Browsprovider) {
      await Browsprovider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: Web3.utils.toHex(chainID),
            chainName: "Mumbai Testnet",
            rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
            blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            nativeCurrency: {
              symbol: "MATIC",
              decimals: 18,
            },
          },
        ],
      });
    }
  } catch (addError) {
    window.location.reload();
    console.log(addError);
    toast.error(addError);
    return false;
  }
};

export const Walletservices = {
  isMetamaskInstalled,
  callWeb3,
  networkSwitch,
  ipfsAdd,
};
