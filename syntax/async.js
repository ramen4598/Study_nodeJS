// 1. Promise
function getUm(){
    return new Promise((res, rej)=>{
        const Um ='엄.';
        setTimeout(()=>{
            res(Um);
        }, 2000);
    });
}

getUm().then( Um => {
    console.log(Um);
});

// 2. async & await
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function getJunSik() {
    const name = '준.식.';
    await delay(2000);
    console.log(name); // 10
}

getJunSik();