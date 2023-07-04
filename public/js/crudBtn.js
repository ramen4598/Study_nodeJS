function redirect(self, id){
    if (self.value === 'create'){
        window.location.href = '/topic/create';
    } else if (self.value === 'update'){
        window.location.href = `/topic/update/${id}`;
    }
}