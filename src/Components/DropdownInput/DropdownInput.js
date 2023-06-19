import { Row } from "react-bootstrap";
import "./DropdownInput.scss";

export default function DropdownInput({
  id,
  title,
  list,
  onChange,
  className,
}) {
  return (
    <div>
      <label for={id}>
        <u>{title}</u>
      </label>
      <div className={className}>
        <select id={id} name={id} className="DropdownInput" onChange={onChange}>
          {list.map((data, key) => {
            return <option value={data}>{data}</option>;
          })}
        </select>
      </div>
    </div>
  );
}
