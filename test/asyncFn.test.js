const aFn = require('./asyncFn');

test('어떻게 사람 이름이 ...', ()=>{
	return aFn.getName().then((name)=>{
		expect(name).toBe('엄준식');
    },(reason)=>{
        expect(reason).toBe('Error!');
    });
});

test('어떻게 사람 이름이 ...', ()=>{
	return expect(aFn.getName()).resolves.toBe('엄준식');
});
/*
test('어떻게 사람 이름이 ...', ()=>{
	return expect(aFn.getName()).rejects.toMatch('Error!');
});
*/

test('어...어..어..ㅁ..', async()=> {
	const data = await aFn.getUm();
	expect(data).toBe('엄');
	expect(data).not.toBe('준');
	expect(data).not.toBe('식');
});

test('엄.준.', (done)=>{
    function callback(Jun) {
        try{
            expect(Jun).toBe('준');
            done();
        }catch(error){
            done(error);
        }
    }
    aFn.getJun(callback);
});