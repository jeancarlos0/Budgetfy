//////////////////IIFE/////////////////

//Ao ser iniciado o programa, essa variável é chamada, a função é imediamente executada e suas funções
//internas criadas, após isso, a variavel budgetController recebe como valor a função publicTest
//que agora pode ser acessada publicamente usando -> budgetController.publicTest(5);
//Por causa da Clousure, publicTest tem acesso as variaveis e paramatros da função exterior, mesmo após
//ela ser finalizada.

//BUDGET CONTROLLER

var budgetController = (function(){
    
   
})();

//UI CONTROLLER
var UiController = (function(){

    //Usado para evitar bugs caso seja necessário renomear alguma classe no HTML, além de organizar tudo melhor

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        input
    }
    return{
        getInput: function(){
            //Retorna um objeto contendo os 3 atributos (que contém os valores dos inputs)
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
            
        },
        getDOMStrings: function(){
            return DOMstrings;
        }
    };
})();

//MAIN CONTROLLER
var controller = (function(budgetCrtl, UiCtrl){
   
    var setupEventListeners = function(){
        
        var DOM = UiCtrl.getDOMStrings;

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        })
    }
    
    var ctrlAddItem = function(){
        var input = UiCtrl.getInput();
        console.log(input);
    }

    return{
        init: function(){
            setupEventListeners();
        }
    }
    
    
})(budgetController, UiController);

