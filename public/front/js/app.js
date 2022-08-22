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

fetch('/settings/all')
.then(res => res.json())
.then(data => {

    document.getElementById('footer_text').textContent = data.footer_text
    document.getElementById('facebook').setAttribute('href',data.facebook)
    document.getElementById('twitter').setAttribute('href',data.twitter)
    document.getElementById('youtube').setAttribute('href',data.youtube)
    document.getElementById('instagram').setAttribute('href',data.instagram)
    document.getElementById('copyright').textContent = data.copyright
    // document.getElementById('myEmail').textContent = data.myEmail

})