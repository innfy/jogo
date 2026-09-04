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

// Atualização no main.js (Gerenciamento do Mapa)

const COLUNAS = 20;
const LINHAS = 10;

const TIPOS_TERRENO = {
    GRAMA: 'grama',
    TERRA: 'terra',
    SOLO: 'solo',
    LAMA: 'lama',
    TRILHA: 'trilha',
    PEDRA: 'pedra',
    AGUA: 'agua',
    MATO: 'mato'
};

let matrizMapa = [];

function gerarMapa() {
    const areaJogo = document.getElementById('area-jogo');
    areaJogo.innerHTML = ''; 
    
    const containerGrid = document.createElement('div');
    containerGrid.id = 'mapa-grid';
    
    matrizMapa = [];

    for (let y = 0; y < LINHAS; y++) {
        let linhaAtual = [];
        
        for (let x = 0; x < COLUNAS; x++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            
            let tipoTerreno = TIPOS_TERRENO.GRAMA;
            
            // Lógica de geração aleatória (exceto na última coluna, que é a plantação vital)
            if (x < COLUNAS - 1) {
                const sorteio = Math.random();
                if (sorteio < 0.05) {
                    tipoTerreno = TIPOS_TERRENO.PEDRA;
                } else if (sorteio < 0.10) {
                    tipoTerreno = TIPOS_TERRENO.AGUA;
                } else if (sorteio < 0.15) {
                    tipoTerreno = TIPOS_TERRENO.MATO;
                }
            } else {
                celula.classList.add('zona-plantacao');
            }

            celula.classList.add(tipoTerreno);
            containerGrid.appendChild(celula);
            
            linhaAtual.push({
                x: x,
                y: y,
                tipo: tipoTerreno,
                elementoHTML: celula
            });
        }
        matrizMapa.push(linhaAtual);
    }
    
    areaJogo.appendChild(containerGrid);
}

// Substituindo novamente a função de iniciar o jogo para incluir a geração de mapa
iniciarJogo = function(plataforma) {
    gerarMapa(); // Sempre gera um novo mapa ao iniciar
    ondaAtual = 1;
    turnoDiurno = true;
    tempoRestante = TEMPO_TURNO;
    mostrarTela(telaGameplay);
    iniciarRelogio();
};

// Atualização no main.js (Mecânicas de Unidades e Economia)

let dinheiro = 150;
const displayDinheiro = document.getElementById('display-dinheiro');
let cartaSelecionada = null;
let tipoSelecionado = null; // 'planta' ou 'maquina'

const DEFINICOES_PLANTAS = {
    MILHO: { id: 'milho', nome: 'Milho', cor: 'yellow', tempoCrescimento: 10, valorRecompensa: 25 },
    TRIGO: { id: 'trigo', nome: 'Trigo', cor: 'wheat', tempoCrescimento: 8, valorRecompensa: 20 },
    MACA: { id: 'maca', nome: 'Maçã', cor: 'red', tempoCrescimento: 15, valorRecompensa: 40 },
    SOJA: { id: 'soja', nome: 'Soja', cor: 'lightgreen', tempoCrescimento: 12, valorRecompensa: 30 },
    ALGODAO: { id: 'algodao', nome: 'Algodão', cor: 'white', tempoCrescimento: 14, valorRecompensa: 35 }
};

const DEFINICOES_MAQUINAS = {
    HERB_SIDE: { id: 'herb', nome: 'Herb-side', custo: 100, corGas: 'white', area: '3x3_volta' },
    FUNGI_LLICIT: { id: 'fungi', nome: 'Fungi-llicit', custo: 300, corGas: 'black', area: '6x6_volta' },
    INSEC_CATED: { id: 'insec', nome: 'Insec-cated', custo: 50, corGas: 'yellow', area: '6x0_frente' },
    ACARE_CITY: { id: 'acare', nome: 'Acare-city', custo: 150, corGas: 'blue', area: '4x1_frente' },
    NEMATONDES: { id: 'nema', nome: 'Nematondes', custo: 120, corGas: 'transparent', area: 'especial' },
    BAT_TERIES: { id: 'bat', nome: 'Bat-teries', custo: 500, corGas: 'transparent', area: '10x10_volta' }
};

let plantasAtivas = [];

function atualizarDinheiro(valor) {
    dinheiro += valor;
    displayDinheiro.innerText = `Dinheiro: $ ${dinheiro}`;
}

