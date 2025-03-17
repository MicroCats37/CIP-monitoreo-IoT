import { AreaKeyDataType } from "@/types";

export const AreasData: AreaKeyDataType = {
    "Aire Acondicionado": {
        "1": {
            id: "1",
            topickey: "aire acondicionado 1",
            download:'api/download/aire-acondicionado'
        },
        "2": {
            id: "2",
            topickey: "aire acondicionado 2",
            download:'api/download/aire-acondicionado'
        },
    },
    "Bombas": {
        "agua-potable": {
            id: "agua-potable",
            topickey: "bombas agua potable",
            download:'api/download/bombas'
        },
        "aguas-tratadas": {
            id: "aguas-tratadas",
            topickey: "bombas aguas tratadas",
            download:'api/download/bombas'
        },
        "aguas-grises": {
            id: "aguas-grises",
            topickey: "bombas aguas grises",
            download:'api/download/bombas'
        },
    },
    "Sistema contra Incendios": {
        topickey: "sistema contra incendios",
        download:'api/download/sci'

    },
    "Tableros Electricos": {

        topickey: "tableros electricos",
        download:'api/download/tableros'

    },
    "Variadores": {
        "agua-potable": {
            id: "agua-potable",
            topickey: "variadores agua potable",
            download:'api/download/variadores'
        },
        "aguas-tratadas": {
            id: "aguas-tratadas",
            topickey: "variadores aguas tratadas",
            download:'api/download/variadores'
        },
        "aguas-grises": {
            id: "aguas-grises",
            topickey: "variadores aguas grises",
            download:'api/download/variadores'
        },
    },
    "Piscinas": {
        topickey: "concentracion de cloro piscinas",
        download:'api/download/piscinas'
    },
    "Concentracion de CO2": {
        topickey: "concentracion de CO2",
        download:'api/download/co2'
    },
};
