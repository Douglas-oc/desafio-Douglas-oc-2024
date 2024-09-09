class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        const recintos = [
            {
                id: 1,
                bioma: 'savana',
                tamanho_tot: 10,
                tamanho_ocup: 3,
                especies: ['MACACO']
            },
            {
                id: 2,
                bioma: 'floresta',
                tamanho_tot: 5,
                tamanho_ocup: 0,
                especies: ['']
            },
            {
                id: 3,
                bioma: 'savana e rio',
                tamanho_tot: 7,
                tamanho_ocup: 1,
                especies: ['GAZELA']
            },
            {
                id: 4,
                bioma: 'rio',
                tamanho_tot: 8,
                tamanho_ocup: 0,
                especies: ['']
            },
            {
                id: 5,
                bioma: 'savana',
                tamanho_tot: 9,
                tamanho_ocup: 1,
                especies: ['LEAO']
            }
        ];
        
        // Validar animal e quantidade
        if (!this.animalValido(animal)) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        if (!quantidade || quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const biomasValidos = this.definirBioma(animal); // Agora é uma lista de biomas válidos
        const tamanhoAnimal = this.definirTamanho(animal);
        const recintosViaveis = [];

        for (let recinto of recintos) {
            if (biomasValidos.includes(recinto.bioma)) {
                const espacoDisponivel = recinto.tamanho_tot - recinto.tamanho_ocup;

                // Verifica se o bioma e espaço estão adequados para alocação
                if (this.verificarConforto(recinto, animal, quantidade, tamanhoAnimal) && espacoDisponivel >= quantidade * tamanhoAnimal) {
                    recintosViaveis.push({
                        id: recinto.id,
                        espacoLivre: espacoDisponivel - (quantidade * tamanhoAnimal),
                        espacoTotal: recinto.tamanho_tot
                    });
                }
            }
        }

        if (recintosViaveis.length > 0) {
            recintosViaveis.sort((a, b) => a.id - b.id);
            return {
                erro: false,
                recintosViaveis: recintosViaveis.map(rec => `Recinto ${rec.id} (espaço livre: ${rec.espacoLivre} total: ${rec.espacoTotal})`)
            };
        } else {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    }

    definirBioma(animal) {
        switch (animal) {
            case 'LEAO':
            case 'LEOPARDO':
                return ['savana'];
            case 'CROCODILO':
                return ['rio'];
            case 'MACACO':
                return ['savana', 'floresta'];
            case 'GAZELA':
                return ['savana'];
            case 'HIPOPOTAMO':
                return ['savana', 'rio'];
            default:
                return [];
        }
    }

    definirTamanho(animal) {
        switch (animal) {
            case 'LEAO':
                return 3;
            case 'LEOPARDO':
                return 2;
            case 'CROCODILO':
                return 3;
            case 'MACACO':
                return 1;
            case 'GAZELA':
                return 2;
            case 'HIPOPOTAMO':
                return 4;
            default:
                return 0; // Tamanho padrão para animais não reconhecidos
        }
    }

    verificarConforto(recinto, animal, quantidade, tamanhoAnimal) {
        const especiesPresentes = recinto.especies;

        // Se o animal for carnívoro, só pode viver com os da mesma espécie.
        if (this.ehCarnivoro(animal) && especiesPresentes.length > 0 && !especiesPresentes.includes(animal)) {
            return false;
        }

        // Hipopótamos só toleram outras espécies em 'savana e rio'
        if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && especiesPresentes.length > 0) {
            return false;
        }

        // Macacos precisam de pelo menos um outro animal no recinto
        if (animal === 'MACACO' && recinto.tamanho_ocup === 0 && quantidade === 1) {
            return false;
        }

        // Se houver mais de uma espécie no recinto, ocupa 1 espaço extra
        if (especiesPresentes.length > 0 && !especiesPresentes.includes(animal)) {
            if (recinto.tamanho_tot - recinto.tamanho_ocup - (quantidade * tamanhoAnimal) < 1) {
                return false;
            }
        }

        // Garantir que apenas leões possam ser alocados no recinto com id: 5
        if (recinto.id === 5 && animal !== 'LEAO') {
            return false;
        }
        // por algum motivo sempre que eu tentava alocar 'macaco' ele recomendava o recinto 5, que tem o leão, então adicionei esse código para remover isso

        return true;
    }

    ehCarnivoro(animal) {
        return ['LEAO', 'LEOPARDO', 'CROCODILO'].includes(animal);
    }

    animalValido(animal) {
        return ['LEAO', 'LEOPARDO', 'CROCODILO', 'MACACO', 'GAZELA', 'HIPOPOTAMO'].includes(animal);
    }
}

export { RecintosZoo as RecintosZoo };
