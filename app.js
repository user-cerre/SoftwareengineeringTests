let preguntas = [];
let preguntaActualIndex = 0;
let aciertosGlobales = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const feedback = document.getElementById('feedback');
const progressText = document.getElementById('progress-text');

// Cargar preguntas desde el JSON
async function cargarPreguntas() {
  try {
    const response = await fetch('preguntas.json');
    preguntas = await response.json();
    mostrarPregunta();
  } catch (error) {
    questionText.textContent = "Error al cargar las preguntas. Revisa tu archivo preguntas.json.";
    console.error("Error al cargar JSON:", error);
  }
}

function mostrarPregunta() {
  resetEstado();
  const actual = preguntas[preguntaActualIndex];
  
  progressText.textContent = `Pregunta ${preguntaActualIndex + 1} de ${preguntas.length}`;
  questionText.textContent = `${actual.id}. ${actual.pregunta}`;

  actual.opciones.forEach((opcion, index) => {
    const item = document.createElement('div');
    item.classList.add('option-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `opt-${index}`;
    checkbox.dataset.index = index;

    const label = document.createElement('label');
    label.htmlFor = `opt-${index}`;
    label.classList.add('option-label');
    label.innerHTML = `<strong>${opcion.letra}.</strong> ${opcion.texto}`;

    item.appendChild(checkbox);
    item.appendChild(label);
    optionsContainer.appendChild(item);
  });
}

function resetEstado() {
  optionsContainer.innerHTML = '';
  feedback.className = 'feedback-box hidden';
  feedback.textContent = '';
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');
}

submitBtn.addEventListener('click', () => {
  const actual = preguntas[preguntaActualIndex];
  const items = optionsContainer.querySelectorAll('.option-item');
  let aciertoTotal = true;

  actual.opciones.forEach((opcion, index) => {
    const item = items[index];
    const checkbox = item.querySelector('input');
    const usuarioMarcoVerdadera = checkbox.checked;
    const esRealmenteVerdadera = opcion.esVerdadera;

    checkbox.disabled = true; // Deshabilitar edición

    if (usuarioMarcoVerdadera === esRealmenteVerdadera) {
      if (usuarioMarcoVerdadera) {
        item.classList.add('correct'); // Marcó verdadera y era verdadera
      }
    } else {
      aciertoTotal = false;
      if (usuarioMarcoVerdadera && !esRealmenteVerdadera) {
        item.classList.add('incorrect'); // Marcó verdadera pero era falsa
      } else if (!usuarioMarcoVerdadera && esRealmenteVerdadera) {
        item.classList.add('missed'); // No marcó pero era verdadera
      }
    }
  });

  if (aciertoTotal) {
    aciertosGlobales++;
    feedback.textContent = "¡Perfecto! Has identificado correctamente todas las opciones V/F de esta pregunta.";
    feedback.className = "feedback-box success";
  } else {
    feedback.textContent = "Hay errores. Verde = Correcta | Rojo = Marcaste erróneamente | Amarillo = Opción verdadera que no marcaste.";
    feedback.className = "feedback-box error";
  }

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  preguntaActualIndex++;
  if (preguntaActualIndex < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultadoFinal();
  }
});

function mostrarResultadoFinal() {
  resetEstado();
  progressText.textContent = "Test Completado";
  questionText.textContent = "¡Has finalizado la tanda de preguntas!";
  
  feedback.textContent = `Puntuación final: ${aciertosGlobales} de ${preguntas.length} preguntas perfectas.`;
  feedback.className = "feedback-box success";
  
  const restartBtn = document.createElement('button');
  restartBtn.textContent = "Reiniciar Test";
  restartBtn.onclick = () => {
    preguntaActualIndex = 0;
    aciertosGlobales = 0;
    mostrarPregunta();
  };
  optionsContainer.appendChild(restartBtn);
}

// Inicializar app
cargarPreguntas();
