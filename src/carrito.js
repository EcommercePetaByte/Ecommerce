// ======================= FUNCIONES DE CARRITO =======================

export const getCarrito = ()=>{
    return JSON.parse(localStorage.getItem("carrito")) || [];

};

// Guardar carrito en localStorage

export const guardarCarrito = (carrito) =>{
    localStorage.setItem("carrito",JSON.stringify(carrito));
};

// Agregar producto al carrito

export const agregarAlCarrito = (producto) =>{
    let carrito = getCarrito();

    // buscar si ya existe
    const index = carrito.findIndex((p) => p.id === producto.id);

    if (index !== -1){
        carrito[index].cantidad += 1;
    }else{
        carrito.push({...producto, cantidad: 1});
    }

    guardarCarrito(carrito);
};

// Quitar un producto (Completamente) del carrito

export const quitarDelCarrito = (id) =>{
    let carrito = getCarrito();
    carrito = carrito.filter((p) => p.id !== id);
    guardarCarrito(carrito)
};

//Actualizar cantidad de un producto

export const actualizarCantidad  = (id, nuevaCantidad) =>{
    let carrito = getCarrito();
    carrito = carrito.map((p) =>
    p.id === id ? { ...p, cantidad:nuevaCantidad} : p
);
guardarCarrito(carrito);
};

//Vaciar Carrito
export const vaciarCarrito = () =>{
    localStorage.removeItem("carrito");
};

//Calcular total
export const calculaTotal = () => {
    const carrito = getCarrito();
    return carrito.reduce((acc,p) => acc + p.price * p.cantidad, 0);
};
