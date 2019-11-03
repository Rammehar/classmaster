const dbOperations  = {
    db: firebase.database(),
    add(questionObject) {
      this.db.ref('questions').push().set(questionObject);
      //firebase.database().ref('questions').set(questionObject);
    },
    getQuestion(callbackData,callbackError){
      // Attach an asynchronous callback to read the data 
        this.db.ref('questions').on("value", callbackData, callbackError);
    },
    updateQuestion(questionObject){
      this.db.ref('questions/' + questionObject.questionId).set(questionObject);
    }
    
    
}