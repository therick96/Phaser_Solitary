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

        //Game.load.spritesheet('atras', 'assets/imgs/cartas_1.png', 124, 200, 3);
        Game.load.spritesheet('cartas', 'assets/imgs/cartas_2.png', 124, 200, 51);

        Game.load.json('cartas_json', 'assets/js/cartasjson.json');

        this.cartas = CARTAS;
        this.carta_pos_inicial = {x: null, y: null};
        
        this.maso_sobrantes = [];
        this.maso_sobrante_usado = [];
        this.no_carta = null;
        this.espacio_carta = [];
        this.cartas_volteadas = [];
        this.carta_superior = {carta: null, };
        this.espacio_columnas = [];

        this.filas = [[],[],[],[],[],[],[]];

        this.masos = {
            sobrantes: [],
            usadas: [],
        }
        
        /*// Rellena las 7 filas
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
        }*/
        
    },
    create: function () {
        // body...
        console.log("Columnas");
        console.log(this.filas);
        //console.log("\n\nMaso");
        //console.log(this.masos);
        this.cartas_json = Game.cache.getJSON('cartas_json');

        Game.stage.backgroundColor = '#335';

        this.no_carta = Game.add.sprite(20, 10, 'cartas');
        this.no_carta.scale.setTo(0.8);
        this.no_carta.frame = 50;

        for (var i = 0; i < 4; i++){
            this.espacio_carta.push(Game.add.sprite(350 + (i * 110), 10, 'cartas'));
            this.espacio_carta[i].datos = {
                tipo: "meta",
            };
            this.espacio_carta[i].scale.setTo(0.8);
            this.espacio_carta[i].frame = 49;
        }

        for (var i = 0; i < 7; i++){
            this.espacio_columnas.push( Game.add.sprite(20 + (i * 110), 200, 'cartas') );
            this.espacio_columnas[i].scale.setTo(0.8);
            this.espacio_columnas[i].frame = 49;
            this.espacio_columnas[i].tipo = "fila_vacia";
            Game.physics.enable( this.espacio_columnas[i], Phaser.Physics.ARCADE );
            //for ( var j = 0; j < CONTADOR[i]; j++){
            //    var index = Math.floor( Math.random() * this.cartas.length );
//
//            //    this.filas[i].push(this.cartas[index]);
//            //    this.cartas.splice( index, 1 );
            //}
        }


            //this.espacio_columnas[i].inputEnabled = true;
            //Game.physics.enable( this.espacio_columnas[i], Phaser.Physics.ARCADE );
//
//            //for ( var j = 0; j < CONTADOR[i]; j++){
//            //    this.cartas_volteadas[i].push(Game.add.sprite(100 * i + 20, 150 + (5 * j), 'atras'))
//            //    this.cartas_volteadas[i][j].scale.setTo(0.5);
//            //    this.cartas_volteadas[i][j].frame = 0;
            //}

        //for (var i = 0; i < sobrantes; i++){
        //    var index = Math.floor( Math.random() * this.cartas.length );
        //    this.masos.sobrantes.push(this.cartas[index]);
        //    this.cartas.splice( index, 1 );
        //}

        /*

        this.espacio_columnas = [];

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
        	this.espacio_columnas.push( Game.add.sprite(100 * i + 20, 150, 'atras') );
            this.espacio_columnas[i].scale.setTo(0.5);
            this.espacio_columnas[i].frame = 1;
            this.espacio_columnas[i].tipo = "vacio";

            this.espacio_columnas[i].inputEnabled = true;
            Game.physics.enable( this.espacio_columnas[i], Phaser.Physics.ARCADE );

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

                    Game.physics.enable( this.cartas_volteadas[i][sig], Phaser.Physics.ARCADE );
                    //this.cartas_volteadas[i][sig].body.setSize(
                    //    this.cartas_volteadas[i][sig]._bounds.width,
                    //    this.cartas_volteadas[i][sig]._bounds.height);
                    
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

        console.log("Iniciado");*/
    },
    update: function () {
        // body...
    },
    render: function () {
        // body...
        Game.debug.inputInfo(32,350);
        //for (var i = 0; i < 7; i++){
        //    for (var j = 0; j < this.cartas_volteadas[i].length; j ++){
        //        Game.debug.body(this.cartas_volteadas[i][j]);
        //    }
        //}
    },
    /*input_carta_on: function (carta, punto, x, y) {
        this.carta_pos_inicial = {x: x, y: y};
        Game.world.bringToTop(carta);
        console.log("\n\n\ncarta");
        console.log(carta);
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
            colision =  Game.physics.arcade.overlap(
                            carta,
                            this.espacio_columnas[i], 
                            this.colision_cartas, 
                            null, this
                        );
            if (colision){
                carta.x = this.espacio_columnas[i].x;
                carta.y = this.espacio_columnas[i].y;
                colision = false;
                console.log("Pasa por aqui");
                break;
            }
        }
        if (colision){
            let index_carta = null;
            let si_carta = false;

            // Busca en las cartas que hay ordenadas en las columnas
            if (carta.DATOS.lugar == "col"){

                const CARTA = this.colocar_carta(  carta, colision, "columnas");
                console.log("CARTA");
                console.log(CARTA);
                console.log(this.cartas_volteadas);                
                if (CARTA){
                    this.cartas_volteadas[CARTA.DATOS.index.i][CARTA.DATOS.index.j].addChild(carta);
                    this.cartas_volteadas[CARTA.DATOS.index.i].push(carta);
                    carta.DATOS.index = {
                        i: CARTA.DATOS.index.i,
                        j: this.cartas_volteadas[CARTA.DATOS.index.i].length -1,
                    };
                    carta.scale.setTo(1);
                    carta.body.setSize(
                        carta._bounds.width,
                        carta._bounds.height);

                    carta.x = 0;
                    carta.y = 30;
                    console.log("\n\n\nCartas volteadas Col");
                    console.log(this.cartas_volteadas);                
                    return;
                }
            }else{
                console.log("SiCarta");
                const CARTA = this.colocar_carta(  carta, colision, "maso" );
                console.log("CARTA");
                console.log(CARTA);
                console.log(this.cartas_volteadas);                
                if (CARTA){
                    console.log("Actualizando");
                    this.cartas_volteadas[CARTA.DATOS.index.i][CARTA.DATOS.index.j].addChild(carta);
                    this.cartas_volteadas[CARTA.DATOS.index.i].push(carta);
                    carta.scale.setTo(1);
                    carta.DATOS.lugar = "col";
                    carta.DATOS.index = {
                        i: CARTA.DATOS.index.i,
                        j: this.cartas_volteadas[CARTA.DATOS.index.i].length -1,
                    };
                    carta.body.setSize(
                        carta._bounds.width,
                        carta._bounds.height);
                    carta.x = 0;
                    carta.y = 30;
                    console.log("\n\n\nCartas volteadas Row");
                    console.log(this.cartas_volteadas);                
                    return;
                }
            }
        }
        //if (colision == false){
        carta.x = this.carta_pos_inicial.x;
        carta.y = this.carta_pos_inicial.y;
        console.log("No COlisiona: Cartas Volteadas");                
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
        if (carta_superior.tipo){
			if (carta_superior.tipo == "vacio"){
				console.log("Hola")
			}
        }else{
        	this.carta_superior.carta = carta_superior;
        }
        console.log("\n\n\nCarta Superior");
        console.log(carta_superior);
    },
    colocar_carta: function (carta_mueve, carta_padre, monton) {
        // body...
        //console.log(carta_mueve);
        console.log("\n\n\nEntra en Colocar carta");
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
                    
                    if (this.cartas_volteadas[cartas.carta_1.index.i].length > 1){
                        this.actualizar_fila(cartas.carta_1.index.i, cartas.carta_1.index.j);
                        
                    }

                    for (var i = 0; i < this.cartas_volteadas[cartas.carta_1.index.i].length; i++){
                        console.log(i, cartas.carta_1.index.j);
                        if (i >= cartas.carta_1.index.j - 1){
                            this.cartas_volteadas[cartas.carta_1.index.i].pop();
                            this.filas[cartas.carta_1.index.i].pop();
                        }
                    }
                    console.log("\n SaleFilas");
                    console.log(this.filas);
                    console.log("\n\n Sale");

                    return (carta);
                }else{
                
                    console.log("Actualizar Carta");
                    this.filas[cartas.carta_2.index.i].push(
                        this.masos.usadas[cartas.carta_1.index.i]
                    );
                    this.masos.usadas.splice(cartas.carta_1.index.i, 1);
                    this.maso_sobrante_usado.splice(cartas.carta_1.index.i, 1);
                    console.log("\n\n Sale");
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
            var hijo = this.verificar_hijos(carta.children[0]);
            console.log("\n\nhijo");
            console.log(hijo);
            return hijo;
        }
    },
    actualizar_fila: function(col, row){
        row = row -1;
        this.cartas_volteadas[col][row].kill();
        row = row -1;
        
        const CARTA = this.filas[col][row];
        let index_carta = this.cartas_volteadas[col][row];

        this.cartas_volteadas[col][row] =  Game.add.sprite( index_carta.x, index_carta.y, 'cartas');

        this.cartas_volteadas[col][row].scale.setTo(0.5);
        this.cartas_volteadas[col][row].frame = this.cartas_json[ CARTA ].frame;
        this.cartas_volteadas[col][row].inputEnabled = true;
        this.cartas_volteadas[col][row].input.enableDrag(true);
        this.cartas_volteadas[col][row].events.onDragStart.add(this.input_carta_on, this);
        this.cartas_volteadas[col][row].events.onDragStop.add(this.input_carta_off, this);

        Game.physics.enable( this.cartas_volteadas[col][row], Phaser.Physics.ARCADE );

        this.cartas_volteadas[col][row].DATOS = {
                        name: CARTA,
                        index: {i: col, j: row},
                        value: this.cartas_json[ CARTA ].valor,
                        color: this.cartas_json[ CARTA ].color,
                        tipo: this.cartas_json[ CARTA ].tipo,
                        lugar: "col",
                    };
        console.log(this.cartas_volteadas[col][row].DATOS);
        //console.log(this.maso_sobrante_usado[index_carta].DATOS);
        
    }*/
};