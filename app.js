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
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
           inc: [],
           exp: [] 
        },

        totals: {
            exp: 0,
            inc: 0
        },
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
        expenseContainer: '.expenses__list'
    };

    return{
        getInput: function(){
            //Retorna um objeto contendo os 3 atributos (que contém os valores dos inputs)
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
            
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            //Insere o componente HTML na UI
            if(type === 'inc'){

                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){

                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Altera os pseudo textos com os valores do  objeto

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insere o componente HTML antes do fim do seu container
            document.querySelector(element).insertAdjacentHTML("beforeend" ,newHtml);
            
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
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        //Recebe os valores dos inputss
        input = UICtrl.getInput();

        //Cria um novo item

        newItem = budgetCrtl.addItem(input.type, input.description, input.value);
        
        //Adiciona o novo item na DOM
        UICtrl.addListItem(newItem, input.type);
    }

    return{
        init: function(){
            setupEventListeners();
        }
    }
    
    
})(budgetController, UiController);

controller.init();