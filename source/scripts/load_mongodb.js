db = connect('mongodb://localhost/public-health-care');

function generate_cpf() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

paciente1_base_cpf = generate_cpf().toString()
paciente2_base_cpf = generate_cpf().toString()
paciente3_base_cpf = generate_cpf().toString()
stock_base_id = crypto.randomUUID()
stock_destino_id = crypto.randomUUID()
receita_base_id = crypto.randomUUID()

let receitaPopulation = [
    {
        id: 'deb3332a-7bf5-4f35-8d6d-f967c641d766',
        crm: 123,
        nome_medico: "João",
        paciente_cpf: paciente1_base_cpf,
        registro_base_remedio: '8de55a57-b54b-4409-b720-0607eece846d',
        quantity: 40,
        descricao: "receita daorinha pra ficar legau",
        valida: true
    },
    {
        id: '4ed3fab9-cb14-4c8f-89d6-5cdb3b7596d1',
        crm: 321,
        nome_medico: "Maria",
        paciente_cpf: paciente2_base_cpf,
        registro_base_remedio: 'c1ea1d42-6631-490b-b414-6c6ec7995167',
        quantity: 60,
        descricao: "receita bacaninha pra ficar legau",
        valida: true
    }
];
  
let pacientePopulation = [
    {
        cpf: paciente1_base_cpf,
        nome: "Márcio Andrade",
        data_nascimento: "15/06/2001",
        convenio: "Convenião S/A",
        bairro: "Centro"
    },
    {
        cpf: paciente2_base_cpf,
        nome: "Joana Marta",
        data_nascimento: "10/08/1990",
        convenio: "Conveniwow",
        bairro: "Centro"
    }
];
  
let stockPopulation = [
    {
        id: '14a2e45f-43d2-47db-b0a7-f678083789c0',
        bairro: "Centro",
        registro_remedio: '8de55a57-b54b-4409-b720-0607eece846d',
        quantity: 93
    },
    {
        id: 'a471c56f-b3ce-4af5-b9e6-9f39082b221b',
        bairro: "Jardim",
        registro_remedio: 'c1ea1d42-6631-490b-b414-6c6ec7995167',
        quantity: 60
    }
];
  
let remedioPopulation = [
    {
        registro: '8de55a57-b54b-4409-b720-0607eece846d',
        nome: "Remedinho",
        substancia: "cloreto de sódio",
        apresentacao: "esse medicamento é assim assado desse jeito",
        fabricante: "fabrica mermo",
        prontidao: "mediante a pedido",
        tarja: "Preta"
    },
    {
        registro: 'c1ea1d42-6631-490b-b414-6c6ec7995167',
        nome: "Remedinho",
        substancia: "substancia bacana",
        apresentacao: "esse medicamento é desse outro jeito aqui",
        fabricante: "fabricantes inc.",
        prontidao: "pronto",
        tarja: "Preta"
    }
];
  
let entregaPopulation = [
    {
        id: crypto.randomUUID(),
        tipo: "PACIENTE",
        paciente_cpf: paciente2_base_cpf,
        receita_id: '4ed3fab9-cb14-4c8f-89d6-5cdb3b7596d1',
        bairro_origin: 'jardim luft',
        bairro_destino: null,
        stock_base: stock_base_id,
        stock_destino: null,
        quantity: 40
    }
];
  
let receitaIndex = {id: 1};
let pacienteIndex = {cpf: 1};
let stockIndex = {id: 1};
let remedioIndex = {registro: 1};
let entregaIndex = {id: 1};

let collInfoObjs = [ 
    {coll: "receita", data: receitaPopulation, index: receitaIndex}, 
    {coll: "paciente", data: pacientePopulation, index: pacienteIndex},
    {coll: "stock", data: stockPopulation, index: stockIndex},
    {coll: "remedio", data: remedioPopulation, index: remedioIndex},
    {coll: "entrega", data: entregaPopulation, index: entregaIndex}
];

for (obj of collInfoObjs) {
    db[obj.coll].insertMany(obj.data);
    db[obj.coll].createIndex(obj.index, {unique: true});
}
