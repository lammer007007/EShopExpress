let products;
fetch('/products')
.then(r => r.json())
.then(res => {
    products = res;
    for(i of res){
        let div = document.createElement('div');
        div.className = 'product';
        div.dataset.id = i.id;
        div.innerHTML = `<img src="/images?id=${i.id}">` + 
        `<h3>${i.title}</h3>`;
        div.onclick = () => OpenProduct(div.dataset.id);
        document.querySelector('#products-div').append(div);
    }
    let url = new URL(location.href)
    if(url.searchParams.has('id') && +url.searchParams.get('id') 
        && products.find(i => i.id == +url.searchParams.get('id')) != null)
        OpenProduct(+url.searchParams.get('id'));
});

document.querySelector('input[type="file"]').addEventListener('input', event =>{
    let fr = new FileReader();
    fr.onload =  () => document.querySelector('#product-img').src = fr.result;
    fr.readAsDataURL(event.target.files[0]);
});

document.querySelector('#cancel-img').addEventListener('click', () => {
    document.querySelector('input[type="file"]').value = '';
    document.querySelector('#product-img').src = '/images?id=' + document.forms[0].elements.id.value;
});

document.querySelector('#product-img').addEventListener('click', () => {
    document.querySelector('input[type="file"]').click();
});

document.querySelector('#form-div').addEventListener('click', event => {
    if(event.currentTarget != event.target)
        return;
    document.forms[0].scrollTop = 0;
    document.querySelector('#product-info').scrollTop = 0;
    document.forms[0].style.display = '';
    document.querySelector('#product-info').style.display = 'none';
    event.currentTarget.style.display = 'none';
    document.querySelector('#screen').style.display = 'none';
    document.body.style.overflow = '';
    document.forms[0].reset();
    document.querySelector('#product-img').src = '/images';
    document.forms[0].elements.clear.parentNode.style.display = '';
    document.querySelector('input[type="file"]').disabled = false;
    document.querySelector('#cancel-img').disabled = false;
    document.querySelector('input[type="submit"]').value = 'Добавить';
});

document.querySelector('#add-button').addEventListener('click', () => {
    document.querySelector('#form-div').style.display = '';
    document.querySelector('#screen').style.display = '';
    document.body.style.overflow = 'hidden';
    document.forms[0].elements.clear.parentNode.style.display = 'none';
});

document.querySelector('#edit-button').addEventListener('click', () => {
    document.forms[0].style.display = '';
    document.querySelector('#product-info').scrollTop = 0;
    document.querySelector('#product-info').style.display = 'none';
    document.querySelector('input[type="submit"]').value = 'Применить';
});

document.querySelector('#delete-button').addEventListener('click', () => {
    if(confirm('Вы действительно желаете удалить выбранный товар?')){
        fetch('/products', {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({id: document.forms[0].elements.id.value})
        })
        .then(r =>{
            if(r.ok)
                location.href = location.origin;
        })
    }
});

document.forms[0].elements.clear.addEventListener('change', event => {
    let file = document.querySelector('input[type="file"]')
    file.disabled = event.target.checked;
    document.querySelector('#cancel-img').disabled = event.target.checked;
    file.value = '';
    document.querySelector('#product-img').src = '/images?id=' + document.forms[0].elements.id.value;
});

function OpenProduct(id){
    let temp = products.find(i => i.id == id);
    if(temp == null)
        return;

    document.querySelector('#form-div').style.display = '';
    document.querySelector('#screen').style.display = '';
    document.body.style.overflow = 'hidden';
    document.forms[0].style.display = 'none';
    document.querySelector('#product-info').style.display = '';

    document.forms[0].elements.id.value = temp.id;
    document.forms[0].elements.title.value = temp.title;
    document.querySelector('#info-title').innerHTML = temp.title;
    document.forms[0].elements.category.value = temp.category;
    document.querySelector('#info-category').innerHTML = temp.category;
    document.forms[0].elements.price.value = temp.price;
    document.querySelector('#info-price').innerHTML = temp.price;
    document.forms[0].elements.description.value = temp.description;
    document.querySelector('#info-desc').innerHTML = temp.description;
    document.querySelector('#product-img').src = '/images?id=' + id;
    document.querySelector('#info-img').src = '/images?id=' + id;
}