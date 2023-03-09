function redirect(self, title){
    if (self.value === 'create'){
        window.location.href = '/create';
    } else if (self.value === 'update'){
        window.location.href = `/update?id=${title}`;
    }
}