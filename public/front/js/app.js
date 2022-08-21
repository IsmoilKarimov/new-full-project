let footerCategory = document.getElementById('footerCategory')
let menuCategory = document.getElementById('menuCategory')

fetch('/category/all')
.then(res => res.json())
.then(data => {
    data.footerCategory.forEach(category =>{            
        footerCategory.innerHTML += `
            <li><a href="/category/show/${category._id}">${category.title}</a></li>                               `
    })                 
    data.menuCategory.forEach(category =>{
        menuCategory.innerHTML += `
            <li><a href="/category/show/${category._id}">${category.title}</a></li>                               `
    })
    if(document.getElementById('statusCategory')){
        let statusCategory = document.getElementById('statusCategory')
        data.statusCategory.forEach(category => {
            statusCategory.innerHTML += `
                <li><a href="/category/show/${category._id}">${category.title} (${category.count})</a></li>
            `
        })
    }
})