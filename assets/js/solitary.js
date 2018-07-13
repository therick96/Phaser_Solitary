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

        Game.load.spritesheet('atras', 'assets/imgs/cartas_1.png', 124, 200, 3);
        Game.load.spritesheet('cartas', 'assets/imgs/cartas_2.png', 124, 200, 48);

        Game.load.json('cartas_json', 'assets/js/cartasjson.json');

        this.cartas = CARTAS;
        this.carta_pos_inicial = {x: null, y: null};
        
        this.maso_sobrante = [];
        this.maso_sobrante_usado = [];
        this.no_carta = null;
        this.espacio_carta = [];
        this.cartas_volteadas = [];
        this.carta_superior = {carta: null, };

        this.filas = [[],[],[],[],[],[],[]];

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
        this.cartas_json = Game.cache.getJSON('cartas_json');

        Game.stage.backgroundColor = '#335';

        this.no_carta = Game.add.sprite(20, 10, 'atras');
        this.espacio_carta = [
            Game.add.sprite(318, 10, 'atras'),
            Game.add.sprite(418, 10, 'atras'),
            Game.add.sprite(518, 10, 'atras'),
            Game.add.sprite(618, 10, 'atras'),
        ];


        this.cartas_volteadas = [[],[],[],[],[],[],[]];
        
        // Maso Vacio
        this.no_carta.scale.setTo(0.5);
        this.no_carta.frame = 2;
        this.no_carta.inputEnabled = true;
        this.no_carta.events.onInputDown.add(this.pulsa_maso_vacio, this);
        
        // Maso de cartas sobrantes
        for (var i = 0; i < this.masos.sobrantes.length; i++){
            this.maso_sobrante.push( Game.add.sprite(20, 10 + ( i * 0.5 ), 'atras') );
            this.maso_sobrante[i].scale.setTo(0.5);
            this.maso_sobrante[i].frame = 0;
            this.maso_sobrante[i].inputEnabled = true;
            this.maso_sobrante[i].events.onInputDown.add(this.pulsa_maso_cartas, this);
        }

        
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
            }
        }
        
        // Voltea las primeras cartas de las columnas
        for (var i = 0; i < CONTADOR.length; i++){
            for ( var j = 0; j < CONTADOR[i]; j++){
                if (j + 1 == CONTADOR[i]){
                    var sig = j + 1;
                    this.cartas_volteadas[i].push( Game.add.sprite(this.cartas_volteadas[i][j].x, this.cartas_volteadas[i][j].y, 'cartas') )
                    this.cartas_volteadas[i][sig].scale.setTo(0.5);
                    this.cartas_volteadas[i][sig].frame = this.cartas_json[ this.filas[i][j] ].frame;
                    // para arrastrar las cartas
                    this.cartas_volteadas[i][sig].inputEnabled = true;
                    this.cartas_volteadas[i][sig].input.enableDrag(true);
                    this.cartas_volteadas[i][sig].events.onDragStart.add(this.input_carta_on, this);
                    this.cartas_volteadas[i][sig].events.onDragStop.add(this.input_carta_off, this);
                    //this.cartas_volteadas[i][sig].prototype.name = this.filas[i][j];
                    Game.physics.enable( this.cartas_volteadas[i][sig], Phaser.Physics.ARCADE );
                    //console.log(this.cartas_volteadas[i][j + 1]);
                    
                    this.cartas_volteadas[i][sig].DATOS = {
                        name: this.filas[i][j],
                        index: {i: i, j: j + 1},
                        value: this.cartas_json[ this.filas[i][j] ].valor,
                        color: this.cartas_json[ this.filas[i][j] ].color,
                        tipo: this.cartas_json[ this.filas[i][j] ].tipo,
                        lugar: "col",
                    };

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
        Game.debug.inputInfo(32,350);
    },
    input_carta_on: function (carta, punto, x, y) {
        this.carta_pos_inicial = {x: x, y: y};
        Game.world.bringToTop(carta);
    },
    input_carta_off: function (carta, punto) {
        
        let colision = false;
        let index_colision = null;
        for (var i = 0; i < CONTADOR.length; i++){
            colision =  Game.physics.arcade.overlap(
                            carta,
                            this.cartas_volteadas[i][ this.cartas_volteadas[i].length - 1 ], 
                            this.colision_cartas, 
                            null, this
                        );
            if (colision){
                colision = this.cartas_volteadas[i][ this.cartas_volteadas[i].length - 1 ];
                break;
            }
        }
        if (colision){
            let index_carta = null;
            let si_carta = false;

            // Busca en las cartas que hay ordenadas en las columnas
            if (carta.DATOS.lugar == "col"){

                const CARTA = this.colocar_carta(  carta, colision, "columnas");
                if (CARTA){
                    this.cartas_volteadas[CARTA.DATOS.index.i][CARTA.DATOS.index.j].addChild(carta);
                    this.cartas_volteadas[CARTA.DATOS.index.i].push(carta);
                    carta.DATOS.index = {
                        i: CARTA.DATOS.index.i,
                        j: CARTA.DATOS.index.j +1,
                    };
                    carta.scale.setTo(1);
                    carta.x = 0;
                    carta.y = 30;
                    console.log(this.cartas_volteadas);                
                    return;
                }
            }else{
                console.log("SiCarta");
                const CARTA = this.colocar_carta(  carta, colision, "maso" );
                if (CARTA){
                    console.log("Actualizando");
                    this.cartas_volteadas[CARTA.DATOS.index.i][CARTA.DATOS.index.j].addChild(carta);
                    carta.scale.setTo(1);
                    carta.DATOS.index = {
                        i: CARTA.DATOS.index.i,
                        j: CARTA.DATOS.index.j +1,
                    };
                    carta.x = 0;
                    carta.y = 30;
                    console.log(this.cartas_volteadas);                
                    return;
                }
            }
        }
        //if (colision == false){
        carta.x = this.carta_pos_inicial.x;
        carta.y = this.carta_pos_inicial.y;
        console.log("No COlisiona");                
        console.log(this.cartas_volteadas);                
        //}

    },
    pulsa_maso_cartas: function (carta, pointer) {
        // body...
        const Ultima_carta = this.masos.sobrantes.length - 1;
        this.masos.usadas.push(this.masos.sobrantes.pop());
        
        const index_carta = this.masos.usadas.length - 1;
        this.maso_sobrante_usado.push( Game.add.sprite( 120, 10 + (( index_carta ) * 0.5), 'cartas'));
        
        this.maso_sobrante_usado[index_carta].scale.setTo(0.5);
        this.maso_sobrante_usado[index_carta].frame = this.cartas_json[ this.masos.usadas[index_carta] ].frame;
        this.maso_sobrante_usado[index_carta].inputEnabled = true;
        this.maso_sobrante_usado[index_carta].input.enableDrag(true);
        this.maso_sobrante_usado[index_carta].events.onDragStart.add(this.input_carta_on, this);
        this.maso_sobrante_usado[index_carta].events.onDragStop.add(this.input_carta_off, this);

        Game.physics.enable( this.maso_sobrante_usado[index_carta], Phaser.Physics.ARCADE );

        this.maso_sobrante_usado[index_carta].DATOS = {
                        name: this.masos.usadas[index_carta],
                        index: {i: index_carta, j: -1},
                        value: this.cartas_json[ this.masos.usadas[index_carta] ].valor,
                        color: this.cartas_json[ this.masos.usadas[index_carta] ].color,
                        tipo: this.cartas_json[ this.masos.usadas[index_carta] ].tipo,
                        lugar: "maso",
                    };
        //console.log(this.maso_sobrante_usado[index_carta].DATOS);
        
        carta.kill();

        console.log("Pulsa Carta");
    },
    pulsa_maso_vacio: function (carta, pointer) {
        // body...
        this.maso_sobrante = [];

        const TAMANO_USADAS = this.masos.usadas.length;
        for (var i = 0; i < TAMANO_USADAS; i++){
            this.masos.sobrantes.push( this.masos.usadas.pop() );
            this.maso_sobrante_usado[i].kill();

            this.maso_sobrante.push( Game.add.sprite(20, 10 + ( i * 0.5 ), 'atras') );
            this.maso_sobrante[i].scale.setTo(0.5);
            this.maso_sobrante[i].frame = 0;
            this.maso_sobrante[i].inputEnabled = true;
            this.maso_sobrante[i].events.onInputDown.add(this.pulsa_maso_cartas, this);
        }
        this.maso_sobrante_usado = [];
        

        console.log("Pulsa Vacio");
    },
    colision_cartas: function (carta_movible, carta_superior) {
        // body...
        this.carta_superior.carta = carta_superior;
    },
    colocar_carta: function (carta_mueve, carta_padre, monton) {
        // body...
        //console.log(carta_mueve);
        const carta = this.verificar_hijos(carta_padre);
        const cartas = {
            carta_1: carta_mueve.DATOS,
            carta_2: carta.DATOS,
        };
        console.log(cartas);
        console.log(carta);
        if (cartas.carta_1.value + 1 == cartas.carta_2.value){
            if (cartas.carta_1.color != cartas.carta_2.color){
                if (monton != "maso"){
                    console.log("Actualizar Carta");
                    this.filas[cartas.carta_2.index.i].push(
                        this.filas[cartas.carta_1.index.i][cartas.carta_1.index.j]
                    );
                    this.filas[cartas.carta_1.index.i].splice(cartas.carta_1.index.j, 1);
                    this.cartas_volteadas[cartas.carta_1.index.i].splice(cartas.carta_1.index.j, 1);
                    console.log(this.filas);
                    return (carta);
                }else{
                
                    console.log("Actualizar Carta");
                    this.filas[cartas.carta_2.index.i].push(
                        this.masos.usadas[cartas.carta_1.index.i]
                    );
                    this.masos.usadas.splice(cartas.carta_1.index.i, 1);
                    this.maso_sobrante_usado.splice(cartas.carta_1.index.i, 1);
                    return (carta);                
                }
            }
        }
        
        return (false);
    },
    verificar_hijos: function (carta) {
        // body...
        if (carta.children.length <= 0){
            return carta;
        }else{
            return this.verificar_hijos(carta.children[0]);
        }
    }
};