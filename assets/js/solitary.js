var CARTAS = [
    "c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12",
    "d1","d2","d3","d4","d5","d6","d7","d8","d9","d10","d11","d12",
    "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12",
    "t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12",
];

var TOTAL = 78;
var CONTADOR = [1,2,3,4,5,6,7];

//var cartas = {
//    corazon: [1,2,3,4,5,6,7,8,9,10,11,12],
//    diamante: [1,2,3,4,5,6,7,8,9,10,11,12],
//    trebor: [1,2,3,4,5,6,7,8,9,10,11,12],
//    pica: [1,2,3,4,5,6,7,8,9,10,11,12],
//}

var Solitario = {

    preload: function () {
        // body...

        Game.load.spritesheet('atras', 'assets/imgs/cartas_1.png', 370 / 3, 200, 3);
        Game.load.spritesheet('cartas', 'assets/imgs/cartas_2.png', 126, 202, 48);

        Game.load.json('cartas_json', 'assets/js/cartas_json.json');

        this.cartas = CARTAS;
        
        this.carta_volteada = null;
        this.no_carta = null;
        this.espacio_carta = [];
        this.cartas_volteadas = [];

        this.filas = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        ];

        this.masos = {
            sobrantes: [],
            usadas: [],
        }
        
        // Rellena las 7 filas
        for (var i = 0; i < CONTADOR.length; i++){
            for ( var j = 0; j < CONTADOR[i]; j++){
                var index = Math.floor( Math.random() * this.cartas.length );
                this.filas[i].push(this.cartas[index]);
                this.cartas.splice( index, 1 );
            }
        }

        // Rellena el maso de sobrantes
        var sobrantes = this.cartas.length;

        for (var i = 0; i < sobrantes; i++){
            var index = Math.floor( Math.random() * this.cartas.length );
            this.masos.sobrantes.push(this.cartas[index]);
            this.cartas.splice( index, 1 );
        }
        

    },
    create: function () {
        // body...
        console.log("Columnas");
        console.log(this.filas);
        //console.log("\n\nMaso");
        //console.log(this.masos);
        var cartas_json = Game.cache.getJSON('cartas_json');

        Game.stage.backgroundColor = '#335';

        this.no_carta = Game.add.sprite(20, 10, 'atras');
        this.carta_volteada = Game.add.sprite(20, 10, 'atras');
        this.espacio_carta = [
            Game.add.sprite(318, 10, 'atras'),
            Game.add.sprite(418, 10, 'atras'),
            Game.add.sprite(518, 10, 'atras'),
            Game.add.sprite(618, 10, 'atras'),
        ];


        this.cartas_volteadas = [[],[],[],[],[],[],[]];

        this.no_carta.scale.setTo(0.5);
        this.no_carta.frame = 2;
        
        // Carta volteada
        this.carta_volteada.scale.setTo(0.5);
        this.carta_volteada.frame = 0;
        
        // Espacio donde van las cartas ordenadas
        for (var i = 0; i < this.espacio_carta.length; i++){
            this.espacio_carta[i].scale.setTo(0.5);
            this.espacio_carta[i].frame = 1;
        }

        // Rellena las 7 filas
        for (var i = 0; i < CONTADOR.length; i++){
            for ( var j = 0; j < CONTADOR[i]; j++){
                this.cartas_volteadas[i].push(Game.add.sprite(100 * i + 20, 150 + (5 * j), 'atras'))
                this.cartas_volteadas[i][j].scale.setTo(0.5);
                this.cartas_volteadas[i][j].frame = 0;
                // para arrastrar las cartas
            }
        }
        // Cambia el tamaño de las 7 filas
        //for (var i = 0; i < this.cartas_volteadas.length; i++){
        //    for ( var j = 0; j < CONTADOR[i]; j++){
        //        this.cartas_volteadas[i][j].inputEnabled = true;
        //        this.cartas_volteadas[i][j].input.enableDrag(true);
        //        //Game.Physics.enable(this.cartas_volteadas[i], Phaser.Physics.ARCADE);
        //    }
        //}
        
        for (var i = 0; i < CONTADOR.length; i++){
            for ( var j = 0; j < CONTADOR[i]; j++){
                if (j + 1 == CONTADOR[i]){
                    this.cartas_volteadas[i].push( Game.add.sprite(this.cartas_volteadas[i][j].x, this.cartas_volteadas[i][j].y, 'cartas') )
                    this.cartas_volteadas[i][j + 1].scale.setTo(0.5);
                    console.log(this.cartas_volteadas[i][j + 1]);
                    this.cartas_volteadas[i][j + 1].frame = cartas_json[ this.filas[i][j] ].frame;
                    this.cartas_volteadas[i][j].kill();
                }
            }
        }

        console.log("Iniciado");
    },
    update: function () {
        // body...


    },
    render: function () {
        // body...
        Game.debug.inputInfo(32,32);
    },
};