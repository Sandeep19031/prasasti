import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as XLSX from "xlsx";
export default function ExcelImportTool(props) {
  const [fileName, setFileName] = useState();
  const [sheetNames, setSheetNames] = useState();
  const [sheetData, setSheetData] = useState({});

  const acceptableFileName = ["xls", "xlsx"];

  const checkFileName = (name) => {
    return acceptableFileName.includes(name.split(".").pop().toLowerCase());
  };

  const readDataFromExcel = async (data) => {
    const workbook = await XLSX.read(data, {
      type: "binary",
      cellText: false,
      cellDates: true,
    });
    console.log(workbook);
    setSheetNames(workbook.SheetNames);

    console.log("SheetNames", workbook.SheetNames);
    var mySheetData = {};
    // Loop through the sheets
    for (var i = 0; i < workbook.SheetNames.length; i++) {
      let sheetName = workbook.SheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        dateNF: "mm-dd-yyyy",
      });

      mySheetData[sheetName] = jsonData;
    }
    setSheetData(mySheetData);
    return mySheetData;
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!checkFileName(file.name)) {
      alert("Invalid file type...");
      return;
    }
    setFileName(file.name);

    //Read the file
    const data = await file.arrayBuffer();
    const mySheetData = await readDataFromExcel(data);

    props.onFileUploaded(mySheetData);
  };
  return (
    <Row>
      <Col md={6} sm={12}>
        <div className="mb-2">
          {fileName && <p>{fileName}</p>}
          {!fileName && <p>Please upload a file...</p>}
        </div>
        <div className="">
          <input
            type="file"
            accept="xls xlsx"
            multiple={false}
            onChange={handleFile}
          />
        </div>
      </Col>
    </Row>
  );
}
