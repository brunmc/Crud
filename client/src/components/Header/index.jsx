import "./style.css";
import logo from "../../assets/logo.png";
import Button from "../ButtonAdd";
import Search from "../Search";

const Header = ({ onClick, nameBtn, searchTerm, handleSearchChange }) => {
  return (
    <div className="header">
      <img src={logo} alt="CRUD Impacto" />
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <Button onClick={onClick} label={nameBtn} />
    </div>
  );
};

export default Header;
