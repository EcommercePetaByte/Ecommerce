// ======================= FUNCIONES DE CARRITO =======================

// Obtener carrito desde localStorage, seguro ante errores
export const getCarrito = () => {
  try {
    const data = JSON.parse(localStorage.getItem("carrito"));
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
};

// Guardar carrito en localStorage y disparar evento global
export const guardarCarrito = (carrito) => {
  if (!Array.isArray(carrito)) carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Evento para que otros componentes reaccionen al cambio
  window.dispatchEvent(new Event("carritoActualizado"));
  return carrito;
};

// Agregar producto al carrito (respeta cantidad)
export const agregarAlCarrito = (producto, cantidad = 1) => {
  if (!producto?.id) return getCarrito();
  if (cantidad <= 0) return getCarrito();

  const carrito = getCarrito();
  const existente = carrito.find((p) => p.id === producto.id);

  if (existente) {
    existente.cantidad = Number(existente.cantidad) + Number(cantidad);
  } else {
    carrito.push({ ...producto, cantidad: Number(cantidad) });
  }

  return guardarCarrito(carrito);
};

// Quitar producto completamente
export const quitarDelCarrito = (id) => {
  const carrito = getCarrito().filter((p) => p.id !== id);
  return guardarCarrito(carrito);
};

// Actualizar cantidad de un producto
export const actualizarCantidad = (id, nuevaCantidad) => {
  let carrito = getCarrito();
  nuevaCantidad = Number(nuevaCantidad) || 0;

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter((p) => p.id !== id);
  } else {
    carrito = carrito.map((p) =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    );
  }

  return guardarCarrito(carrito);
};

// Vaciar carrito completamente
export const vaciarCarrito = () => {
  localStorage.removeItem("carrito");
  window.dispatchEvent(new Event("carritoActualizado"));
  return [];
};

// Calcular total del carrito
export const calculaTotal = () => {
  return getCarrito().reduce((acc, p) => {
    const cantidad = Number(p.cantidad) || 0;
    const precio = Number(p.price) || 0;
    return acc + cantidad * precio;
  }, 0);
};

// Contar cantidad total de items
export const totalItems = () => {
  return getCarrito().reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0);
};
