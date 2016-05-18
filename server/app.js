var express = require('express'),
    app = express();
var fs = require('fs');
var _ = require('underscore');
// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
  jogador : JSON.parse(fs.readFileSync('server/data/jogadores.json')),
  jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', 'server/views');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.get('/', function(request, response) {
  response.render('index', db.jogador);
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:id/',function(req, response){
    var pf = _.find(db.jogador.players, function(el){return el.steamid === req.params.id});
    var jog = db.jogosPorJogador[req.params.id];
    jog.not = _.where(jog.games, { playtime_forever: 0 }).length;
    jog.games = _.sortBy(jog.games, function(el) {
     return -el.playtime_forever;
    });
     jog.at=jog.games;
    jog.at = _.first(jog.at, 5);

    jog.at = _.map(jog.at, function(el) {
      el.playtime_forever_h = Math.round(el.playtime_forever/60);
      return el;
    });

    response.render('jogador', {
    profile: pf,
    gameInfo: jog,
    favorite: jog.games[0]
    });



});

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
var server = app.listen(3000, function () {
  console.log('Escutando em: http://localhost:3000');
});
