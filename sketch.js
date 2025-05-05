// Constantes do jogo
const TAMANHO_CELULA = 64;
const LARGURA_MAPA = 15;
const ALTURA_MAPA = 10;

// Estados do jogo
const ESTADO = {
  MENU: 0,
  JOGANDO: 1,
  INVENTARIO: 2,
  LOJA_CIDADE: 3,
  LOJA_CAMPO: 4,
  VITORIA: 5
};

// Personagem principal
let jogador = {
  x: 2,
  y: 5,
  direcao: 0, // 0: baixo, 1: esquerda, 2: direita, 3: cima
  sprite: [],
  inventario: [],
  dinheiro: 100,
  energia: 100,
  dia: 1
};

// Mapas e objetos
let mapaCampo = [];
let mapaCidade = [];
let objetosJogo = [];
let npcs = [];

// Recursos
let imagens = {
  personagem: null,
  campo: null,
  cidade: null,
  itens: null
};

// Configuração inicial
function preload() {
  // Carregar sprites (seriam arquivos reais no projeto final)
  // imagens.personagem = loadImage('personagem.png');
  // imagens.campo = loadImage('campo.png');
  // imagens.cidade = loadImage('cidade.png');
  // imagens.itens = loadImage('itens.png');
}

function setup() {
  createCanvas(LARGURA_MAPA * TAMANHO_CELULA, ALTURA_MAPA * TAMANHO_CELULA);
  textFont('Arial');
  
  // Inicializar mapas
  inicializarMapas();
  
  // Inicializar objetos do jogo
  inicializarObjetos();
  
  // Inicializar NPCs
  inicializarNPCs();
  
  // Estado inicial
  estadoJogo = ESTADO.MENU;
}

function draw() {
  background(220);
  
  switch(estadoJogo) {
    case ESTADO.MENU:
      desenharMenu();
      break;
    case ESTADO.JOGANDO:
      desenharJogo();
      atualizarJogo();
      break;
    case ESTADO.INVENTARIO:
      desenharJogo();
      desenharInventario();
      break;
    case ESTADO.LOJA_CIDADE:
      desenharLojaCidade();
      break;
    case ESTADO.LOJA_CAMPO:
      desenharLojaCampo();
      break;
    case ESTADO.VITORIA:
      desenharTelaVitoria();
      break;
  }
  
  // Mostrar informações do jogador
  if (estadoJogo !== ESTADO.MENU && estadoJogo !== ESTADO.VITORIA) {
    desenharHUD();
  }
}

function inicializarMapas() {
  // Mapa do campo (0 = grama, 1 = terra arável, 2 = água)
  mapaCampo = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], // Rio divisório
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];
  
  // Mapa da cidade (3 = estrada, 4 = prédio)
  mapaCidade = [
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,3,3,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,3,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,3,3,3,3,3,3,3,3,3,3,3,3,4],
    [4,3,3,3,3,3,3,3,3,3,3,3,3,3,4],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], // Rio divisório
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ];
}

function inicializarObjetos() {
  // Objetos do campo
  objetosJogo = [
    { tipo: "arvore", x: 3, y: 2, sprite: 0, interagivel: true },
    { tipo: "arvore", x: 7, y: 3, sprite: 0, interagivel: true },
    { tipo: "pedra", x: 5, y: 4, sprite: 1, interagivel: true },
    { tipo: "loja_campo", x: 1, y: 1, sprite: 2, interagivel: true },
    
    // Objetos da cidade
    { tipo: "loja_cidade", x: 13, y: 2, sprite: 3, interagivel: true },
    { tipo: "prefeitura", x: 10, y: 3, sprite: 4, interagivel: false },
    { tipo: "banco", x: 7, y: 2, sprite: 5, interagivel: false }
  ];
}

function inicializarNPCs() {
  npcs = [
    { nome: "Fazendeiro João", x: 4, y: 4, sprite: 6, dialogo: "Preciso levar meus produtos para a cidade!", movendo: true },
    { nome: "Comerciante Ana", x: 12, y: 3, sprite: 7, dialogo: "Traz produtos do campo que eu te pago bem!", movendo: false },
    { nome: "Técnico Carlos", x: 8, y: 2, sprite: 8, dialogo: "Posso te vender equipamentos para melhorar sua fazenda!", movendo: true }
  ];
}

