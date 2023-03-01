function delay(ms) {
    return new Promise((resolve)=>{
        // setTimeout(()=>{resolve();}, ms);
        setTimeout(resolve, ms);
    });
}

// 엄
async function getUm(){
    await delay(2000);
    return '엄.';
}
// 준
async function getJun(){
    await delay(2000);
    return '준.';
}
//식
async function getSik(){
    await delay(2000);
    return '식';
}
// 어떻게 사람 이름이...

async function printUJS(){
    const UmPromise = getUm();
    const JunPromise = getJun();
    const SikPromise = getSik();
    Um = await UmPromise;
    Jun = await JunPromise;
    Sik = await SikPromise;
    console.log(Um + Jun + Sik);
}

printUJS();

// Promise.all
async function printUJS2(){
    return Promise.all([getUm(),getJun(),getSik()])
    .then(name => name.join(''));
}
printUJS2().then(console.log);
// printUJS2().then(name =>{console.log(name)});