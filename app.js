//////////////////IIFE/////////////////

//Ao ser iniciado o programa, essa variável é chamada, a função é imediamente executada e suas funções
//internas criadas, após isso, a variavel budgetController recebe como valor a função publicTest
//que agora pode ser acessada publicamente usando -> budgetController.publicTest(5);
//Por causa da Clousure, publicTest tem acesso as variaveis e paramatros da função exterior, mesmo após
//ela ser finalizada.

//BUDGET CONTROLLER

var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //Adicionando o método ao protótipo do objeto, todos os objetos criados terão acesso por padrão

    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentage = Math.round(( this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){

        return this.percentage;

    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;

        //Loop sobre o array especificado por type
        data.allItems[type].forEach(function(current){
            //Soma todos os valores do array
            sum = sum + current.value;
        });

        //Atribue a soma dos valores a variável total do array
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
           inc: [],
           exp: [] 
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        //-1 para demonstrar que não há valor ainda
        percentage: -1
    }

    return{
        addItem: function(type, des, value){
            var newItem, ID;

            //O novo ID será o resultado do último ID + 1
            if(data.allItems[type].length >= 1){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }


            //Criando um novo item
            if(type === 'exp'){
                newItem = new Expense(ID, des, value);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, value);
            }
            //Coloca o novo item dentro do array dde nome igual ao "type"
            data.allItems[type].push(newItem);
            
            //Retorna o novo elemento
            return newItem;
        },

        calculatePercentages: function(){
            //Percorre todo o array e calcula a porcentagem de cada elemento
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            //Percorre todo o array e recebe um array contendo as porcentagens de cada elemento
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });

            return allPerc;
        },

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            //Arredonda o resultado para um valor inteiro
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        deleteItem: function(type, id){
            var ids, index;

            //Retorna um array contendo os ids dos elementos
            ids = data.allItems[type].map(function(current){
                return current.id
            });

            index = ids.indexOf(id);

            if(index !== -1){

                //Remove do array o elemento indicado pelo Index
                data.allItems[type].splice(index, 1);
            }

        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        test: function(){
            console.log(data);
        }
    };

})();

//UI CONTROLLER
var UiController = (function(){

    //Usado para evitar bugs caso seja necessário renomear alguma classe no HTML, além de organizar tudo melhor

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage'
    };

    return{
        getInput: function(){
            //Retorna um objeto contendo os 3 atributos (que contém os valores dos inputs)
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
            
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            //Insere o componente HTML na UI
            if(type === 'inc'){

                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){

                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Altera os pseudo textos com os valores do  objeto

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insere o componente HTML antes do fim do seu container
            document.querySelector(element).insertAdjacentHTML("beforeend" ,newHtml);
            
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //Passa a lista como se fosse um Array para o metódo Slice
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },

        displayPercentages: function(percentages){

            //Retorna uma lista de nós (nodes) da DOM
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

            //Este método vai percorrer a lista, e chamar a função callback passando o atual item
            // da lista (current na callback) e o index desse item
            var nodeListForEach = function(list, callback){
                for(i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            //Explicanddo pq aqui é foda: Ao chamar a nodeListForEach, é passado a lista e uma função callback
            
            nodeListForEach(fields, function(current, index){
                //current é o atual nó do array de elementos, percentages[index] é a porcentagem de msm index 
                //ddo array de porcentagens
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

//MAIN CONTROLLER
var controller = (function(budgetCrtl, UICtrl){
   

    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });   
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    

    var updateBudget = function(){
        var budget;
        //Calculate, return and display the budget on the UI

        budgetCrtl.calculateBudget();
        budget = budgetCrtl.getBudget();
        UICtrl.displayBudget(budget);
        console.log(budget);

    };

    var updatePercentage = function(){

        budgetCrtl.calculatePercentages();

        var percentages = budgetCrtl.getPercentages();

        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function(){
        
        var input, newItem;
        //Recebe os valores dos inputss
        input = UICtrl.getInput();

        //Verifica posssíveis problemas e cria um novo item

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCrtl.addItem(input.type, input.description, input.value);
        
            //Adiciona o novo item na DOM
            UICtrl.addListItem(newItem, input.type);
    
            UICtrl.clearFields();
    
            updateBudget();

            updatePercentage();
        }

        
    };

    //O parâmetro Event é necessário para aplicar Event delegation na função

    var ctrlDeleteItem = function(event){
        var itemID, spliID, type, ID;

        //Parent traversing, subindo na árvore de elementos e conguindo o ID único do container
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        if(itemID){
            //Divide o ID do container em duas partes, o tipo e o n° de identificação
            spliID = itemID.split('-');
            type = spliID[0];
            ID = parseInt(spliID[1]);

            //Apaga o item do array
            budgetCrtl.deleteItem(type, ID);
            //Apaga o item da interface
            UICtrl.deleteListItem(itemID);
            //Atualiza o budget
            updateBudget();

            updatePercentage();
        }
    };

    return{
        init: function(){
            //Inicia o painel com valores nulos
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
    
    
})(budgetController, UiController);

controller.init();