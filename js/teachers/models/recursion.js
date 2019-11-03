const x = {
    a:"",
    b:[],
    c:{
      x:[]
    },
    d:{
      x:{
        y:{
          z:''
        }
      }
    }
  };
  function checkEmpty(obj){
    
    for(let key in obj){
      //if the value is 'object'
      if(obj[key] instanceof Object === true){
        if(checkEmpty(obj[key]) === false) return false;
      }
      //if value is string/number
      else{
        //if array or string have length is not 0.
        if(obj[key].length !== 0) return false;
      }
    }
    return true;
  }
  console.log(checkEmpty(x))
  x.d.x.y.z = 0;
  console.log(checkEmpty(x));