
const urlBase = 'https://utn-lubnan-api-2.herokuapp.com';
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtbW9xdWluMUBlbmdhZGdldC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFyY2VsaWEgTW9xdWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJqdGkiOiJiMmRlMGRkZC1jMzJjLTQxNGItYmUxNS03NGRlNDdlYWI3NzUiLCJleHAiOjE3MzQ1NDM0NzgsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMS8ifQ.1STQYwKVk-hgjHfL-mm6TT0LBzPypP27qTF4P2XDzVw";

const getProductos = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${urlBase}/api/Product`);
        xhr.setRequestHeader('Authorization', token); // Agregar encabezado de autorización
        xhr.onload = () => {
            xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject('Error al obtener los productos');
        };
        xhr.onerror = () => reject('Error en la conexión');
        xhr.send();
    });
};

const getCategorias = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${urlBase}/api/ProductCategory`);
        xhr.setRequestHeader('Authorization', token); // Agregar encabezado de autorización
        xhr.onload = () => {
            xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject('Error al obtener las categorías');
        };
        xhr.onerror = () => reject('Error en la conexión');
        xhr.send();
    });
};

const actualizarCategoria = (id, descripcion) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `${urlBase}/api/ProductCategory`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token); // Agregar encabezado de autorización
        xhr.onload = () => {
            xhr.status === 200 ? resolve() : reject('Error al actualizar la categoria');
        };
        xhr.onerror = () => reject('Error en la conexión');
        xhr.send(JSON.stringify({ productCategoryId: id, description: descripcion }));
    });
};

const cargarTabla = () => {
    Promise.all([getProductos(), getCategorias()])
        .then(([productos, categorias]) => {
            const productosFiltrados = productos.filter(prod => prod.productCategoryId); // Filtro productos con categoría
            productosFiltrados.sort((a, b) => { // Ordeno por categoría
                const categoriaA = categorias.find(cat => cat.productCategoryId === a.productCategoryId)?.description || '';
                const categoriaB = categorias.find(cat => cat.productCategoryId === b.productCategoryId)?.description || '';
                return categoriaA.localeCompare(categoriaB);
            });

            const tabla = document.getElementById('tbodyProductos');
            tabla.innerHTML = '';
            productosFiltrados.forEach(producto => {
                const categoria = categorias.find(cat => cat.productCategoryId === producto.productCategoryId);
                const row = tabla.insertRow();
                row.insertCell().textContent = producto.productId;
                row.insertCell().textContent = categoria ? categoria.description : 'Sin Categoria';
                row.insertCell().textContent = producto.name;
                row.insertCell().textContent = producto.description;
                row.insertCell().textContent = '$' + producto.price;
                row.insertCell().innerHTML = `<button class="btn" onclick="mostrarFormulario(${producto.productCategoryId})">Editar nombre categoría</button>`;
            });
        })
        .catch(error => alert(error));
};

const mostrarFormulario = (productCategoryId) => {
    document.getElementById('tablaContainer').style.display = 'none';
    document.getElementById('formularioEdicionCategoria').style.display = 'block';
    document.getElementById('productCategoryId').value = productCategoryId;
};

document.getElementById('editarCategoriaForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = parseInt(document.getElementById('productCategoryId').value);
    const descripcion = document.getElementById('description').value.trim();
    if (descripcion) {
        actualizarCategoria(id, descripcion)
            .then(() => {
                alert('Se actualizó la categoría');
                document.getElementById('tablaContainer').style.display = 'block';
                document.getElementById('formularioEdicionCategoria').style.display = 'none';
                cargarTabla();
            })
            .catch(error => alert(error));
    }
});

document.getElementById('cancelarEdicion').addEventListener('click', () => {
    document.getElementById('tablaContainer').style.display = 'block';
    document.getElementById('formularioEdicionCategoria').style.display = 'none';
});

window.onload = cargarTabla;