function desenharMenu() {
  // Fundo
  fill(34, 139, 34); // Verde campo
  rect(0, 0, width, height/2);
  fill(169, 169, 169); // Cinza cidade
  rect(0, height/2, width, height/2);
  
  // Título
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Conexão Campo-Cidade", width/2, height/4);
  text("A Jornada do Agricultor", width/2, height/4 + 40);
  
  // Botão iniciar
  fill(210, 180, 140);
  rect(width/2 - 100, height/2 + 50, 200, 50, 10);
  fill(0);
  textSize(20);
  text("Iniciar Jogo", width/2, height/2 + 75);
  
  // Controles
  textSize(14);
  text("Use WASD para mover, E para interagir, I para inventário", width/2, height - 30);
}

function desenharJogo() {
  // Desenhar mapa atual (campo ou cidade)
  let mapaAtual = (jogador.y < 5) ? mapaCidade : mapaCampo;
  
  for (let y = 0; y < ALTURA_MAPA; y++) {
    for (let x = 0; x < LARGURA_MAPA; x++) {
      // Cores baseadas no tipo de terreno
      switch(mapaAtual[y][x]) {
        case 0: fill(144, 238, 144); break; // Grama clara
        case 1: fill(139, 69, 19); break;    // Terra arável
        case 2: fill(30, 144, 255); break;   // Água
        case 3: fill(105, 105, 105); break;  // Estrada
        case 4: fill(70, 70, 70); break;     // Prédio
      }
      
      noStroke();
      rect(x * TAMANHO_CELULA, y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    }
  }
  
  // Desenhar objetos
  for (let obj of objetosJogo) {
    fill(100, 100, 100);
    // Aqui seria o desenho do sprite real
    rect(obj.x * TAMANHO_CELULA, obj.y * TAMANHO_CELULA, TAMANHO_CELULA, TAMANHO_CELULA);
    fill(255);
    textSize(10);
    text(obj.tipo, obj.x * TAMANHO_CELULA + 10, obj.y * TAMANHO_CELULA + 20);
  }
  
  // Desenhar NPCs
  for (let npc of npcs) {
    fill(0, 0, 255);
    // Aqui seria o desenho do sprite real
    ellipse(npc.x * TAMANHO_CELULA + TAMANHO_CELULA/2, npc.y * TAMANHO_CELULA + TAMANHO_CELULA/2, TAMANHO_CELULA/2);
    fill(255);
    textSize(8);
    text(npc.nome, npc.x * TAMANHO_CELULA + 10, npc.y * TAMANHO_CELULA + 10);
  }
  
  // Desenhar jogador
  fill(255, 0, 0);
  // Aqui seria o desenho do sprite real com direção
  let jogadorX = jogador.x * TAMANHO_CELULA + TAMANHO_CELULA/2;
  let jogadorY = jogador.y * TAMANHO_CELULA + TAMANHO_CELULA/2;
  triangle(
    jogadorX, jogadorY - TAMANHO_CELULA/3,
    jogadorX - TAMANHO_CELULA/3, jogadorY + TAMANHO_CELULA/3,
    jogadorX + TAMANHO_CELULA/3, jogadorY + TAMANHO_CELULA/3
  );
}

function atualizarJogo() {
  // Atualizar NPCs móveis
  for (let npc of npcs) {
    if (npc.movendo && frameCount % 60 === 0) {
      npc.x += floor(random(-1, 2));
      npc.y += floor(random(-1, 2));
      
      // Limitar movimento dentro do mapa
      npc.x = constrain(npc.x, 1, LARGURA_MAPA - 2);
      npc.y = constrain(npc.y, 1, (jogador.y < 5) ? 4 : ALTURA_MAPA - 2);
    }
  }
  
  // Verificar se ganhou o jogo (condição de vitória)
  if (jogador.dinheiro >= 1000 && jogador.inventario.some(item => item.tipo === "tecnologia")) {
    estadoJogo = ESTADO.VITORIA;
  }
}

function desenharHUD() {
  // Barra de status
  fill(0, 0, 0, 150);
  rect(10, 10, 200, 80, 5);
  
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Dia: ${jogador.dia}`, 20, 20);
  text(`Dinheiro: $${jogador.dinheiro}`, 20, 40);
  text(`Energia: ${jogador.energia}/100`, 20, 60);
  
  // Aviso de área
  textAlign(CENTER, TOP);
  if (jogador.y < 5) {
    text("CIDADE - Venda produtos do campo", width/2, 10);
  } else {
    text("CAMPO - Cultive e colete recursos", width/2, 10);
  }
}

function desenharInventario() {
  // Fundo semi-transparente
  fill(0, 0, 0, 200);
  rect(width/2 - 200, height/2 - 200, 400, 400, 10);
  
  // Título
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Inventário", width/2, height/2 - 180);
  
  // Itens
  textSize(16);
  if (jogador.inventario.length === 0) {
    text("Seu inventário está vazio!", width/2, height/2);
  } else {
    for (let i = 0; i < jogador.inventario.length; i++) {
      let item = jogador.inventario[i];
      text(`${item.tipo} (${item.quantidade})`, width/2, height/2 - 120 + i * 30);
    }
  }
  
  // Instrução
  textSize(14);
  text("Pressione I para fechar", width/2, height/2 + 150);
}

function desenharLojaCidade() {
  // Fundo semi-transparente
  fill(70, 70, 70, 220);
  rect(width/2 - 250, height/2 - 200, 500, 400, 10);
  
  // Título
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Loja da Cidade", width/2, height/2 - 180);
  
  // Itens à venda
  textSize(16);
  text("1. Tecnologia Agrícola - $300", width/2, height/2 - 120);
  text("2. Fertilizante - $50", width/2, height/2 - 80);
  text("3. Sementes Melhoradas - $80", width/2, height/2 - 40);
  
  // Seção de venda
  text("--- Vender Produtos ---", width/2, height/2 + 20);
  text("4. Colheitas - $20 cada", width/2, height/2 + 60);
  text("5. Madeira - $10 cada", width/2, height/2 + 100);
  
  // Instruções
  textSize(14);
  text("Pressione ESC para sair", width/2, height/2 + 160);
}

function desenharLojaCampo() {
  // Fundo semi-transparente
  fill(139, 69, 19, 220);
  rect(width/2 - 250, height/2 - 200, 500, 400, 10);
  
  // Título
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Loja do Campo", width/2, height/2 - 180);
  
  // Itens à venda
  textSize(16);
  text("1. Enxada - $30", width/2, height/2 - 120);
  text("2. Sementes Básicas - $10", width/2, height/2 - 80);
  text("3. Balde de Água - $15", width/2, height/2 - 40);
  
  // Instruções
  textSize(14);
  text("Pressione ESC para sair", width/2, height/2 + 160);
}

function desenharTelaVitoria() {
  // Fundo
  fill(255, 215, 0);
  rect(0, 0, width, height);
  
  // Mensagem
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Parabéns!", width/2, height/2 - 60);
  text("Você criou uma conexão perfeita", width/2, height/2);
  text("entre o Campo e a Cidade!", width/2, height/2 + 40);
  
  // Estatísticas
  textSize(20);
  text(`Dias jogados: ${jogador.dia}`, width/2, height/2 + 100);
  text(`Dinheiro acumulado: $${jogador.dinheiro}`, width/2, height/2 + 140);
  
  // Botão reiniciar
  fill(34, 139, 34);
  rect(width/2 - 100, height/2 + 200, 200, 50, 10);
  fill(255);
  textSize(20);
  text("Jogar Novamente", width/2, height/2 + 225);
}

function keyPressed() {
  if (estadoJogo === ESTADO.MENU && key === ' ') {
    estadoJogo = ESTADO.JOGANDO;
    return;
  }
  
  if (estadoJogo === ESTADO.VITORIA && key === ' ') {
    reiniciarJogo();
    return;
  }
  
  if (estadoJogo === ESTADO.JOGANDO) {
    // Movimentação
    let novoX = jogador.x;
    let novoY = jogador.y;
    
    if (key === 'w' || key === 'W') {
      novoY--;
      jogador.direcao = 3;
    } else if (key === 's' || key === 'S') {
      novoY++;
      jogador.direcao = 0;
    } else if (key === 'a' || key === 'A') {
      novoX--;
      jogador.direcao = 1;
    } else if (key === 'd' || key === 'D') {
      novoX++;
      jogador.direcao = 2;
    } else if (key === 'e' || key === 'E') {
      interagir();
      return;
    } else if (key === 'i' || key === 'I') {
      estadoJogo = ESTADO.INVENTARIO;
      return;
    }
    
    // Verificar colisões
    if (podeMover(novoX, novoY)) {
      jogador.x = novoX;
      jogador.y = novoY;
      jogador.energia = max(0, jogador.energia - 1);
      
      // Passar o dia
      if (jogador.energia <= 0) {
        jogador.dia++;
        jogador.energia = 100;
      }
    }
  } else if (estadoJogo === ESTADO.INVENTARIO && (key === 'i' || key === 'I')) {
    estadoJogo = ESTADO.JOGANDO;
  } else if ((estadoJogo === ESTADO.LOJA_CIDADE || estadoJogo === ESTADO.LOJA_CAMPO) && key === 'Escape') {
    estadoJogo = ESTADO.JOGANDO;
  }
}

function podeMover(x, y) {
  // Limites do mapa
  if (x < 0 || x >= LARGURA_MAPA || y < 0 || y >= ALTURA_MAPA) return false;
  
  // Verificar se há objetos sólidos na posição
  for (let obj of objetosJogo) {
    if (obj.x === x && obj.y === y && !obj.interagivel) return false;
  }
  
  return true;
}

function interagir() {
  // Verificar objetos próximos
  for (let obj of objetosJogo) {
    if (dist(jogador.x, jogador.y, obj.x, obj.y) < 1.5 && obj.interagivel) {
      if (obj.tipo === "loja_cidade") {
        estadoJogo = ESTADO.LOJA_CIDADE;
      } else if (obj.tipo === "loja_campo") {
        estadoJogo = ESTADO.LOJA_CAMPO;
      } else if (obj.tipo === "arvore" && jogador.energia >= 10) {
        // Cortar árvore
        jogador.energia -= 10;
        adicionarItem("madeira", 1);
        obj.interagivel = false; // Árvore cortada
      } else if (obj.tipo === "pedra" && jogador.energia >= 15) {
        // Minerar pedra
        jogador.energia -= 15;
        adicionarItem("pedra", 1);
        obj.interagivel = false; // Pedra minerada
      }
      return;
    }
  }
  
  // Verificar NPCs próximos
  for (let npc of npcs) {
    if (dist(jogador.x, jogador.y, npc.x, npc.y) < 1.5) {
      // Mostrar diálogo
      fill(0, 0, 0, 200);
      rect(width/2 - 200, height - 100, 400, 80, 10);
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(npc.dialogo, width/2, height - 60);
      return;
    }
  }
  
  // Interagir com terreno (plantar, colher, etc.)
  let mapaAtual = (jogador.y < 5) ? mapaCidade : mapaCampo;
  if (mapaAtual[jogador.y][jogador.x] === 1 && jogador.energia >= 5) { // Terra arável
    jogador.energia -= 5;
    adicionarItem("colheita", 1);
  }
}

function adicionarItem(tipo, quantidade) {
  // Verificar se já tem o item
  for (let item of jogador.inventario) {
    if (item.tipo === tipo) {
      item.quantidade += quantidade;
      return;
    }
  }
  
  // Adicionar novo item
  jogador.inventario.push({ tipo, quantidade });
}

function reiniciarJogo() {
  jogador = {
    x: 2,
    y: 5,
    direcao: 0,
    inventario: [],
    dinheiro: 100,
    energia: 100,
    dia: 1
  };
  
  inicializarObjetos();
  estadoJogo = ESTADO.JOGANDO;
}

function mousePressed() {
  if (estadoJogo === ESTADO.MENU) {
    // Verificar clique no botão iniciar
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 + 50 && mouseY < height/2 + 100) {
      estadoJogo = ESTADO.JOGANDO;
    }
  } else if (estadoJogo === ESTADO.VITORIA) {
    // Verificar clique no botão reiniciar
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 + 200 && mouseY < height/2 + 250) {
      reiniciarJogo();
    }
  }
}