window.addEventListener('load',init);
function init(){
    bindEvents();
    updateCounts();
    getData();
}

//get data from firebase
function getData(){
    let questionShowingArea = document.querySelector('#questions');
    questionShowingArea.innerHTML='<tr><td class="text-center" colspan="9">Loading......</td></tr>';
     dbOperations.getQuestion(result =>{
        if (!result.exists()) {
            questionShowingArea.innerHTML='<tr><td class="text-center" colspan="9">No Record Found!</td></tr>';
            return;
        }
        let questions = result.val();
        
        let keys = Object.keys(questions);
        questionOperations.questions = [];
        for(let i=0; i < keys.length; i++){
            let qObj = questions[keys[i]];
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
        console.log(questionOperations.questions);
       printTable(questionOperations.questions);
    },error=>{console.log(error)});
}

function updateCounts(){
    document.querySelector('#total_records').innerText = questionOperations.questions.length ;
    document.querySelector('#total_marked').innerText = questionOperations.countMarked();
    document.querySelector('#total_unmarked').innerText = questionOperations.questions.length  -   questionOperations.countMarked();
}
function bindEvents(){
  
    document.querySelector('#add').addEventListener('click',addQuestion);
    document.querySelector('#update').addEventListener('click',update);
    document.querySelector('#delete').addEventListener('click',deleteMarkedQuestion);
    document.querySelector('#sort_by_id').addEventListener('click',sort);
    document.querySelector('#search').addEventListener('click',showSearchBox);
    document.querySelector('#save').addEventListener('click',save);
    document.querySelector('#load').addEventListener('click',load);
    document.querySelector('#clear_all').addEventListener('click',clearAll);

}
function clearAll(){
    if(confirm("Are you sure to rest form!")){
        resetForm(); 
    }
}
function showSearchBox(){
    let searchBox = document.querySelector('#search_box');
    if(searchBox.style.display === 'none'){
        searchBox.style.display = 'block';
        document.querySelector('#search_box').addEventListener('change',searchKeywords);

    }else{
        searchBox.style.display = 'none';
        updateCounts();
        printTable(questionOperations.questions);

    }
}

function searchKeywords(){
   let keyword =  document.querySelector('#keyword').value;
   let founded_records = questionOperations.search(keyword);
   //console.log(founded_records);

   document.querySelector('#questions').innerHTML = '';
   printQuestion(founded_records); 
   updateCounts();

}
function sort(){
    questionOperations.sort();
    printTable(questionOperations.questions); 
}
function update(){
    let questionObject = new Question();
    for (let key in questionObject){
        if(key == 'isMarked'){
            continue;
        }
        questionObject[key] = document.querySelector('#'+key).value;
    } 
    //validate object is not empty
    //validate question object in not empty
    if(!validate(questionObject)){
        message("All fields are required!","alert-danger");
        return;
     }  
    
    //update into firebase database
    dbOperations.updateQuestion(questionObject);
    /*----end---*/
    message("Updated Successfully","alert-success");
    resetForm();
    printTable(questionOperations.questions); 
}
function resetForm(){
    //reset form
    let inputs = document.querySelectorAll('input,textarea');
    inputs.forEach(input=>input.value='');
    /*----end---*/
}
//add delete update messages showing function
function message(msg,cssClass){
    let msgElement = document.querySelector('#msg');
    msgElement.innerHTML = msg;
    msgElement.classList.remove('alert-info');
    msgElement.classList.add(cssClass);
    setTimeout(()=>{
        msgElement.innerHTML = 'Question CRUD';
        msgElement.classList.remove(cssClass);
        msgElement.classList.add('alert-info');
    },2000);
}
function save(){
    if(localStorage){
        let data = questionOperations.questions;
        let json_data = JSON.stringify(data);
        localStorage.questions = json_data;
        alert("Record Saved");
    }else{
        alert('YourBrowser is Outdated!');
    }
}
function load(){
    if(localStorage){
        if(localStorage.questions){
            questionOperations.questions = JSON.parse(localStorage.questions);
            printTable(questionOperations.questions);
        }
    }else{
        alert('outdated Browser');
    }
}

function deleteMarkedQuestion(){
    let arra = questionOperations.delete();
    printTable(arra);
}
function printTable(arr){
    document.querySelector('#questions').innerHTML = '';
    if(arr.length > 0)
        arr.forEach(printQuestion);
    updateCounts();
}
function markToggle(){
    
    let tr = this.parentNode.parentNode;
    let id = this.getAttribute('question_id');
     
    questionOperations.toggleMark(id);
    tr.classList.toggle("alert-danger");
    updateCounts();
}
function createDelIcon(path,id){
    var img = document.createElement('img');
    img.src = path;
    img.className = "size";

    img.setAttribute('question_id',id);
    img.addEventListener('click',markToggle);
    return img;
}
function createEditIcon(path,id){
    var img = document.createElement('img');
    img.src = path;
    img.className = "size";
    img.setAttribute('question_id',id);
    img.addEventListener('click',populateFormFields);
    return img;
}
function populateFormFields(){
    let id= this.getAttribute('question_id');
    let questionObject = questionOperations.search(id);
    for(let key in questionObject){
        if(key == 'isMarked'){
            continue;
        }
        document.querySelector('#'+key).value = questionObject[key];
    }
}
//getting value from view add them into object and object add into array
function printQuestion(questionObject){
    let tbody = document.querySelector('#questions');
    let tr = tbody.insertRow();
    let index= 0;
    for(let key in questionObject){
        if(key == 'isMarked'){
            continue;
        }
        let td = tr.insertCell(index);
        td.innerText = questionObject[key];
        index++;   
    }    
    let td = tr.insertCell(index);
    td.appendChild(createDelIcon('images/trash.png',questionObject.questionId ));
    td.appendChild(createEditIcon('images/edit.png',questionObject.questionId));
}
function addQuestion(){
    let questionObject = new Question();
    for (let key in questionObject){
        if(key == 'isMarked'){
            continue;
        }
        questionObject[key] = document.querySelector('#'+key).value;
    } 
    //validate question object in not empty
     if(!validate(questionObject)){
        message("All fields are required!","alert-danger");
        return;
     } 
    questionOperations.add(questionObject);
    //printQuestion(questionObject);
    //add object into firebase database
    dbOperations.add(questionObject);
    message("Inserted Successfully","alert-success");
    resetForm();
}
function validate(obj){
    delete obj["isMarked"];
    let result = true;
    for (var key in obj) {
        if (obj[key] === null || obj[key] === ""){
            result = false;
            break;
        }    
    }
    return result;
}

function* infiniteNumber(){
    let i=1;
    while(true){
        yield i;
        i++;
    }
}





