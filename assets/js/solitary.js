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

        this.cartas = CARTAS;
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
                this.filas[i].push(this.cartas.splice( index, 1 ));
            }
        }

        // Rellena el maso de sobrantes
        var sobrantes = this.cartas.length;

        for (var i = 0; i < sobrantes; i++){
            var index = Math.floor( Math.random() * this.cartas.length );
            this.masos.sobrantes.push( this.cartas.splice( index, 1 ) )
        }



    },
    create: function () {
        // body...
        console.log("Columnas");
        console.log(this.filas);
        console.log("\n\nMaso");
        console.log(this.masos);
        Game.stage.backgroundColor = '#000000';
        console.log("Iniciado");
    },
    update: function () {
        // body...
    },
    render: function () {
        // body...
    }
};