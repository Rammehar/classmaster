 
//singalton object
const questionOperations = {
    sortOrder:false,
    questions:[],
    add(questionObj){
        this.questions.push(questionObj);
    },
    clearAll(){
        return this.questions = [];
    },
    delete(){
       return this.questions = this.questions.filter(questionObj=>questionObj.isMarked == false);
    },
    search(id){
        return  this.questions.find(questionObj=>questionObj.questionId == id);
    },
    update(questionObj){
        let foundIndex = this.questions.findIndex(question=>question.questionId == questionObj.questionId);
        this.questions[foundIndex] = questionObj;
        console.log(this.questions);
    },
    sort(){
        this.sortOrder = !this.sortOrder;
        this.questions.sort((a,b)=>{
           return (this.sortOrder ?  a.questionId-b.questionId : b.questionId-a.questionId);
        });
    },
    countMarked(){
        return this.questions.filter(questionObj=>questionObj.isMarked).length;
    },
    toggleMark(id){
       this.search(id).toggle();
   },
}

