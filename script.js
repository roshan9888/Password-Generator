const inputslider=document.querySelector("[data-lenghtSlider]");
const lengthdisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copymsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generateButton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordlength=15;
let checkcount=0;
handleslider();

setIndicator("#ccc");

function handleslider(){
     inputslider.value=passwordlength;
     lengthdisplay.innerText=passwordlength;
     const min=inputslider.min;
     const max=inputslider.max;
     inputslider.style.backgroundSize=((passwordlength-min)*100/(max-min))+"%100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color; 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercasecheck.checked) hasUpper=true;
    if(lowercasecheck.checked) hasLower=true;
    if(numberscheck.checked) hasNum=true;
    if(symbolscheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordlength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordlength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }    
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
}
copyMsg.classList.add("active");

setTimeout( ()=>{
    copyMsg.classList.remove("active");
},2000);

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

inputslider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleslider();
})

copybtn.addEventListener('click',()=>{
      if(passwordDisplay.value){
        copyContent();
      }
})

function handleCheckBoxChange(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });

    if(password.length<checkcount){
        passwordlength=checkcount;
        handleslider();
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})


generatebtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkcount == 0) 
        return;

    if(passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
password="";

let funcArr=[];

if(uppercasecheck.checked){
    funcArr.push(generateUppercase);
}

if(lowercasecheck.checked){
    funcArr.push(generateLowerCase);
}

if(numberscheck.checked){
    funcArr.push(generateRandomNumber);
}

if(symbolscheck.checked){
    funcArr.push(generateSymbol);
}

for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
}

for(let i=0;i<passwordlength-funcArr.length;i++){
    let randIndex=getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
}

password=shufflePassword(Array.from(password));

passwordDisplay.value=password;
calcStrength();

});



