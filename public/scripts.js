const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for(let item of menuItems){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

const formDelete = document.querySelector("#form-delete")
            formDelete.addEventListener("submit", function(event){
                const confirmation = confirm("Proceed with deleting user?")
                if(!confirmation){
                    event.preventDefault()
                }
            })