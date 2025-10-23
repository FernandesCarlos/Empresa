// Classe Funcionário com getters e setters simples
class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this.nome = nome;
        this.idade = idade;
        this.cargo = cargo;
        this.salario = salario;
    }

    // Getters
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }

    // Setters sem try/catch (validação simples)
    set nome(valor) { this._nome = valor; }
    set idade(valor) { this._idade = valor; }
    set cargo(valor) { this._cargo = valor; }
    set salario(valor) { this._salario = valor; }
}

// Classe Controladora
class FuncionarioController {
    constructor() {
        this.funcionarios = [];
        this.form = document.getElementById("idform");
        this.tabela = document.getElementById("idlinhas");
        this.editIndex = -1; // Inicializa o controle de edição
        this.init();
    }

    init() {
        this.form.addEventListener("submit", (e) => this.adicionarFuncionario(e));
    }

    adicionarFuncionario(e) {
        e.preventDefault();

        // Captura dos dados
        const nome = document.getElementById("idnome").value.trim();
        const idade = parseInt(document.getElementById("ididade").value);
        const cargo = document.getElementById("idcargo").value.trim();
        const salario = parseFloat(document.getElementById("idsalario").value);

        // Validação simples
        if (!nome || isNaN(idade) || idade <= 0 || !cargo || isNaN(salario) || salario < 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        // Cria o funcionário
        const funcionario = new Funcionario(nome, idade, cargo, salario);

        // Verifica se está adicionando ou editando
        if (this.editIndex === -1) {
            this.funcionarios.push(funcionario);
        } else {
            this.funcionarios[this.editIndex] = funcionario;
            this.editIndex = -1;
        }

        // Atualiza a tabela e limpa o formulário
        this.atualizarTabela();
        this.form.reset();
    }

    atualizarTabela() {
        this.tabela.innerHTML = "";

        this.funcionarios.forEach((funcionario, index) => {
            const row = this.tabela.insertRow();
            row.insertCell(0).innerText = funcionario.nome;
            row.insertCell(1).innerText = funcionario.idade;
            row.insertCell(2).innerText = funcionario.cargo;
            row.insertCell(3).innerText = funcionario.salario.toFixed(2);

            // Botões de ação
            const cellAcoes = row.insertCell(4);
            const btnEditar = document.createElement("button");
            const btnExcluir = document.createElement("button");

            btnEditar.innerText = "Editar";
            btnExcluir.innerText = "Excluir";

            btnEditar.addEventListener("click", () => this.editarFuncionario(index));
            btnExcluir.addEventListener("click", () => this.removerFuncionario(index));

            cellAcoes.appendChild(btnEditar);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    removerFuncionario(index) {
        this.funcionarios.splice(index, 1);
        this.atualizarTabela();
    }

    editarFuncionario(index) {
        const funcionario = this.funcionarios[index];
        document.getElementById("idnome").value = funcionario.nome;
        document.getElementById("ididade").value = funcionario.idade;
        document.getElementById("idcargo").value = funcionario.cargo;
        document.getElementById("idsalario").value = funcionario.salario;
        this.editIndex = index;
    }
}

// Inicializa o controlador quando a página carregar
document.addEventListener("DOMContentLoaded", () => new FuncionarioController());
