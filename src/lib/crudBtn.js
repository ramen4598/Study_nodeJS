function redirect(self, id){
    if (self.value === 'create'){
        window.location.href = '/create';
    } else if (self.value === 'update'){
        window.location.href = `/update?id=${id}`;
    }
}