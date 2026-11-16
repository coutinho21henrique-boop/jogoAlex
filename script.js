// DUelo ARCANO — Super Trunfo + alternância de quem escolhe o atributo.
// Configuração atual: Dragão = Super Trunfo; Guerreiro = carta nº 1.
const cartas = [
 {nome:"Guerreiro",forca:7,mana:3,arcano:4,tipo:"GUERREIRO",simbolo:"⚔",imagem:"assets/guerreiro.jpg",numero:1},
 {nome:"Monge",forca:4,mana:7,arcano:5,tipo:"MAGO ESPIRITUAL",simbolo:"✦",imagem:"assets/monge.jpg",numero:2},
 {nome:"Tanque",forca:6,mana:4,arcano:3,tipo:"GUARDIÃO",simbolo:"🛡",imagem:"assets/tanque.webp",numero:3},
 {nome:"Guarda",forca:5,mana:3,arcano:4,tipo:"PROTETOR",simbolo:"🎖",imagem:"assets/guarda.jpg",numero:4},
 {nome:"Ladrão",forca:3,mana:5,arcano:6,tipo:"LÂMINA SOMBRIA",simbolo:"🗡",imagem:"assets/ladrao.jpg",numero:5},
 {nome:"Dragão",forca:10,mana:6,arcano:8,tipo:"DRAGÃO MÍSTICO",simbolo:"🐉",imagem:"assets/dragao.jpg",numero:6,superTrunfo:true}
];
let pontosJogador=0,pontosBot=0,empates=0;
let vezEscolha="jogador",cartaJogador=null,cartaBot=null,aguardandoAtributo=false;
const nomes={forca:"Força",mana:"Mana",arcano:"Arcano"};

