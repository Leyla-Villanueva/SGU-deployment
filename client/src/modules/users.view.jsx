import { useEffect, useState } from "react";
import UserController from "./users.controller";

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    firstName: "",
    secondName: "",
    lastName1: "",
    lastName2: "",
    email: "",
    phoneNumber: ""
  });
  const [searchId, setSearchId] = useState(""); 

  const loadUsers = async () => {
    const response = await UserController.getAll();
    if (response && response.data) {
      setUsers(response.data);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.id) {
      await UserController.update(form.id, form);
    } else {
      await UserController.save(form);
    }

    resetForm();
    loadUsers();
  };

  const resetForm = () => {
    setForm({
      id: null,
      firstName: "",
      secondName: "",
      lastName1: "",
      lastName2: "",
      email: "",
      phoneNumber: ""
    });
  };

  const handleDelete = async (id) => {
    if (confirm("¿Deseas eliminar este usuario?")) {
      await UserController.delete(id);
      loadUsers();
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchId.trim() === "") {
      loadUsers();
      return;
    }

    try {
      const response = await UserController.getById(searchId);
      if (response && response.data) {
        const userData = response.data.id ? response.data : response.data.value || response.data;
        setUsers([userData]);
      } else {
        setUsers([]);
        alert("Usuario no encontrado.");
      }
    } catch (err) {
      console.error("Error al buscar usuario:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h4>{form.id ? "Editar Usuario" : "Registrar Usuario"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Nombre</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>Segundo Nombre</label>
              <input
                type="text"
                name="secondName"
                className="form-control"
                value={form.secondName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="lastName1"
                className="form-control"
                value={form.lastName1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="lastName2"
                className="form-control"
                value={form.lastName2}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label>Correo</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>Teléfono</label>
              <input
                type="number"
                name="phoneNumber"
                maxLength={10}
                minLength={10}
                className="form-control"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              {form.id ? "Actualizar" : "Guardar"}
            </button>

            {form.id && (
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Lista de Usuarios</h4>
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="number"
                className="form-control me-2"
                placeholder="Buscar por ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary">
                Buscar
              </button>
            </form>
          </div>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{`${u.firstName} ${u.lastName1}`}</td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => setForm(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