function inicializarBaralhos() {
    const baralhoPlantas = document.getElementById('baralho-plantas');
    const baralhoMaquinas = document.getElementById('baralho-maquinas');
    
    // Gerar cartas de Plantas (Não custam dinheiro, mas requerem condições no mapa)
    Object.values(DEFINICOES_PLANTAS).forEach(p => {
        const btn = document.createElement('div');
        btn.className = 'carta planta';
        btn.innerHTML = `<div style="background:${p.cor}; width:15px; height:15px; border-radius:50%;"></div>${p.nome}`;
        btn.onclick = () => selecionarCarta(p, 'planta', btn);
        baralhoPlantas.appendChild(btn);
    });
    
    // Gerar cartas de Máquinas
    Object.values(DEFINICOES_MAQUINAS).forEach(m => {
        const btn = document.createElement('div');
        btn.className = 'carta maquina';
        btn.innerHTML = `<div>$${m.custo}</div>${m.nome}`;
        btn.onclick = () => selecionarCarta(m, 'maquina', btn);
        baralhoMaquinas.appendChild(btn);
    });
}

function selecionarCarta(entidade, tipo, elementoHtml) {
    document.querySelectorAll('.carta').forEach(c => c.classList.remove('selecionada'));
    if (cartaSelecionada === entidade) {
        cartaSelecionada = null;
        tipoSelecionado = null;
    } else {
        cartaSelecionada = entidade;
        tipoSelecionado = tipo;
        elementoHtml.classList.add('selecionada');
    }
}

// Lógica de clique no grid
document.getElementById('area-jogo').addEventListener('click', (e) => {
    const celula = e.target.closest('.celula');
    if (!celula || !cartaSelecionada) return;
    
    const x = parseInt(celula.dataset.x); // Assumindo que setamos data-x na geração do mapa
    const y = parseInt(celula.dataset.y);
    
    if (tipoSelecionado === 'planta') {
        // Lógica simplificada: Requer Terra/Solo (no futuro verificar água próxima)
        if (celula.classList.contains('terra') || celula.classList.contains('solo')) {
            plantar(cartaSelecionada, celula);
            celula.classList.remove('terra');
            celula.classList.add('solo');
            selecionarCarta(null, null, null);
        }
    } else if (tipoSelecionado === 'maquina') {
        if (dinheiro >= cartaSelecionada.custo) {
            // Pode ser colocado em quase qualquer quadrado terrestre
            if (!celula.classList.contains('agua') && !celula.classList.contains('pedra')) {
                atualizarDinheiro(-cartaSelecionada.custo);
                construirMaquina(cartaSelecionada, celula);
                selecionarCarta(null, null, null);
            }
        }
    }
});

function plantar(defPlanta, celula) {
    const divPlanta = document.createElement('div');
    divPlanta.className = 'entidade-planta';
    divPlanta.style.backgroundColor = defPlanta.cor;
    celula.appendChild(divPlanta);
    
    const plantaInstancia = {
        div: divPlanta,
        def: defPlanta,
        tempoRestante: defPlanta.tempoCrescimento,
        pronta: false
    };
    
    plantasAtivas.push(plantaInstancia);
    
    // Coleta manual (Touch/Click)
    divPlanta.addEventListener('click', (e) => {
        e.stopPropagation();
        if (plantaInstancia.pronta) {
            atualizarDinheiro(plantaInstancia.def.valorRecompensa);
            celula.removeChild(divPlanta);
            plantasAtivas = plantasAtivas.filter(p => p !== plantaInstancia);
        }
    });
}

function construirMaquina(defMaquina, celula) {
    const divMaquina = document.createElement('div');
    divMaquina.className = 'entidade-maquina';
    // Estilos visuais adicionais baseados no defMaquina.id virão aqui
    celula.appendChild(divMaquina);
}

function tickTimer() {
    // ... código anterior ...
    plantasAtivas.forEach(p => {
        if (!p.pronta) {
            p.tempoRestante--;
            if (p.tempoRestante <= 0) {
                p.pronta = true;
                p.div.classList.add('pronta');
            }
        }
    });
}

// main.js - Atualização (Gerenciador de Inimigos e Mecânicas)

const TIPOS_INIMIGOS = {
    ERVA: { id: 'erva', classe: 'inimigo-erva', hp: 10, vel: 0 },
    LAGARTA: { id: 'lagarta', classe: 'inimigo-lagarta', hp: 20, vel: 0.5 },
    GAFANHOTO: { id: 'gafanhoto', classe: 'inimigo-gafanhoto', hp: 15, vel: 1.0 },
    GRILO: { id: 'grilo', classe: 'inimigo-grilo', hp: 15, vel: 1.5, pular: true },
    BESOURO: { id: 'besouro', classe: 'inimigo-besouro', hp: 100, vel: 0.3 },
    RATO: { id: 'rato', classe: 'inimigo-rato', hp: 1, vel: 0.8 }, 
    JAVALI: { id: 'javali', classe: 'inimigo-javali', hp: 1, vel: 0.6 },
    JAVALAO: { id: 'javalao', classe: 'inimigo-javalao', hp: 1, vel: 0.2 }
};

