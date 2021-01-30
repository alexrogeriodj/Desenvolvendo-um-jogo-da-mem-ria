// variáveis
let listaDesenhos = [
  'fa-diamond', 'fa-diamond',
  'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'
];
let jogoIniciado = false;
let listaCartaAberta = [];
let contadorErros = 0;
let contadorMovimentos = 0;
let qtdEstrelas = 3;
let intervalo;
let horaInicio;
const estrela = document.querySelectorAll('.stars i');
const cronometro = document.querySelector('.cronometro');
const movimentos = document.querySelector('.moves');
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const btnSim = document.querySelector('#botaoSim');
const mensagemModal = document.querySelector('.modal-body');

embaralhar();

// Evento de click nas cartas
deck.addEventListener('click', function(event) {
  if(!jogoIniciado) {
    iniciarCronometro();
    jogoIniciado = true;
  }
  virarCarta(event.target);
});

// Evento de click no botão de reiniciar
restart.addEventListener('click', zerarJogo);

// Evento de click no botão de sim, depois de ganhar o jogo
btnSim.addEventListener('click', zerarJogo)

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description função para embaralhar as cartas e construir o HTML
*/
function embaralhar() {
  listaDesenhos = shuffle(listaDesenhos);
  deck.innerHTML = "";

  for(let i = 0; i < listaDesenhos.length; i++) {
    let carta = document.createElement('li');
    carta.className = "card";
    let desenho = document.createElement('i');
    desenho.className = "fa " + listaDesenhos[i];
    carta.appendChild(desenho);
    deck.appendChild(carta);
  };
}

/**
* @description função para virar as cartas
* @param {element} carta
*/
function virarCarta(carta) {
  if (carta.className == "card") {
    carta.className = "card open show";
    cartaAberta(carta);
  };
}

/**
* @description função para abrir a carta
* @param {element} carta
*/
function cartaAberta(carta) {
  listaCartaAberta.push(carta);
  if(listaCartaAberta.length === 2) {
    if(listaCartaAberta[0].innerHTML === listaCartaAberta[1].innerHTML) {
      acertou();
    } else {
      setTimeout(errou, 500);
      contagemEstrelas();
    };
    contagemMovimentos();
  };
}

/**
* @description função para mostrar que acertou as cartas
*/
function acertou() {
  listaCartaAberta[0].className = "card match";
  listaCartaAberta[1].className = "card match";
  listaCartaAberta = [];
  setTimeout(tudoCerto, 500);
}

/**
* @description função para mostrar que errou as cartas
*/
function errou() {
  listaCartaAberta[0].className = "card";
  listaCartaAberta[1].className = "card";
  listaCartaAberta = [];
}

/**
* @description função para contagem de movimentos errados e contagem de estrelas
* Quando o jogador tiver 5 erros, perde uma estrela
* Quando chegar em 10 erros, perde mais uma estrela
* Ficando somente com 1 estrela
*/
function contagemEstrelas() {
  contadorErros++;
  if(contadorErros === 5) {
    estrela[2].className = "fa";
    qtdEstrelas = 2;
  };
  if(contadorErros === 10) {
    estrela[1].className = "fa";
    qtdEstrelas = 1;
  };
}

/**
* @description função para contagem de movimentos
*/
function contagemMovimentos() {
  contadorMovimentos++;
  movimentos.textContent = contadorMovimentos;
}

/**
* @description função para zerar o jogo
*/
function zerarJogo() {
  embaralhar();
  contadorErros = 0;
  contadorMovimentos = 0;
  qtdEstrelas = 3;
  listaCartaAberta = [];
  estrela[1].className = "fa fa-star";
  estrela[2].className = "fa fa-star";
  movimentos.textContent = contadorMovimentos;
  pararCronometro();
  jogoIniciado = false;
  cronometro.innerHTML = "00:00:00";
}

/**
* @description função para iniciar o cronômetro
*/
function iniciarCronometro() {
  horaInicio = new Date().getTime();
  intervalo = window.setInterval(cronometrar, 1000);
}

/**
* @description função para calcular o tempo do jogo
*/
function cronometrar() {
  let cron = new Date().getTime() - horaInicio;
  let ms = cron % 1000;
  cron = (cron - ms) / 1000;
  let seg = cron % 60;
  cron = (cron - seg) / 60;
  let min = cron % 60;
  let hor = (cron - min) / 60;
  seg = seg.toString().padStart(2,0);
  min = min.toString().padStart(2,0);
  hor = hor.toString().padStart(2,0);
  cronometro.innerHTML = hor + ":" + min + ":" + seg;
}

/**
* @description função para parar o cronômetro
*/
function pararCronometro() {
  window.clearInterval(intervalo);
}

/**
* @description função para verificar o fim do jogo
*/
function tudoCerto() {
  const cartasMatch = document.querySelectorAll(".match");
  if(cartasMatch.length === 16) {
    pararCronometro();
    let mensagemGanhou = "<p>Você fez " + contadorMovimentos + " movimentos em " + cronometro.innerHTML + " com uma pontuação de " + qtdEstrelas + " estrelas!!!</p>";
    let mensagemJogarNovamente = "<p>Quer jogar de novo?</p>";
    mensagemModal.innerHTML = mensagemGanhou + mensagemJogarNovamente;
    $('#modalFimDeJogo').modal({backdrop: 'static', keyboard: false});
  };
}
