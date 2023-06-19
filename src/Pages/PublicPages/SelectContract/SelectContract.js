import axios from "axios";
import { useState } from "react";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../../Components/Button/ButtonCustom";
import DropdownInput from "../../../Components/DropdownInput/DropdownInput";
import { toast } from "../../../Components/Layout/Toasts/Toast";
import LayoutCard from "../../../Components/LayoutCard/LayoutCard";
import {
  POLYGON_MAIN_API,
  POLYGON_TEST_API,
  POLYGON_TEST_API_AUTHORIZATION,
} from "../../../constants";
import { ContractList } from "./contractList";
import "./SelectContract.scss";

export default function SelectContract() {
  const list = ContractList.map((item) => item.name);
  const contractTypeList = ["School", "College", "Hackathon"];

  const navigate = useNavigate();

  const [filtered, setFiltered] = useState(list);
  const [searchQuery, setSearchQuery] = useState("");

  const [contract, setContract] = useState();
  const [contractType, setContractType] = useState("School");

  const [network, setNetwork] = useState("testnet");

  const [contractAddr, setContractAddr] = useState();

  const handleNetwork = (e) => {
    setNetwork(e.target.value.toLowerCase());
  };

  const handleSelectContract = async (e) => {
    const query = e.target.value.toLowerCase();

    setContract(query);

    if (query == "") {
      setFiltered([]);
      return;
    }

    const requiredList = ContractList.filter(
      (data) => data.type === contractType
    );
    const filtered = requiredList.filter((data) =>
      data.name.toLowerCase().includes(query)
    );
    setFiltered(filtered);
  };

  const handleSelect = (data) => {
    setContract(data.name);
    setContractAddr(data.address);
    setSearchQuery(data.name);

    setFiltered([]);
  };

  return (
    <LayoutCard title="Select Contract">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50%" }}>
          <DropdownInput
            id="selectContractType"
            className="classSelectContractType"
            title="Select Contract Type"
            list={contractTypeList}
            onChange={(e) => setContractType(e.target.value)}
          />
        </div>
      </div>

      <div style={{ height: "20px" }} />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50%" }}>
          <input
            id="selectContract"
            className="classSelectContract"
            value={contract}
            onChange={handleSelectContract}
          />

          <div className="dropdownDataContainer">
            <ul>
              {filtered.map((data) => (
                <li key={data.name} onClick={() => handleSelect(data)}>
                  {data.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ height: "20px" }} />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50%" }}>
          <DropdownInput
            id="selectNetworkType"
            className="classSelectNetworkType"
            title="Select Network"
            list={["testnet", "mainnet"]}
            onChange={handleNetwork}
          />
        </div>
      </div>

      <div style={{ height: "20px" }} />

      <div className="selectContractButton">
        <ButtonCustom
          title="Proceed"
          onClick={async () => {
            const url =
              network === "testnet" ? POLYGON_TEST_API : POLYGON_MAIN_API;
            const res = await axios.get(`${url}`, {
              params: {
                module: "contract",
                action: "getabi",
                address: contractAddr,
                apikey: POLYGON_TEST_API_AUTHORIZATION,
              },
            });

            console.log("res", res);

            if (res.data.status === "0") {
              toast.error(
                `The selected Contract is not a valid contract on the ${network.toUpperCase()}`
              );
              return;
            }

            let abi = await JSON.parse(res.data.result);
            console.log("abi", abi);
            navigate("/mint", {
              state: {
                name: contract,
                address: contractAddr,
                fieldCount: ContractList.find((item) => item.name === contract)
                  .fieldCount,
                network: network,
                abi: abi,
              },
            });
          }}
        >
          Proceed
        </ButtonCustom>
      </div>
    </LayoutCard>
  );
}