let inimigosAtivos = [];
let lixosAtivos = [];

function spawnInimigo(tipoDef, parasitas = []) {
    const startY = Math.floor(Math.random() * LINHAS);
    const areaJogo = document.getElementById('mapa-grid');
    const celulaInicial = matrizMapa[startY][0].elementoHTML;
    
    const div = document.createElement('div');
    div.className = `entidade-inimigo ${tipoDef.classe}`;
    
    // Adicionar parasitas visuais se for Rato ou Javali
    parasitas.forEach(p => {
        const dot = document.createElement('div');
        dot.className = `parasita-${p}`;
        div.appendChild(dot);
    });

    celulaInicial.appendChild(div);

    const inimigoInstancia = {
        div: div,
        def: tipoDef,
        hp: tipoDef.hp,
        x: 0,
        y: startY,
        parasitas: parasitas
    };

    inimigosAtivos.push(inimigoInstancia);
}

function spawnLixo() {
    const rx = Math.floor(Math.random() * (COLUNAS - 1));
    const ry = Math.floor(Math.random() * LINHAS);
    const celula = matrizMapa[ry][rx].elementoHTML;
    
    const div = document.createElement('div');
    div.className = 'entidade-lixo';
    celula.appendChild(div);
    lixosAtivos.push({ div: div, x: rx, y: ry });
}

function atualizarInimigos() {
    if (!jogoRodando) return;

    for (let i = inimigosAtivos.length - 1; i >= 0; i--) {
        let ini = inimigosAtivos[i];
        
        if (ini.def.vel > 0) {
            ini.x += ini.def.vel;
            
            let currentGridX = Math.floor(ini.x);
            
            if (currentGridX >= COLUNAS - 1) {
                // Game Over Lógica
                console.log("GAME OVER - Inimigo chegou na plantação!");
                pausarRelogio();
                // Aqui entraria tela de game over
            } else {
                let celulaAtual = matrizMapa[ini.y][currentGridX];
                
                // Converter terra/grama em trilha
                if (celulaAtual.tipo === TIPOS_TERRENO.GRAMA || celulaAtual.tipo === TIPOS_TERRENO.TERRA) {
                    celulaAtual.tipo = TIPOS_TERRENO.TRILHA;
                    celulaAtual.elementoHTML.className = 'celula trilha';
                }
                
                // Javali come mato e destrói máquinas (lógica simplificada)
                if ((ini.def.id === 'javali' || ini.def.id === 'javalao') && celulaAtual.tipo === TIPOS_TERRENO.MATO) {
                    celulaAtual.tipo = TIPOS_TERRENO.TERRA;
                    celulaAtual.elementoHTML.className = 'celula terra';
                }

                // Atualizar posição visual
                celulaAtual.elementoHTML.appendChild(ini.div);
            }
        }
    }
}

// Chamar atualizarInimigos dentro do loop de tempo ou requestAnimationFrame
setInterval(atualizarInimigos, 500);

// Atualização no main.js (Sistema de Limite de Cartas e Reposição)

// Adicionando limites às definições (quantidade inicial e limite máximo que cresce)
const DEFINICOESPLANTAS = {
    MILHO: { id: 'milho', nome: 'Milho', cor: 'yellow', tempoCrescimento: 10, valorRecompensa: 25, qtd: 3, limite: 5 },
    TRIGO: { id: 'trigo', nome: 'Trigo', cor: 'wheat', tempoCrescimento: 8, valorRecompensa: 20, qtd: 4, limite: 6 },
    MACA: { id: 'maca', nome: 'Maçã', cor: 'red', tempoCrescimento: 15, valorRecompensa: 40, qtd: 2, limite: 4 },
    SOJA: { id: 'soja', nome: 'Soja', cor: 'lightgreen', tempoCrescimento: 12, valorRecompensa: 30, qtd: 3, limite: 5 },
    ALGODAO: { id: 'algodao', nome: 'Algodão', cor: 'white', tempoCrescimento: 14, valorRecompensa: 35, qtd: 2, limite: 4 }
};