function criarArte(c){
 return `<div class="arte-carta"><img src="${c.imagem}" alt="Ilustração de ${c.nome}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div class="placeholder-arte" style="display:none"><span class="simbolo">${c.simbolo}</span><small>ESPAÇO PARA ILUSTRAÇÃO 2D</small></div></div>`;
}
function mostrarCartas(){
 const area=document.getElementById("cartas"); area.innerHTML="";
 cartas.forEach((c,i)=>{
  const b=document.createElement("button"); b.type="button"; b.className="carta";
  b.innerHTML=`<div class="carta-nome">${c.nome}</div>${criarArte(c)}<div class="atributos"><p class="atributo">FORÇA <strong>${c.forca}</strong></p><p class="atributo">MANA <strong>${c.mana}</strong></p><p class="atributo">ARCANO <strong>${c.arcano}</strong></p></div><p class="tipo-carta">${c.superTrunfo?"★ SUPER TRUNFO ★":c.tipo}</p>`;
  b.addEventListener("click",()=>escolherCarta(i)); area.appendChild(b);
 });
}
function escolherCarta(i){
 if(aguardandoAtributo)return;
 cartaJogador=cartas[i];
 let j; do{j=Math.floor(Math.random()*cartas.length)}while(j===i);
 cartaBot=cartas[j]; mostrarArena();
 if(vezEscolha==="jogador"){
  aguardandoAtributo=true;
  document.getElementById("avisoTurno").textContent="SUA VEZ! Escolha o atributo da rodada.";
  document.getElementById("resultado").textContent="Escolha Força, Mana ou Arcano.";
  document.getElementById("opcoesAtributo").classList.remove("oculto");
 }else{
  const a=["forca","mana","arcano"][Math.floor(Math.random()*3)];
  document.getElementById("avisoTurno").textContent=`VEZ DO ADVERSÁRIO! O robô escolheu ${nomes[a].toUpperCase()}.`;
  resolverRodada(a);
 }
}
function mostrarArena(){
 document.getElementById("cartaJogador").className="carta-arena";
 document.getElementById("cartaBot").className="carta-arena";
 document.getElementById("cartaJogador").innerHTML=resumo(cartaJogador);
 document.getElementById("cartaBot").innerHTML=resumo(cartaBot);
}
function resumo(c){
 return `<h3>${c.nome}</h3>${c.superTrunfo?'<p class="selo-especial">★ SUPER TRUNFO ★</p>':""}<p>Força: ${c.forca}</p><p>Mana: ${c.mana}</p><p>Arcano: ${c.arcano}</p><p><strong>${c.numero===1?"CARTA Nº 1":"Nº "+c.numero}</strong></p>`;
}
function resolverRodada(a){
 if(!cartaJogador||!cartaBot)return;
 aguardandoAtributo=false; document.getElementById("opcoesAtributo").classList.add("oculto");
 let vencedor=null,m="";
 const js=!!cartaJogador.superTrunfo,bs=!!cartaBot.superTrunfo;
 const j1=cartaJogador.numero===1,b1=cartaBot.numero===1;
 if(js&&b1){vencedor="bot";m="A CARTA Nº 1 DO ADVERSÁRIO DERROTOU SEU SUPER TRUNFO!";}
 else if(bs&&j1){vencedor="jogador";m="SUA CARTA Nº 1 DERROTOU O SUPER TRUNFO DO ADVERSÁRIO!";}
 else if(js&&!bs){vencedor="jogador";m="SUPER TRUNFO! Sua carta venceu automaticamente a rodada.";}
 else if(bs&&!js){vencedor="bot";m="SUPER TRUNFO DO ADVERSÁRIO! O robô venceu automaticamente.";}
 else{
  const vj=cartaJogador[a],vb=cartaBot[a];
  if(vj>vb){vencedor="jogador";m=`VITÓRIA! ${nomes[a]}: ${vj} contra ${vb}.`;}
  else if(vb>vj){vencedor="bot";m=`DERROTA! ${nomes[a]}: ${vb} contra ${vj}.`;}
  else m=`EMPATE! ${nomes[a]}: ambos marcaram ${vj}.`;
 }
 if(vencedor==="jogador")pontosJogador++;else if(vencedor==="bot")pontosBot++;else empates++;
 atualizarPlacar(); document.getElementById("resultado").textContent=m;
 vezEscolha=vezEscolha==="jogador"?"bot":"jogador";
 document.getElementById("avisoTurno").textContent=vezEscolha==="jogador"?"PRÓXIMA RODADA: sua vez de escolher o atributo.":"PRÓXIMA RODADA: o adversário escolherá um atributo aleatório.";
}
function atualizarPlacar(){
 document.getElementById("pontosJogador").textContent=pontosJogador;
 document.getElementById("pontosBot").textContent=pontosBot;
 document.getElementById("empates").textContent=empates;
}
function reiniciarPlacar(){
 pontosJogador=0;pontosBot=0;empates=0;vezEscolha="jogador";cartaJogador=null;cartaBot=null;aguardandoAtributo=false;atualizarPlacar();
 for(const id of ["cartaJogador","cartaBot"]){const el=document.getElementById(id);el.className="carta-arena vazia";el.innerHTML=id==="cartaJogador"?'<span class="selo-vazio">?</span><p>Aguardando escolha</p>':'<span class="selo-vazio">?</span><p>Aguardando desafio</p>';}
 document.getElementById("avisoTurno").textContent="SUA VEZ! Você começa escolhendo o atributo.";
 document.getElementById("resultado").textContent="Placar reiniciado. Escolha uma carta!";
 document.getElementById("opcoesAtributo").classList.remove("oculto");
}
document.querySelectorAll("#opcoesAtributo button").forEach(b=>b.addEventListener("click",()=>{if(aguardandoAtributo)resolverRodada(b.dataset.atributo)}));
document.getElementById("reiniciar").addEventListener("click",reiniciarPlacar);
document.getElementById("avisoTurno").textContent="SUA VEZ! Você começa escolhendo o atributo.";
document.getElementById("opcoesAtributo").classList.remove("oculto");
mostrarCartas();
