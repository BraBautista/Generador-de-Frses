/**
 * Generador de Frases Motivacionales
 * Este script se realiza para la creación del generador de frases motivacionales.
 * Incluye generación aleatoria de frases, filtrado por categorías.
 */

// Esperar a que el DOM esté completamente cargado antes de ejecutar mi script
// Esto asegura que todos los elementos HTML existen antes de intentar acceder a ellos
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM que voy a necesitar manipular
    // Guardo las referencias en constantes para no tener que buscar los elementos múltiples veces
    const quoteText = document.getElementById('quote-text');         // Párrafo donde se muestra la frase
    const quoteAuthor = document.getElementById('quote-author');     // Párrafo donde se muestra el autor
    const generateBtn = document.getElementById('generate-btn');     // Botón para generar nueva frase
    const copyBtn = document.getElementById('copy-btn');             // Botón para copiar la frase
    const notification = document.getElementById('notification');    // Notificación emergente
    const categoryBtns = document.querySelectorAll('.category-btn'); // Todos los botones de categoría
    
    // Variables para mantener el estado de la aplicación
    let currentCategory = 'all';  // Categoría seleccionada actualmente (por defecto 'all')
    let currentQuote = {};        // Objeto que almacena la frase actual mostrada
    
    /**
     * Base de datos de frases motivacionales organizadas por categorías
     * La he estructurado como un objeto donde cada propiedad es una categoría
     * y cada categoría contiene un array de objetos con texto y autor
     */
    const quotesDatabase = {
        // Categoría: Éxito
        success: [
            {
                text: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje para continuar.",
                author: "Winston Churchill"
            },
            {
                text: "No midas tu éxito por lo que has logrado, sino por los obstáculos que has superado.",
                author: "Booker T. Washington"
            },
            {
                text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
                author: "Robert Collier"
            },
            {
                text: "La diferencia entre lo posible y lo imposible está en la determinación de la persona.",
                author: "Tommy Lasorda"
            },
            {
                text: "La mejor forma de predecir el futuro es creándolo.",
                author: "Peter Drucker"
            }
        ],
        // Categoría: Perseverancia
        perseverance: [
            {
                text: "La persistencia puede cambiar el fracaso en un logro extraordinario.",
                author: "Matt Biondi"
            },
            {
                text: "Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos.",
                author: "Confucio"
            },
            {
                text: "La paciencia, persistencia y perspiración hacen una combinación invencible para el éxito.",
                author: "Napoleon Hill"
            },
            {
                text: "No importa lo lento que vayas mientras no te detengas.",
                author: "Confucio"
            },
            {
                text: "El río se abre paso a través de las rocas no porque sea poderoso, sino porque persiste.",
                author: "Jim Watkins"
            }
        ],
        // Categoría: Valentía
        courage: [
            {
                text: "El valor no es la ausencia de miedo, sino el triunfo sobre él.",
                author: "Nelson Mandela"
            },
            {
                text: "Todo lo que siempre has querido está al otro lado del miedo.",
                author: "George Addair"
            },
            {
                text: "Actúa como si fuera imposible fallar.",
                author: "Dorothea Brande"
            },
            {
                text: "El coraje no es tener la fuerza para seguir, es seguir cuando no tienes fuerza.",
                author: "Theodore Roosevelt"
            },
            {
                text: "La vida se encoge o se expande en proporción al coraje de uno.",
                author: "Anaïs Nin"
            }
        ],
        // Categoría: Felicidad
        happiness: [
            {
                text: "La felicidad no es algo hecho. Viene de tus propias acciones.",
                author: "Dalai Lama"
            },
            {
                text: "La felicidad no depende de lo que tienes o de quién eres, depende de lo que piensas.",
                author: "Dale Carnegie"
            },
            {
                text: "Para ser feliz, no hagas a los demás lo que no quieres que te hagan a ti.",
                author: "Confucio"
            },
            {
                text: "La alegría reside en la alegría del logro y en la emoción del esfuerzo creativo.",
                author: "Franklin D. Roosevelt"
            },
            {
                text: "La manera de comenzar es dejar de hablar y empezar a hacer.",
                author: "Walt Disney"
            }
        ]
    };
    
    /**
     * Genera una frase aleatoria basada en la categoría seleccionada
     * Esta función es clave para la aplicación, ya que selecciona una frase aleatoria
     * de la categoría especificada o de todas las categorías si se selecciona 'all'
     * 
     * @param {string} category - La categoría seleccionada ('all' o una categoría específica)
     * @returns {Object} Un objeto con la frase y el autor seleccionados
     */
    function generateRandomQuote(category) {
        // Array donde almacenaré las frases disponibles según la categoría
        let availableQuotes = [];
        
        if (category === 'all') {
            // Si la categoría es 'all', combino todas las frases de todas las categorías
            // Uso Object.values para obtener los arrays de cada categoría y los concateno
            Object.values(quotesDatabase).forEach(categoryQuotes => {
                availableQuotes = availableQuotes.concat(categoryQuotes);
            });
        } else {
            // Si es una categoría específica, uso solo las frases de esa categoría
            availableQuotes = quotesDatabase[category];
        }
        
        // Genero un índice aleatorio para seleccionar una frase
        // Math.random() genera un número entre 0 y 1, que multiplico por la longitud
        // Math.floor redondea hacia abajo para obtener un índice válido
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        
        // Devuelvo la frase seleccionada
        return availableQuotes[randomIndex];
    }
    
    /**
     * Actualiza la interfaz de usuario con la nueva frase generada
     * Esta función modifica el DOM para mostrar la frase y el autor seleccionados
     * 
     * @param {Object} quote - El objeto de la frase con texto y autor
     */
    function updateUI(quote) {
        // Actualizo el texto de la frase
        quoteText.textContent = quote.text;
        
        // Actualizo el autor, añadiendo un guión antes si existe autor
        // Si no hay autor, simplemente dejo el elemento vacío
        quoteAuthor.textContent = quote.author ? `— ${quote.author}` : '';
        
        // Guardo la frase actual para usarla con las funciones de copiar y compartir
        currentQuote = quote;
    }
    
    /**
     * Muestra la notificación por un tiempo determinado
     * Añade la clase 'show' para hacerla visible y luego la quita después de un tiempo
     * 
     * @param {number} duration - Duración en milisegundos que se mostrará la notificación
     */
    function showNotification(duration = 2000) {
        // Añado la clase 'show' para hacer visible la notificación con animación
        notification.classList.add('show');
        
        // Configuro un temporizador para quitar la clase después del tiempo especificado
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
    
    /**
     * Copia la frase actual al portapapeles del usuario
     */
    function copyToClipboard() {
        // Creo el texto completo a copiar (frase + autor)
        const textToCopy = `"${currentQuote.text}" ${currentQuote.author ? `— ${currentQuote.author}` : ''}`;
        
        // Intento usar la API moderna del portapapeles (navigator.clipboard)
        // Esta API es más segura pero no está disponible en todos los navegadores
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Si se copia exitosamente, muestro la notificación
                    showNotification();
                })
                .catch(err => {
                    // Si hay un error, lo registro en la consola
                    console.error('Error al copiar: ', err);
                });
        } else {
            // Método alternativo para navegadores que no soportan la API del portapapeles
            // Creo un elemento de texto temporal, lo selecciono y ejecuto el comando 'copy'
            const tempInput = document.createElement('textarea');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Muestro la notificación
            showNotification();
        }
    }
    
    /**
     * Actualiza la apariencia de los botones de categoría
     * Añade la clase 'active' al botón de la categoría seleccionada
     * y la quita de los demás botones
     * 
     * @param {string} selectedCategory - La categoría seleccionada
     */
    function updateCategoryButtons(selectedCategory) {
        // Recorro todos los botones de categoría
        categoryBtns.forEach(button => {
            // Verifico si este botón corresponde a la categoría seleccionada
            if (button.dataset.category === selectedCategory) {
                // Si es así, le añado la clase 'active'
                button.classList.add('active');
            } else {
                // Si no, le quito la clase 'active'
                button.classList.remove('active');
            }
        });
    }
    
    // Configuración de los event listeners para la interactividad
    
    // Event listener para el botón de generar frases
    // Genera una nueva frase de la categoría actual cuando se hace clic
    generateBtn.addEventListener('click', () => {
        const quote = generateRandomQuote(currentCategory);
        updateUI(quote);
    });
    
    // Event listener para el botón de copiar
    copyBtn.addEventListener('click', copyToClipboard);
    // Event listeners para los botones de categoría
    // Los configuro dentro de un bucle para no repetir código
    categoryBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Obtengo la categoría del atributo data-category del botón
            const category = button.dataset.category;
            
            // Actualizo la categoría actual
            currentCategory = category;
            
            // Actualizo la apariencia de los botones
            updateCategoryButtons(category);
            
            // Genero inmediatamente una nueva frase de la categoría seleccionada
            const quote = generateRandomQuote(category);
            
            // Actualizo la interfaz con la nueva frase
            updateUI(quote);
        });
    });
    
    // Función auto-ejecutable para inicializar la aplicación
    // La defino e invoco inmediatamente para organizar mejor el código de inicialización
    (() => {
        // Selecciono la categoría "Todas" al inicio
        updateCategoryButtons('all');
        
        // Genero y muestro una frase inicial aleatoria
        const initialQuote = generateRandomQuote('all');
        updateUI(initialQuote);
    })();
}); 