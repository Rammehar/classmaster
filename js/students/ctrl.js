window.addEventListener('load',init);
function init(){
    bindEvents();
    getData();
    
}

function bindEvents(){    
    document.querySelector('#first').addEventListener('click',checkAnswer);
    document.querySelector('#second').addEventListener('click',checkAnswer);
    document.querySelector('#third').addEventListener('click',checkAnswer);
    document.querySelector('#fourth').addEventListener('click',checkAnswer);
}

let questions,lastQuestionIndex;
let questionIndex = 0;
let Timer;
let counter=0;
const questionTime = 5;
let score = 0;
const gaugeWidth = 100; // %
const gaugeUnit = gaugeWidth / questionTime;

//get data from firebase
 
//get data from firebase
function getData(){
    document.querySelector('#startQuiz').innerText="Please Wait while Questions are loading...";
     dbOperations.getQuestion(result =>{
        if (!result.exists()) {
            return;
        }
        document.querySelector('#startQuiz').innerText="Start Quiz";
        document.querySelector('#startQuiz').addEventListener('click',startQuiz); 

        let qst = result.val();
        
        let keys = Object.keys(qst);
        questionOperations.questions = [];
        for(let i=0; i < keys.length; i++){
            let qObj = qst[keys[i]];
            if(qObj['isMarked']){
                continue;
            }
            let newObj ={
                questionId:keys[i],
                question:qObj['question'],
                optionA:qObj['optionA'],
                optionB:qObj['optionB'],
                optionC:qObj['optionC'],
                optionD:qObj['optionD'],
                rans:qObj['rans'],
                score:qObj['score']
            }
            questionOperations.add(newObj);
        }
        questions = questionOperations.questions;
        lastQuestionIndex = questions.length-1;
        
    },error=>{console.log(error)});
}
function checkAnswer(){

    let givenAns = this.innerText;
    questions[questionIndex]['yans'] =givenAns;
    
    if(givenAns == questions[questionIndex]['rans']){
        //call right ans function
        score++;
    }else{
        //call wrong ans question
    }
    counter = 0;
    if(questionIndex < lastQuestionIndex){
        questionIndex++;
        renderQuestion();
    }else{
         // end the quiz and show the score
         clearInterval(Timer);
         scoreRender();
    }
}
function scoreRender(){
    document.querySelector('#score').innerHTML = `Your Score is ${score}`;
} 
function renderQuestion(){
    let qst = questions[questionIndex];
    document.querySelector('#question').innerHTML = qst["question"];
    document.querySelector('#first').innerHTML = qst['optionA'];
    document.querySelector('#second').innerHTML = qst['optionB'];
    document.querySelector('#third').innerHTML = qst['optionC'];
    document.querySelector('#fourth').innerHTML = qst['optionD'];
}
function startQuiz(){
    document.querySelector('#startQuiz').style.display = 'none';
    renderQuestion();
    //startProgressBar();
    renderCounter();
    Timer = setInterval(renderCounter,1000); // 1000ms = 1s

}
function renderCounter(){
    if(counter <= questionTime){
        document.querySelector('#timer').innerHTML = counter;
        document.querySelector("#dynamic").setAttribute('aria-valuenow',counter * gaugeUnit);
        document.querySelector('#dynamic').style.width = counter * gaugeUnit + "%";
        counter++;
    }else{
        counter = 0;
        if(questionIndex < lastQuestionIndex){
            questionIndex++;
            renderQuestion();
        }else{
            clearInterval(Timer);
            scoreRender();
        }
    }
}
