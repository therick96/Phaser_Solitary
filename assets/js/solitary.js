var CARTAS = [
    "c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12",
    "d1","d2","d3","d4","d5","d6","d7","d8","d9","d10","d11","d12",
    "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12",
    "t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12",
];

var CONTADOR = [1,2,3,4,5,6,7];

var Solitario = {

    preload: function () {
        // body...

        Game.load.spritesheet('cartas', 'assets/imgs/cartas_2.png', 124, 200, 51);

        Game.load.json('cartas_json', 'assets/js/cartasjson.json');

        this.cartas = CARTAS;
        this.carta_pos_inicial = {x: null, y: null};

        this.maso_sobrante_usado = [];
        this.no_carta = null;
        this.espacio_carta = [];

        this.carta_superior = null;
        this.espacio_columnas = [];
        this.gana = false;

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

        this.tiempo = {
            inicio: new Date(),
            fin: null,
        }

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
                col: i,
                total: 0,
            };
            this.espacio_carta[i].scale.setTo(Escala.chica -0.1);
            this.espacio_carta[i].frame = 49;
            Game.physics.enable( this.espacio_carta[i], Phaser.Physics.ARCADE);
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
                col: i,
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
            this.masos.sobrantes[i].events.onInputUp.add(this.pulsa_maso_cartas, this);
            Game.physics.enable( this.masos.sobrantes[i], Phaser.Physics.ARCADE );

            this.cartas.splice( index, 1 );
        }

    },
    update: function () {
        // body...
    },
    render: function () {
        // body...
        //Game.debug.inputInfo(32,350);
        //for (var i = 0; i < 7; i++){
        //    Game.debug.body(this.espacio_columnas[i]);
        //    for (var j = 0; j < this.cartas_volteadas[i].length; j ++){
        //        Game.debug.body(this.cartas_volteadas[i][j]);
        //    }
        //}
    },
    pulsa_maso_cartas: function (carta, pointer) {

        carta = this.masos.sobrantes.pop();
        carta.x = 135;
        carta.y = 10;

        this.masos.usadas.push( carta );

        
        carta.Datos.posicion.col = this.masos.usadas.length -1;
        carta.Datos.estado = "media";
        carta.frame = this.cartas_json[ carta.Datos.nombre ].frame;
        Game.world.bringToTop( carta );
        carta.events.onInputUp.removeAll();
        
        if (this.masos.usadas.length > 1){
            carta.y = this.masos.usadas[ this.masos.usadas.length - 2].y + 0.2;
        }

        carta.input.enableDrag(true);
        carta.events.onDragStart.add(this.input_carta_on, this);
        carta.events.onDragStop.add(this.input_carta_off, this);

    },
    pulsa_maso_vacio: function (carta, pointer) {
        // body...


        var cantidad_cartas = this.masos.usadas.length;
        for (var i = 0; i < cantidad_cartas; i++){
            this.masos.sobrantes.push( this.masos.usadas.pop() );
            this.masos.sobrantes[i].input.draggable = false;
            this.masos.sobrantes[i].frame = 48;
            this.masos.sobrantes[i].Datos.estado = "volteada";
            this.masos.sobrantes[i].Datos.posicion.col = i;
            this.masos.sobrantes[i].x = 20;
            this.masos.sobrantes[i].y = 10 + (i * 0.5);
            this.masos.sobrantes[i].events.onInputUp.add(this.pulsa_maso_cartas, this);
            Game.world.bringToTop( this.masos.sobrantes[i] );
        }
    },
    input_carta_on: function (carta, punto, x, y) {
        this.carta_pos_inicial = {x: x, y: y};
        Game.world.bringToTop(carta);

    },
    input_carta_off: function (carta, punto) {
        carta.x = this.carta_pos_inicial.x;
        carta.y = this.carta_pos_inicial.y;
        
        for (var i = 0; i < 7; i++){
            colision = Game.physics.arcade.overlap(
                                    carta,
                                    this.cartas_volteadas[i][ this.cartas_volteadas[i].length -1 ], 
                                    this.colision_cartas, null, this);
            if (colision){
                break;
            }
            colision = Game.physics.arcade.overlap(
                                    carta,
                                    this.espacio_columnas[i], 
                                    this.colision_cartas, null, this);
            if (colision){
                break;
            }

            if (i < 4){
                colision = Game.physics.arcade.overlap(
                                    carta,
                                    this.espacio_carta[i], 
                                    this.colision_cartas, null, this);
            }
        }

    },
    colision_cartas: function (carta_movible, carta_superior) {
        // Detecta si colisiona con otra carta de las columnas
        if ( carta_movible.Datos.tipo == "carta" && (carta_movible.Datos.estado == "derecha" || carta_movible.Datos.estado == "media" || carta_movible.Datos.estado == "final")){

            if ( carta_superior.Datos.tipo == "carta" && carta_superior.Datos.estado == "derecha" ){
                carta_superior = this.verificar_hijos(carta_superior);


                if ( (carta_superior.Datos.color != carta_movible.Datos.color) && ( carta_superior.Datos.valor == carta_movible.Datos.valor +1)){

                    if (carta_movible.parent.Datos){
                        var parent = carta_movible.parent;
                        parent.removeChild(carta_movible);
                        Game.add.existing(carta_movible);
                    }
                    carta_superior.addChild(carta_movible);
                    carta_movible.x = 0;
                    carta_movible.y = 30;
                    carta_movible.scale.setTo(Escala.normal);
                    carta_movible.body.setSize(
                        carta_movible._bounds.width,
                        carta_movible._bounds.height);
                    this.actualizar_carta(carta_movible);

                    carta_movible.Datos.estado = "derecha";
                    carta_movible.Datos.posicion = false;

                }
            }else if( carta_superior.Datos.tipo == "fila_vacia" ){

                // Si se coloca una carta en un espacio vacio

                if (this.cartas_volteadas[carta_superior.Datos.col].length <= 0){
                    if( carta_movible.Datos.valor == 12){
                        this.cartas_volteadas[carta_superior.Datos.col].push( carta_movible );

                        carta_movible.x = carta_superior.x -5;
                        carta_movible.y = carta_superior.y -10;

                        this.actualizar_carta(carta_movible);

                        carta_movible.Datos.posicion = {
                            col: carta_superior.Datos.col,
                            carta: 0,
                        };
                        carta_movible.Datos.estado = "derecha";

                    }
                }
            }else if( carta_superior.Datos.tipo == "meta"){

                // Si se coloca una carta en una de las metas
                
                if (carta_movible.children.length <= 0){

                    if (this.espacio_carta[carta_superior.Datos.col].Datos.cartas.length <= 0 && carta_movible.Datos.valor == 1){
                        this.espacio_carta[carta_superior.Datos.col].Datos.cartas.push( carta_movible );
                        if (carta_movible.parent.Datos){
                            var parent = carta_movible.parent;
                            parent.removeChild(carta_movible);
                            Game.add.existing(carta_movible);
                        }
                        carta_movible.scale.setTo(Escala.chica);

                        carta_movible.x = carta_superior.x -5;
                        carta_movible.y = carta_superior.y -10;
                        carta_movible.scale.setTo(Escala.chica);
                        //carta_movible.body.setSize(
                        //    carta_movible._bounds.width,
                        //    carta_movible._bounds.height);

                        this.actualizar_carta(carta_movible);
                        
                        carta_movible.Datos.estado = "final";
                        carta_superior.Datos.grupo = carta_movible.Datos.grupo;
                        carta_movible.Datos.posicion = {
                            col: carta_superior.Datos.col,
                            carta: this.espacio_carta[carta_superior.Datos.col].Datos.cartas.length -1,
                        };
                    }else{

                        if ( this.espacio_carta[carta_superior.Datos.col].Datos.cartas.length == carta_movible.Datos.valor -1 ){
                            if ( carta_movible.Datos.grupo == carta_superior.Datos.grupo ){
                                this.espacio_carta[carta_superior.Datos.col].Datos.cartas.push( carta_movible );
                                if (carta_movible.parent.Datos){
                                    var parent = carta_movible.parent;
                                    parent.removeChild(carta_movible);
                                    Game.add.existing(carta_movible);
                                }

                                carta_movible.x = carta_superior.x -5;
                                carta_movible.y = carta_superior.y -10;
                                carta_movible.scale.setTo(Escala.chica);
                                //carta_movible.body.setSize(
                                //    carta_movible._bounds.width,
                                //    carta_movible._bounds.height);
                                this.actualizar_carta(carta_movible);
                                carta_movible.Datos.estado = "final";
                                carta_movible.Datos.posicion = {
                                    col: carta_superior.Datos.col,
                                    carta: this.espacio_carta[carta_superior.Datos.col].Datos.cartas.length -1,
                                };
                                this.verificar_ganado();
                            }
                        }
                    }
                }
            }else if( carta_superior.Datos.estado == "final"){

            }
        }
    },
    actualizar_carta: function (carta) {
        // body...
        if (carta.Datos.estado == "derecha" && carta.Datos.posicion != false){
            this.cartas_volteadas[carta.Datos.posicion.col].splice( carta.Datos.posicion.carta, 1);
            this.actualizar_fila(carta.Datos.posicion);
        }else if( carta.Datos.estado == "media" ){
            this.masos.usadas.splice( carta.Datos.posicion.col, 1);
        }else if( carta.Datos.estado == "final" ){

            this.espacio_carta[carta.Datos.posicion.col].Datos.cartas.splice( carta.Datos.posicion.carta, 1);
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

            let carta = this.cartas_volteadas[pos.col][pos.carta -1].Datos;

            this.cartas_volteadas[pos.col][pos.carta -1].frame = this.cartas_json[ carta.nombre ].frame;
            this.cartas_volteadas[pos.col][pos.carta -1].Datos.estado = "derecha";
            this.cartas_volteadas[pos.col][pos.carta -1].inputEnabled = true;
            this.cartas_volteadas[pos.col][pos.carta -1].input.enableDrag(true);
            this.cartas_volteadas[pos.col][pos.carta -1].events.onDragStart.add(this.input_carta_on, this);
            this.cartas_volteadas[pos.col][pos.carta -1].events.onDragStop.add(this.input_carta_off, this);
            Game.physics.enable( this.cartas_volteadas[pos.col][pos.carta -1], Phaser.Physics.ARCADE );
        }
        
    },
    verificar_ganado: function () {
        // body...
        for (var i = 0; i < 4; i++){
            if (this.espacio_carta[i].Datos.cartas.length == 12){
                this.gana = true;
            }else{
                this.gana = false;
                break;
            }
        }
        if (this.gana == true){

            this.ganar();
        }
    },
    ganar: function () {
        // body...
        for (var i = 0; i < 4; i++){
            //for (var j = 0; j < 12; j++){
            for (var j = 0; j < this.espacio_carta[i].Datos.cartas.length; j++){
                this.espacio_carta[i].Datos.cartas[j].inputEnabled = false;
                this.espacio_carta[i].Datos.cartas[j].input.draggable = false;
            }
        }
            
        //Game.physics.arcade.isPaused = true;
        this.tiempo.fin = new Date();

        var texto = Game.add.text(
            290, 250, "You Win", {
                font: "70px Arial",
                fill: "#fff",
                stroke: "#000",
                strokeThickness: 10,
                align: "center"
            });

        var tiempo_string = Game.add.text(
            350, 350, Number((( this.tiempo.fin.valueOf() - this.tiempo.inicio.valueOf())/1000 )/60 ).toFixed(2) + " Minutes", {
                align: "center",
                fill: "#fff",
                stroke: "#000",
                strokeThickness: 7,
                font: "30px Arial",
            });
    }
};