const DEFINICOESMAQUINAS = {
    HERB_SIDE: { id: 'herb', nome: 'Herb-side', custo: 100, corGas: 'white', area: '3x3_volta', qtd: 2, limite: 3 },
    FUNGI_LLICIT: { id: 'fungi', nome: 'Fungi-llicit', custo: 300, corGas: 'black', area: '6x6_volta', qtd: 1, limite: 2 },
    INSEC_CATED: { id: 'insec', nome: 'Insec-cated', custo: 50, corGas: 'yellow', area: '6x0_frente', qtd: 3, limite: 5 },
    ACARE_CITY: { id: 'acare', nome: 'Acare-city', custo: 150, corGas: 'blue', area: '4x1_frente', qtd: 2, limite: 4 },
    NEMATONDES: { id: 'nema', nome: 'Nematondes', custo: 120, corGas: 'transparent', area: 'especial', qtd: 2, limite: 3 },
    BAT_TERIES: { id: 'bat', nome: 'Bat-teries', custo: 500, corGas: 'transparent', area: '10x10_volta', qtd: 1, limite: 1 }
};

let tempoParaReporCartas = 15; // Repõe uma carta a cada 15 segundos
let contadorReporCartas = tempoParaReporCartas;

function atualizarInterfaceCartas() {
    document.querySelectorAll('.carta').forEach(btn => {
        const idCarta = btn.dataset.id;
        let def = Object.values(DEFINICOES_PLANTAS).find(p => p.id === idCarta) || 
                  Object.values(DEFINICOES_MAQUINAS).find(m => m.id === idCarta);
        
        if (def) {
            const contador = btn.querySelector('.carta-contador');
            contador.innerText = def.qtd;
            
            if (def.qtd <= 0) {
                btn.classList.add('esgotada');
                if (cartaSelecionada === def) selecionarCarta(null, null, null);
            } else {
                btn.classList.remove('esgotada');
            }
        }
    });
}

function inicializarBaralhos() {
    const baralhoPlantas = document.getElementById('baralho-plantas');
    const baralhoMaquinas = document.getElementById('baralho-maquinas');
    
    baralhoPlantas.innerHTML = '';
    baralhoMaquinas.innerHTML = '';
    
    Object.values(DEFINICOES_PLANTAS).forEach(p => {
        const btn = document.createElement('div');
        btn.className = 'carta planta';
        btn.dataset.id = p.id;
        btn.innerHTML = `
            <div class="carta-contador">${p.qtd}</div>
            <div style="background:${p.cor}; width:15px; height:15px; border-radius:50%;"></div>
            ${p.nome}
        `;
        btn.onclick = () => { if (p.qtd > 0) selecionarCarta(p, 'planta', btn); };
        baralhoPlantas.appendChild(btn);
    });
    
    Object.values(DEFINICOES_MAQUINAS).forEach(m => {
        const btn = document.createElement('div');
        btn.className = 'carta maquina';
        btn.dataset.id = m.id;
        btn.innerHTML = `
            <div class="carta-contador">${m.qtd}</div>
            <div>$${m.custo}</div>
            ${m.nome}
        `;
        btn.onclick = () => { if (m.qtd > 0) selecionarCarta(m, 'maquina', btn); };
        baralhoMaquinas.appendChild(btn);
    });
}

// Modificando os métodos de plantio/construção para consumir cartas
const plantarOriginal = plantar;
plantar = function(defPlanta, celula) {
    if (defPlanta.qtd > 0) {
        defPlanta.qtd--;
        plantarOriginal(defPlanta, celula);
        atualizarInterfaceCartas();
    }
};

const construirMaquinaOriginal = construirMaquina;
construirMaquina = function(defMaquina, celula) {
    if (defMaquina.qtd > 0) {
        defMaquina.qtd--;
        construirMaquinaOriginal(defMaquina, celula);
        atualizarInterfaceCartas();
    }
};

// Incrementando o loop de tempo para repor cartas e expandir limite
function tickTimer() {
    if (!jogoRodando) return;
    
    tempoRestante--;
    
    // Crescimento das plantas
    plantasAtivas.forEach(p => {
        if (!p.pronta) {
            p.tempoRestante--;
            if (p.tempoRestante <= 0) {
                p.pronta = true;
                p.div.classList.add('pronta');
            }
        }
    });

    // Lógica de repor cartas progressivamente
    contadorReporCartas--;
    if (contadorReporCartas <= 0) {
        contadorReporCartas = tempoParaReporCartas;
        
        // Aumenta a quantidade de 1 carta aleatória de planta e 1 de máquina, respeitando o limite
        const plantasArray = Object.values(DEFINICOES_PLANTAS).filter(p => p.qtd < p.limite);
        if (plantasArray.length > 0) {
            const plantaEscolhida = plantasArray[Math.floor(Math.random() * plantasArray.length)];
            plantaEscolhida.qtd++;
            // Aumenta o limite máximo com o passar do jogo (Ondas avançadas)
            if (ondaAtual > 2) plantaEscolhida.limite++; 
        }

        const maquinasArray = Object.values(DEFINICOES_MAQUINAS).filter(m => m.qtd < m.limite);
        if (maquinasArray.length > 0) {
            const maquinaEscolhida = maquinasArray[Math.floor(Math.random() * maquinasArray.length)];
            maquinaEscolhida.qtd++;
            if (ondaAtual > 3) maquinaEscolhida.limite++;
        }

        atualizarInterfaceCartas();
    }
    
    if (tempoRestante <= 0) {
        passarTurno();
    } else {
        atualizarHUD();
    }
}
// Atualização no main.js (Sistema de Inimigos e Ondas Estéticas)

