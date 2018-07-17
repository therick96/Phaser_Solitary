var CARTAS = [
    "c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12",
    "d1","d2","d3","d4","d5","d6","d7","d8","d9","d10","d11","d12",
    "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12",
    "t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12",
];

var TOTAL = 78;
var CONTADOR = [1,2,3,4,5,6,7];

var Solitario = {

    preload: function () {
        // body...

        console.log(Phaser.ScaleManager);

        //Game.load.spritesheet('atras', 'assets/imgs/cartas_1.png', 124, 200, 3);
        Game.load.spritesheet('cartas', 'assets/imgs/cartas_2.png', 124, 200, 51);

        Game.load.json('cartas_json', 'assets/js/cartasjson.json');

        this.cartas = CARTAS;
        this.carta_pos_inicial = {x: null, y: null};

        this.maso_sobrante_usado = [];
        this.no_carta = null;
        this.espacio_carta = [];

        this.carta_superior = null;
        this.espacio_columnas = [];

        this.cartas_volteadas = [[],[],[],[],[],[],[]];

        this.masos = {
            sobrantes: [],
            usadas: [],
        }
        
    },
    create: function () {
        // body...
        let index = 0;
        let Carta = false;

        this.cartas_json = Game.cache.getJSON('cartas_json');

        Game.stage.backgroundColor = '#335'; //Color de fondo
        
        // La carta del maso vacio
        this.no_carta = Game.add.sprite(20, 10, 'cartas');
        this.no_carta.scale.setTo(Escala.chica);
        this.no_carta.frame = 50;
        this.no_carta.inputEnabled = true;
        this.no_carta.events.onInputDown.add(this.pulsa_maso_vacio, this);

        // Las 4 posiciones finales de las cartas
        for (var i = 0; i < 4; i++){
            this.espacio_carta.push(Game.add.sprite(355 + (i * 110), 20, 'cartas'));
            this.espacio_carta[i].Datos = {
                tipo: "meta",
                cartas: [],
            };
            this.espacio_carta[i].scale.setTo(Escala.chica -0.1);
            this.espacio_carta[i].frame = 49;
        }

        // Las Columnas de cartas
        for (var i = 0; i < 7; i++){
            // Los espacios
            this.espacio_columnas.push( Game.add.sprite(25 + (i * 110), 210, 'cartas') );
            this.espacio_columnas[i].scale.setTo(Escala.chica -0.1);
            this.espacio_columnas[i].frame = 49;
            Game.physics.enable( this.espacio_columnas[i], Phaser.Physics.ARCADE );
            this.espacio_columnas[i].Datos = {
                tipo: "fila_vacia",
            };

            for ( var j = 0; j < CONTADOR[i]; j++){
                // Las Cartas
                index = Math.floor( Math.random() * this.cartas.length );
                Carta = this.cartas_json[ this.cartas[index] ];

                this.cartas_volteadas[i].push( Game.add.sprite(20 + (i * 110), 200 + (1.5 * j), 'cartas') );
                this.cartas_volteadas[i][j].scale.setTo(Escala.chica);
                
                this.cartas_volteadas[i][j].Datos = {
                    tipo: "carta",
                    estado: null,
                    nombre: this.cartas[index],
                    color: Carta.color,
                    valor: Carta.valor,
                    grupo: Carta.tipo,
                    posicion: {
                        col: i,
                        carta: j,
                    }
                }

                if ( j == CONTADOR[i] -1){
                    // Si es la primera carta
                    this.cartas_volteadas[i][j].frame = Carta.frame;
                    this.cartas_volteadas[i][j].Datos.estado = "derecha";
                    this.cartas_volteadas[i][j].inputEnabled = true;
                    this.cartas_volteadas[i][j].input.enableDrag(true);
                    this.cartas_volteadas[i][j].events.onDragStart.add(this.input_carta_on, this);
                    this.cartas_volteadas[i][j].events.onDragStop.add(this.input_carta_off, this);

                    Game.physics.enable( this.cartas_volteadas[i][j], Phaser.Physics.ARCADE );

                }else{
                    // Si es de las que estan debajo de la primera
                    this.cartas_volteadas[i][j].frame = 48;
                    this.cartas_volteadas[i][j].Datos.estado = "volteada";
                }

                this.cartas.splice( index, 1 ); // Elimina de la lista la carta ya creada
            }
        }
        
        // Rellena las cartas del maso sobrante
        const RESTANTES = this.cartas.length;
        for (var i = 0; i < RESTANTES; i++){
            index = Math.floor( Math.random() * this.cartas.length );
            Carta = this.cartas_json[ this.cartas[index] ];

            this.masos.sobrantes.push( Game.add.sprite(20, 10 + (i * 0.5), 'cartas') );

            this.masos.sobrantes[i].scale.setTo(Escala.chica);
            this.masos.sobrantes[i].Datos = {
                tipo: "carta",
                estado: "volteada",
                nombre: this.cartas[index],
                color: Carta.color,
                valor: Carta.valor,
                grupo: Carta.tipo,
                posicion: {
                    col: i,
                    carta: false,
                }
            };
            this.masos.sobrantes[i].frame = 48;
            this.masos.sobrantes[i].inputEnabled = true;
            this.masos.sobrantes[i].events.onInputDown.add(this.pulsa_maso_cartas, this);

            this.cartas.splice( index, 1 );
        }

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
    pulsa_maso_cartas: function (carta, pointer) {
        console.log("\n\nNueva Carta\n");
    },
    pulsa_maso_vacio: function (carta, pointer) {
        // body...
        console.log("No hay mas cartas");
    },
    input_carta_on: function (carta, punto, x, y) {
        this.carta_pos_inicial = {x: x, y: y};
        Game.world.bringToTop(carta);
        console.log("\n\n\nAgarra la carta");
        console.log(carta.Datos);
    },
    input_carta_off: function (carta, punto) {
        carta.x = this.carta_pos_inicial.x;
        carta.y = this.carta_pos_inicial.y;

        for (var i = 0; i < 7; i++){
            Game.physics.arcade.overlap(
                                    carta,
                                    this.cartas_volteadas[i][ this.cartas_volteadas[i].length -1 ], 
                                    this.colision_cartas, null, this);
        }
        console.log("\nSuelta la carta\n\n\n");
    },
    colision_cartas: function (carta_movible, carta_superior) {
        // Detecta si colisiona con otra carta de las columnas
        if ( carta_movible.Datos.tipo == "carta" && (carta_movible.Datos.estado == "derecha" || carta_movible.Datos.estado == "media")){
            if ( carta_superior.Datos.tipo == "carta" && carta_superior.Datos.estado == "derecha" ){
                carta_superior = this.verificar_hijos(carta_superior);
                //console.log("\nColisiona con:");
                //console.log(carta_superior.Datos);
                //console.log("\n");

                if ( (carta_superior.Datos.color != carta_movible.Datos.color) && ( carta_superior.Datos.valor == carta_movible.Datos.valor +1)){
                    console.log("Posicionamiento Valido\n");
                    carta_superior.addChild(carta_movible);
                    carta_movible.x = 0;
                    carta_movible.y = 30;
                    carta_movible.scale.setTo(Escala.normal);
                    carta_movible.body.setSize(
                        carta_movible._bounds.width,
                        carta_movible._bounds.height);
                    if (carta_movible.Datos.estado == "derecha" && carta_movible.Datos.posicion != false){
                        this.cartas_volteadas[carta_movible.Datos.posicion.col].splice( carta_movible.Datos.posicion.carta, 1);
                        this.actualizar_fila(carta_movible.Datos.posicion);
                        carta_movible.Datos.posicion = false;
                    }
                    console.log(this.cartas_volteadas);
                }
            }
        }
    },
    verificar_hijos: function (carta) {
        // body...
        if (carta.children.length <= 0){
            return carta;
        }else{
            return this.verificar_hijos(carta.children[0]);
        }
    },
    actualizar_fila: function(pos){
        if ( this.cartas_volteadas[pos.col].length > 0 ){
            console.log("\n\n Actualizar Carta");
            let carta = this.cartas_volteadas[pos.col][pos.carta -1].Datos;
            console.log(this.cartas_volteadas[pos.col].length);
            console.log(this.cartas_json[ carta.nombre ]);
            this.cartas_volteadas[pos.col][pos.carta -1].frame = this.cartas_json[ carta.nombre ].frame;
            this.cartas_volteadas[pos.col][pos.carta -1].Datos.estado = "derecha";
            this.cartas_volteadas[pos.col][pos.carta -1].inputEnabled = true;
            this.cartas_volteadas[pos.col][pos.carta -1].input.enableDrag(true);
            this.cartas_volteadas[pos.col][pos.carta -1].events.onDragStart.add(this.input_carta_on, this);
            this.cartas_volteadas[pos.col][pos.carta -1].events.onDragStop.add(this.input_carta_off, this);
        }
        
    },/*
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
    
    */
};