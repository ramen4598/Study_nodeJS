const asyncFn={
	getName : () => {
		const name = '엄준식';
		return new Promise((resolve, reject) => {
            try {
                setTimeout(()=>{
                    resolve(name);}
                    , 3000
                );
            } catch (error) {
                reject(new Error('Error!'));
            }
		});
	},
    getUm : ()=>{
        const Um = '엄';
        return new Promise((resolve, reject)=> {
            setTimeout(()=>{
                resolve(Um);
                }, 3000
            );
        });
    },
    getJun : (callback)=>{
        const Jun = '준';
        setTimeout(()=>{
            callback(Jun);
            }, 3000
        );
    },
};
module.exports = asyncFn;