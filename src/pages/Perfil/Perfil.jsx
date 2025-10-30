import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { UserRound, History, LogOut, PencilLine, Mail, Phone, MapPin, Trash2, PlusCircle } from "lucide-react";
import api from "../../api";
import "./Perfil.css";

// --- Componente separado para el formulario de nueva dirección ---
function AddAddressForm({ onSave, onCancel }) {
    const [address, setAddress] = useState({ street: "", city: "", province: "", postalCode: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(address);
    };

    return (
        <form onSubmit={handleSubmit} className="subcard form-grid" style={{ marginTop: '1rem', background: 'var(--surface-2)' }}>
            <h3 style={{ gridColumn: '1 / -1' }}>Nueva Dirección</h3>
            <div className="fi"><input name="street" value={address.street} onChange={handleChange} placeholder="Calle y número" required /></div>
            <div className="fi"><input name="city" value={address.city} onChange={handleChange} placeholder="Ciudad" required /></div>
            <div className="fi"><input name="province" value={address.province} onChange={handleChange} placeholder="Provincia" required /></div>
            <div className="fi"><input name="postalCode" value={address.postalCode} onChange={handleChange} placeholder="Código Postal" required /></div>
            <div className="edit-actions" style={{ gridColumn: '1 / -1', justifyContent: 'flex-start' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn">Guardar Dirección</button>
            </div>
        </form>
    );
}

export default function Perfil() {
    const navigate = useNavigate();
    
    const [form, setForm] = useState({ nombre: "", email: "", phoneNumber: "", address: "" });
    const [originalForm, setOriginalForm] = useState({});
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // Carga de datos del perfil y direcciones
    useEffect(() => {
        Promise.all([
            api.get("/auth/perfil"),
            api.get("/addresses")
        ])
        .then(([profileResponse, addressesResponse]) => {
            const userData = {
                nombre: profileResponse.data.username || "",
                email: profileResponse.data.email || "",
                phoneNumber: profileResponse.data.phoneNumber || "",
                address: profileResponse.data.address || "",
            };
            setForm(userData);
            setOriginalForm(userData);
            setAddresses(addressesResponse.data);
        })
        .catch(error => {
            console.error("Error al cargar datos del perfil o direcciones:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    // Guardar nueva dirección
    const handleSaveAddress = (newAddress) => {
        api.post("/addresses", newAddress)
            .then(response => {
                setAddresses(prev => [...prev, response.data]);
                setShowAddForm(false);
                alert("¡Dirección agregada con éxito!");
            })
            .catch(error => {
                console.error("Error al guardar la dirección:", error);
                alert(error.response?.data || "No se pudo guardar la dirección. Revisa los datos.");
            });
    };

    // Eliminar dirección
    const handleDeleteAddress = (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
            api.delete(`/addresses/${id}`)
                .then(() => {
                    setAddresses(prev => prev.filter(addr => addr.id !== id));
                    alert("Dirección eliminada.");
                })
                .catch(error => {
                    console.error("Error al eliminar la dirección:", error);
                    alert("No se pudo eliminar la dirección.");
                });
        }
    };
    
    // Logout
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
        window.location.reload();
    };

    const onChange = (e) => {
        const { id, value } = e.target;
        setForm((f) => ({ ...f, [id]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        api.put("/auth/perfil", form)
        .then(() => {
            alert("¡Perfil actualizado con éxito!");
            setOriginalForm(form);
            setEdit(false);
        })
        .catch(() => alert("No se pudo guardar la información."));
    };

    const handleCancel = () => {
        setForm(originalForm);
        setEdit(false);
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="perfil container">
                    <p>Cargando perfil...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="perfil container">
                <header className="perfil-head">
                    <div className="perfil-title">
                        <h1>Tu perfil</h1>
                        <p>Gestioná tus datos, direcciones y pedidos.</p>
                    </div>
                </header>
                
                <section className="perfil-grid">
                    <aside className="perfil-aside card">
                        <div className="avatar-wrap" aria-label="Avatar del usuario">
                            <div className="avatar-ring"><UserRound size={64} /></div>
                            <strong className="avatar-name">{form.nombre}</strong>
                            <span className="avatar-mail">{form.email}</span>
                        </div>
                        <div className="aside-actions">
                            <button className="btn btn-full" type="button" disabled>
                                <History size={18} /> Historial de compras
                            </button>
                            <button className="btn btn-danger btn-full" type="button" onClick={handleLogout}>
                                <LogOut size={18} /> Cerrar sesión
                            </button>
                        </div>
                    </aside>

                    <section className="perfil-main card">
                        <div className="main-head">
                            <h2>Información del perfil</h2>
                            {!edit ? (
                                <button className="btn" type="button" onClick={() => setEdit(true)}>
                                    <PencilLine size={18} /> Editar
                                </button>
                            ) : (
                                <div className="edit-actions">
                                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
                                    <button className="btn" type="submit" form="perfil-form">Guardar</button>
                                </div>
                            )}
                        </div>

                        <form id="perfil-form" className="form-grid" onSubmit={handleSave}>
                            <label className="fi">
                                <span>Nombre de Usuario</span>
                                <div className="input">
                                    <UserRound size={16} />
                                    <input id="nombre" type="text" value={form.nombre} onChange={onChange} disabled={!edit} />
                                </div>
                            </label>

                            <label className="fi">
                                <span>Email</span>
                                <div className="input">
                                    <Mail size={16} />
                                    <input id="email" type="email" value={form.email} disabled />
                                </div>
                            </label>

                            <label className="fi">
                                <span>Teléfono</span>
                                <div className="input">
                                    <Phone size={16} />
                                    <input id="phoneNumber" type="tel" value={form.phoneNumber} onChange={onChange} disabled={!edit} placeholder="No establecido" />
                                </div>
                            </label>

                            <label className="fi fi-wide">
                                <span>Domicilio Principal</span>
                                <div className="input">
                                    <MapPin size={16} />
                                    <input id="address" type="text" value={form.address} onChange={onChange} disabled={!edit} placeholder="No establecido" />
                                </div>
                            </label>
                        </form>
                        
                        <div className="subcard" style={{ marginTop: '2rem' }}>
                            <div className="main-head">
                                <h3>Direcciones de Envío</h3>
                                {!showAddForm && addresses.length < 3 && (
                                    <button className="btn" onClick={() => setShowAddForm(true)}>
                                        <PlusCircle size={16} /> Agregar dirección
                                    </button>
                                )}
                            </div>

                            {addresses.map(addr => (
                                <div key={addr.id} className="address-item">
                                    <p>{addr.street}, {addr.city}, {addr.province} ({addr.postalCode})</p>
                                    <button onClick={() => handleDeleteAddress(addr.id)} className="btn-icon-danger">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            ))}

                            {addresses.length === 0 && !showAddForm && (
                                <p className="muted">No tenés direcciones de envío guardadas.</p>
                            )}

                            {showAddForm && (
                                <AddAddressForm 
                                    onSave={handleSaveAddress} 
                                    onCancel={() => setShowAddForm(false)}
                                />
                            )}
                        </div>
                    </section>
                </section>
            </main>
        </>
    );
}
