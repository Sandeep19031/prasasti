import React, { useState } from "react";
import LayoutCard from "../../../Components/LayoutCard/LayoutCard";
import DisplayExcel from "../../../Excel/DisplayExcel";
import ButtonCustom from "../../../Components/Button/ButtonCustom";
import { Col, Row } from "react-bootstrap";
import ExcelImportTool from "../../../Excel/ExcelImportTool";
import { Walletservices } from "../../../services/Walletservices";
import ContractServices from "../../../services/ContractServices";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "../../../Components/Layout/Toasts/Toast";
import Loader from "../../../Components/LoaderComponent/Loader";

import { useSelector } from "react-redux";
import Web3Service from "../../../services/Web3Service";

export default function AdminPage() {
  const location = useLocation();
  const contractAddr = location.state.address;
  const fieldCount = Number(location.state.fieldCount);
  const network = location.state.network;
  const abi = location.state.abi;
  const name = location.state.name;

  const [contract, setContract] = useState();

  const eoa = useSelector((state) => state.address.address);
  console.log("eoa", eoa);

  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    const init = async () => {
      const contract = await new Web3Service.web3.eth.Contract(
        abi,
        contractAddr
      );
      console.log("contract", contract);
      setContract(contract);
    };
    init();
  }, []);
  console.log("contractAddr", contractAddr);
  console.log("fieldCount", fieldCount);

  const [sheetData, setSheetData] = useState();
  const [sheet, setSheet] = useState();

  const [newSheetData, setNewSheetData] = useState();
  const [newSheetName, setNewSheetName] = useState("Sheet1");

  const [state, setState] = useState({
    newSheetData: null,
    newSheetArrData: null,
    txHashArrData: null,
    minted: false,
    newSheetCompleted: false,
  });

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleFileUploaded = (e) => {
    console.log("File is uploaded", e);
    if (e != null) {
      setSheet(Object.keys(e)[0]);
    }
    setSheetData(e);
  };

  const newSheetDataMakingFnc = async (txHashArrData) => {
    console.log("New sheet is in progress...", txHashArrData);
    var headerRow = sheetData[sheet][0].concat(["TX Hash"]);
    console.log("header row", headerRow);
    var arrData = [headerRow];
    for (var i = 1; i < sheetData[sheet].length; i++) {
      var row = await sheetData[sheet][i].concat([txHashArrData[`row${i}`]]);
      arrData.push(row);
      console.log("arrData", arrData);
    }
    let newSheetData = {};
    newSheetData[newSheetName] = arrData;
    setState({
      newSheetArrData: arrData,
      newSheetData: newSheetData,
      newSheetCompleted: true,
    });
  };
  const handleExport = async (e) => {
    console.log("Export clicked...", sheetData[sheet]);
    console.log(
      "new sheet is ready?",
      state.newSheetCompleted,
      state.newSheetArrData
    );
    var wb = XLSX.utils.book_new();

    if (state.newSheetArrData) {
      console.log("New sheet is ready...", state.newSheetArrData);
      var ws = XLSX.utils.aoa_to_sheet(state.newSheetArrData);

      XLSX.utils.book_append_sheet(wb, ws, newSheetName);
      await XLSX.writeFile(wb, "Result.xlsx");
    }
  };
  const creteUriData = (header, data) => {
    let uriData = {};
    for (var i = fieldCount; i < data.length; i++) {
      uriData[`${header[i]}`] = data[i];
    }

    console.log("uriData", uriData);

    let udata = JSON.stringify([uriData]);
    return udata;
  };

  const handleMint = async () => {
    console.log("Mint", sheetData[sheet]);

    const header = sheetData[sheet][0];
    console.log("header", header);

    const data = sheetData[sheet].slice(1).map((row) => {
      return row;
    });
    console.log("data", data);

    //Start loop
    let txHashArrData = {};

    // loading
    setLoader(true);

    console.log("Data length: ", data.length);
    for (var i = 0; i < data.length; i++) {
      // 1. create uri data
      const row = data[i];
      const udata = creteUriData(header, row);
      // 2. uplod uri data and get uriHash
      console.log("trying to upload data to ipfs server");

      const uriHash = await Walletservices.ipfsAdd(udata);
      console.log("Successfully uploaded", uriHash);

      // 3. make sbt object

      let sbtParams = [];

      for (let i = 0; i < fieldCount; i++) {
        sbtParams.push(row[i]);
      }

      sbtParams.push(Number(0));

      console.log("Sbt Params", sbtParams);

      const walletIndex = header.indexOf("walletaddress");

      console.log("walletIndex", walletIndex);

      const walletAddress = row[walletIndex];

      // 4. send this to contracts

      console.log("Sbt Params", sbtParams);

      const res = await ContractServices.mint(
        walletAddress, // Wallet Address
        sbtParams,
        uriHash,
        contract,
        eoa
      );

      console.log("Res of Mint fnc", res);
      if (res === false) {
        setLoader(false);
        toast.error(`Error at  Row number: ${i + 1}, Name: ${row[i]}.`);
        txHashArrData[`row${i + 1}`] = "0x00000000000";
      }
      if (res?.status) {
        // saveTxHash to the server
        const txHash = res.transactionHash;
        //const saveHashRes = await saveTXHash(row[12], txHash);
        setLoader(false);
        toast.success(`Successfully minted SBT for row number ${i + 1}.`);

        txHashArrData[`row${i + 1}`] = res.transactionHash;
      }

      setState({ txHashArrData: txHashArrData });
      if (data.length === i + 1) {
        toast.info("Minting work done...");
        setState({ minted: true });
        await newSheetDataMakingFnc(txHashArrData);
      }
    }
  };

  return (
    <LayoutCard>
      {loader && <Loader />}

      <ExcelImportTool onFileUploaded={(e) => handleFileUploaded(e)} />

      {sheetData && <DisplayExcel sheet={sheet} sheetData={sheetData} />}

      {sheetData && (
        <Col md={12} sm={12} className="text-center">
          <ButtonCustom
            title="Mint"
            className="my-3"
            type="submit"
            onClick={(e) => {
              handleMint(e);
            }}
          />
        </Col>
      )}

      {state.newSheetCompleted && (
        <DisplayExcel sheet={newSheetName} sheetData={state.newSheetData} />
      )}
      {state.newSheetCompleted && (
        <Col md={12} sm={12} className="text-center">
          <ButtonCustom
            title="Export"
            className="my-3"
            type="submit"
            onClick={(e) => {
              handleExport(e);
            }}
          />
        </Col>
      )}
    </LayoutCard>
  );
}
