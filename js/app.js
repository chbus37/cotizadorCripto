const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCriptos = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((resultado) => {
      return obtenerCriptos(resultado.Data);
    })
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("OPTION");
    option.value = Name;
    option.textContent = FullName;

    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  //   Validar
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === "" || criptomoneda === "") {
    // Mostrar alerta
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //   Consultar API con los resultados
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const exixteError = document.querySelector(".error");
  if (!exixteError) {
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add("error");
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY } = cotizacion;
  const precio = document.createElement("P");
  precio.classList.add("precio");
  precio.innerHTML = `
    El precio es <span>${PRICE}</span>
  
  `;
  const precioAlto = document.createElement("P");
  precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`;
  const precioBajo = document.createElement("P");
  precioBajo.innerHTML = `<p>Precio mas alto del dia <span>${LOWDAY}</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");
  spinner.innerHTML = `

        <div class="spinner">
            <div class="dot1"></div>
         <div class="dot2"></div>
        </div>
    
    `;
  resultado.appendChild(spinner);
}
