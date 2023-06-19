import ExcelImportTool from "./ExcelImportTool";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table } from "react-bootstrap";

export default function DisplayExcel({ sheet, sheetData }) {
  console.log("Display excel: ", sheetData, sheet);

  return (
    <Row>
      {sheetData && (
        <Row>
          <Col md={6} sm={12}>
            <Table>
              <thead className="text-primary">
                <tr>
                  {sheetData[sheet][0].map((h) => (
                    <td key={h}>{h}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData[sheet].slice(1).map((row) => (
                  <tr key={row}>
                    {row.map((c, i) => {
                      return <td key={i}>{c}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Row>
  );
}
