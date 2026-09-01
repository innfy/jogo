// main.js

// Elementos do Menu Principal
const menuPrincipal = document.getElementById('menu-principal');
const btnPlay = document.getElementById('btn-play');
const containerPlay = document.getElementById('container-play');
const containerPlataforma = document.getElementById('container-plataforma');
const btnPc = document.getElementById('btn-pc');
const btnMobile = document.getElementById('btn-mobile');
const btnFecharJogo = document.getElementById('btn-fechar-jogo');

// Elementos da Gameplay
const telaGameplay = document.getElementById('tela-gameplay');
const btnPausar = document.getElementById('btn-pausar');

// Elementos do Menu de Pausa
const menuPausa = document.getElementById('menu-pausa');
const btnRetornarMenu = document.getElementById('btn-retornar-menu');
const btnContinuar = document.getElementById('btn-continuar');

// Funções de transição de tela
function mostrarTela(tela) {
    menuPrincipal.classList.add('oculto');
    telaGameplay.classList.add('oculto');
    menuPausa.classList.add('oculto');
    
    tela.classList.remove('oculto');
}

// Lógica do Menu Principal
btnPlay.addEventListener('click', () => {
    containerPlay.classList.add('oculto');
    containerPlataforma.classList.remove('oculto');
});

btnFecharJogo.addEventListener('click', () => {
    // Tenta fechar a janela (comportamento varia dependendo do navegador/ambiente)
    window.close();
});

// Lógica de escolha de plataforma e início de jogo
function iniciarJogo(plataforma) {
    // A variável 'plataforma' será usada nos próximos códigos (PC ou Mobile)
    mostrarTela(telaGameplay);
}

btnPc.addEventListener('click', () => iniciarJogo('pc'));
btnMobile.addEventListener('click', () => iniciarJogo('mobile'));

// Lógica de Pausa
btnPausar.addEventListener('click', () => {
    mostrarTela(menuPausa);
});

// Lógica do Menu de Pausa
btnContinuar.addEventListener('click', () => {
    mostrarTela(telaGameplay);
});

btnRetornarMenu.addEventListener('click', () => {
    // Reseta os botões do menu principal para o estado inicial
    containerPlay.classList.remove('oculto');
    containerPlataforma.classList.add('oculto');
    mostrarTela(menuPrincipal);
});

// Atualização no main.js (Sistema de Ondas e Temporizador)

const displayOnda = document.getElementById('display-onda');
const displayTurno = document.getElementById('display-turno');
const displayTempo = document.getElementById('display-tempo');

const MAX_ONDAS = 5;
const TEMPO_TURNO = 30; 

let ondaAtual = 1;
let turnoDiurno = true; 
let tempoRestante = TEMPO_TURNO;
let jogoRodando = false;
let loopTempo = null;

function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
}

function atualizarHUD() {
    displayOnda.innerText = `Onda: ${ondaAtual}/${MAX_ONDAS}`;
    displayTurno.innerText = `Turno: ${turnoDiurno ? 'Diurno' : 'Noturno'}`;
    
    if (turnoDiurno) {
        displayTurno.className = 'diurno';
        document.getElementById('area-jogo').style.backgroundColor = '#8e44ad'; 
    } else {
        displayTurno.className = 'noturno';
        document.getElementById('area-jogo').style.backgroundColor = '#2c3e50'; 
    }
    
    displayTempo.innerText = formatarTempo(tempoRestante);
}

function passarTurno() {
    if (turnoDiurno) {
        turnoDiurno = false;
    } else {
        turnoDiurno = true;
        ondaAtual++;
    }
    
    if (ondaAtual > MAX_ONDAS) {
        jogoRodando = false;
        clearInterval(loopTempo);
        // Lógica futura de Fim de Jogo / Vitória
        return;
    }
    
    tempoRestante = TEMPO_TURNO;
    atualizarHUD();
}

function tickTimer() {
    if (!jogoRodando) return;
    
    tempoRestante--;
    
    if (tempoRestante <= 0) {
        passarTurno();
    } else {
        atualizarHUD();
    }
}

function iniciarRelogio() {
    if (loopTempo) clearInterval(loopTempo);
    jogoRodando = true;
    atualizarHUD();
    loopTempo = setInterval(tickTimer, 1000);
}

function pausarRelogio() {
    jogoRodando = false;
    if (loopTempo) clearInterval(loopTempo);
}

// Substituindo as funções de controle do código anterior:

iniciarJogo = function(plataforma) {
    ondaAtual = 1;
    turnoDiurno = true;
    tempoRestante = TEMPO_TURNO;
    mostrarTela(telaGameplay);
    iniciarRelogio();
};

btnPausar.addEventListener('click', () => {
    pausarRelogio();
    mostrarTela(menuPausa);
});

btnContinuar.addEventListener('click', () => {
    mostrarTela(telaGameplay);
    iniciarRelogio();
});

btnRetornarMenu.addEventListener('click', () => {
    pausarRelogio();
    containerPlay.classList.remove('oculto');
    containerPlataforma.classList.add('oculto');
    mostrarTela(menuPrincipal);
});