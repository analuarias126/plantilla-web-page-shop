function filtrarProductos() {

    let texto = document.getElementById("search-input").value.toLowerCase();

    let productos = document.querySelectorAll(".producto");
    let categorias = document.querySelectorAll(".categoria");
    let mensaje = document.getElementById("no-resultados");

    let visibles = 0;

    productos.forEach(producto => {
        let descripcion = producto.innerText.toLowerCase();

        if (descripcion.includes(texto)) {
            producto.style.display = "block";
            visibles++;
        } else {
            producto.style.display = "none";
        }
    });

    // Ocultar títulos cuando se está escribiendo
    categorias.forEach(cat => {
        cat.style.display = texto.length === 0 ? "block" : "none";
    });

    // Mostrar mensaje de "0 resultados"
    if (texto.length > 0 && visibles === 0) {
        mensaje.style.display = "block";
    } else {
        mensaje.style.display = "none";
    }
}