const TIPOSINIMIGOS = {
    ERVA: { id: 'erva', classe: 'inimigo-erva', hp: 1, vel: 0 },
    LAGARTA: { id: 'lagarta', classe: 'inimigo-lagarta', hp: 3, vel: 0.5 },
    GAFANHOTO: { id: 'gafanhoto', classe: 'inimigo-gafanhoto', hp: 4, vel: 1.0 },
    GRILO: { id: 'grilo', classe: 'inimigo-grilo', hp: 2, vel: 1.5, pula: true },
    BESOURO: { id: 'besouro', classe: 'inimigo-besouro', hp: 15, vel: 0.3 },
    RATO: { id: 'rato', classe: 'inimigo-rato', hp: 5, vel: 1.2 },
    JAVALI: { id: 'javali', classe: 'inimigo-javali', hp: 25, vel: 0.8 },
    JAVALAO: { id: 'javalao', classe: 'inimigo-javalao', hp: 100, vel: 0.2 }
};

function spawnarInimigo(tipo, linha) {
    const celulaOrigem = matrizMapa[linha][0]; 
    const divInimigo = document.createElement('div');
    divInimigo.className = `entidade-inimigo ${tipo.classe}`;
    
    // Adicionar Ectoparasitas esteticamente se for Rato ou Javali
    if (tipo.id === 'rato' || tipo.id === 'javali' || tipo.id === 'javalao') {
        const parasitas = ['pulga', 'carrapato', 'acaro', 'berne'];
        const numParasitas = tipo.id === 'javalao' ? 8 : Math.floor(Math.random() * 3) + 1;
        
        for(let i = 0; i < numParasitas; i++) {
            const divParasita = document.createElement('div');
            const tipoParasita = parasitas[Math.floor(Math.random() * parasitas.length)];
            divParasita.className = `parasita ${tipoParasita}`;
            
            // Posições aleatórias geométricas simples
            divParasita.style.top = `${Math.random() * 60 + 10}%`;
            divParasita.style.left = `${Math.random() * 60 + 10}%`;
            
            divInimigo.appendChild(divParasita);
        }
    }

    celulaOrigem.elementoHTML.appendChild(divInimigo);
    
    inimigosAtivos.push({
        def: tipo,
        elemento: divInimigo,
        x: 0,
        y: linha,
        progressoMovimento: 0
    });
}

function gerenciarSpawnsDaOnda() {
    // Lógica chamada a cada segundo pelo tickTimer()
    if (!jogoRodando) return;
    
    const linhaAleatoria = Math.floor(Math.random() * LINHAS);

    if (ondaAtual === 1) {
        // Onda 1: Ervas nascem em locais terrestres aleatórios
        const xAleatorio = Math.floor(Math.random() * (COLUNAS - 1));
        const cel = matrizMapa[linhaAleatoria][xAleatorio];
        if (cel.tipo === TIPOS_TERRENO.TERRA || cel.tipo === TIPOS_TERRENO.GRAMA) {
             const erva = document.createElement('div');
             erva.className = `entidade-inimigo ${TIPOS_INIMIGOS.ERVA.classe}`;
             cel.elementoHTML.appendChild(erva);
        }
    } else if (ondaAtual === 2 && Math.random() < 0.3) {
        spawnarInimigo(TIPOS_INIMIGOS.LAGARTA, linhaAleatoria);
    } else if (ondaAtual === 3 && Math.random() < 0.2) {
        spawnarInimigo(TIPOS_INIMIGOS.RATO, linhaAleatoria);
    } else if (ondaAtual === 4 && Math.random() < 0.15) {
        spawnarInimigo(TIPOS_INIMIGOS.JAVALI, linhaAleatoria);
    }
}

// Integrar gerenciarSpawnsDaOnda() dentro do tickTimer() original