
fetch('/settings/all')
.then(res => res.json())
.then(data => {
    
    document.getElementById('copyright').textContent = data.copyright

})