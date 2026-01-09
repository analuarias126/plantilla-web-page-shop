/* carrito.js
 - Añade listeners a cada .producto y a cada .btn-carrito
 - click en producto -> guarda productoSeleccionado en localStorage y abre producto.html
 - click en carrito (icono) -> agrega al carrito con cantidad/talla/color (si existen)
*/

document.addEventListener("DOMContentLoaded", () => {
  // abrir detalle al clicar en el producto
  document.querySelectorAll(".producto").forEach(prod => {
    prod.addEventListener("click", () => {
      const info = productoInfoDesdeElemento(prod);
      // Guardar objeto completo para la página de detalle
      localStorage.setItem("productoSeleccionado", JSON.stringify(info));
      window.location.href = "producto.html";
    });
  });

  // agregar al carrito desde la vista de productos (botón carrito)
  document.querySelectorAll(".btn-carrito").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // evitar que abra el detalle
      const prodEl = btn.closest(".producto");
      agregarAlCarritoDesdeElemento(prodEl);
    });
  });
});

/* Extrae la info útil (data-attributes y elementos visibles) desde el .producto */
function productoInfoDesdeElemento(prodEl){
  const dataset = prodEl.dataset || {};
  // lee cantidad si existe el select.cantidad
  const cantidadSel = prodEl.querySelector("select.cantidad");
  const cantidad = cantidadSel ? cantidadSel.value : "1";

  return {
    id: dataset.id || "",
    nombre: dataset.nombre || prodEl.querySelector("p")?.innerText || "Sin nombre",
    precio: dataset.precio || "",
    tallas: dataset.tallas || "",     // string "38,39,40"
    colores: dataset.colores || "",
    descripcion: dataset.descripcion || "",
    imagen: dataset.imagen || prodEl.querySelector("img")?.src || "",
    cantidad: cantidad,
    tallaSeleccionada: dataset.talla || "",
    colorSeleccionado: dataset.color || ""
  };
}

/* Agrega al carrito tomando datos del elemento de producto (listado) */
function agregarAlCarritoDesdeElemento(prodEl){
  if (!prodEl) return;
  const info = productoInfoDesdeElemento(prodEl);

  // Si no hay talla/color en la tarjeta, los dejamos "Sin seleccionar"
  const item = {
    id: info.id,
    nombre: info.nombre,
    precio: info.precio,
    imagen: info.imagen,
    cantidad: Number(info.cantidad) || 1,
    talla: info.tallaSeleccionada || "Sin seleccionar",
    color: info.colorSeleccionado || "Sin seleccionar"
  };

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Si ya existe misma id y misma talla+color, sumar cantidades
  const idx = carrito.findIndex(c => c.id === item.id && c.talla === item.talla && c.color === item.color);
  if (idx >= 0) {
    carrito[idx].cantidad = Number(carrito[idx].cantidad) + Number(item.cantidad);
  } else {
    carrito.push(item);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito");
}


