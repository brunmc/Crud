import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/components/App.css";
import Formtable from "./components/FormTable/Formtable";
import Header from "./components/Header";

axios.defaults.baseURL = "http://localhost:8080/";

const App: React.FC = () => {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    mobile: "",
    _id: "",
  });
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("name"); 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await axios.post("/create", formData);
    console.log(data);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
      setFormData({
        name: "",
        email: "",
        mobile: "",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  const getFetchData = async () => {
    const data = await axios.get("/");
    console.log(data);
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  const handleDelete = async (id: string) => {
    const data = await axios.delete("/delete/" + id);

    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  };

  const handleEdit = (el: any) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterField(e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    document.title = "CRUD Impacta";
    getFetchData();
  }, []);

  useEffect(() => {
    if (sortOrder && dataList.length > 0) {
      const sortedDataList = [...dataList].sort((a, b) => {
        const fieldA = a[filterField];
        const fieldB = b[filterField];
        if (typeof fieldA === "string" && typeof fieldB === "string") {
          if (sortOrder === "asc") {
            return fieldA.localeCompare(fieldB);
          } else {
            return fieldB.localeCompare(fieldA);
          }
        } else {
          if (sortOrder === "asc") {
            return fieldA - fieldB;
          } else {
            return fieldB - fieldA;
          }
        }
      });
      setDataList(sortedDataList);
    }
  }, [sortOrder, filterField]);

  return (
    <>
      <Header
        onClick={() => setAddSection(true)}
        nameBtn={"Adicionar"}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <div className="container">
        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)}
            rest={formData}
          />
        )}

        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}

        <div className="filter-container">
          <label htmlFor="filter">Filtrar por:</label>
          <select id="filter" onChange={handleFilterChange} value={filterField}>
            <option value="name">Nome</option>
            <option value="email">Email</option>
            <option value="mobile">Telefone</option>
            <option value="createdAt">Data de Criação</option>
          </select>
          <button onClick={handleSortChange}>
            Ordenar {sortOrder === "asc" ? "Crescente" : "Decrescente"}
          </button>
        </div>

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList
                  .filter((item: any) =>
                    Object.values(item)
                      .map((value) =>
                        filterField === "createdAt" && value instanceof Date
                          ? formatDate(value.toISOString())
                          : value.toString()
                      )
                      .some((value) =>
                        value.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                  )
                  .map((el: any) => (
                    <tr key={el._id}>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>{formatDate(el.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(el)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(el._id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

export default App;
