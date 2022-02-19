const ENDPOINT = "http://localhost:1717";
const mainContainer = document.querySelector(".main__container_admin");
const contactBtn = document.querySelector(".header__contact_btn");



const getData = async(route) => {
    const data = await fetch(`${ENDPOINT}/${route}`);
    return await data.json();
};

const getDataById = async(route, id) => {
    const data = await fetch(`${ENDPOINT}/${route}/${id}`);
    return await data.json();
};

const putData = async(route, id, item) => {
    return await fetch(`${ENDPOINT}/${route}/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),

    })
}
const deleteData = async(route, id) => {
    return await fetch(`${ENDPOINT}/${route}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
}



const createElement = (tag, className, text, innerHTML) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

const openModal = (overflow) => {
    overflow.style.opacity = 1;
    overflow.style.visibility = "inherit";
}

const closeModal = (overflow) => {
    overflow.style.opacity = 0;
    overflow.style.visibility = "hidden";
}

const createPastry = async(pastry) => {
    mainContainer.innerHTML = "";
    pastry.forEach(element => {
        const mainItems = createElement("div", "main__items_admin");
        const id = element.id;


        const nameContent = createElement("div", "admin__main-name");
        const itemName = createElement("p", "item__name_admin", element.name);
        const editName = createElement("button", "edit_name button");

        nameContent.append(itemName, editName);

        const priceContent = createElement("div", "admin__main-price");
        const itemPriceText = createElement("p", "item__price_text", "Price:");
        const itemPrice = createElement("div", "item__price_admin", `$ ${element.cost.toFixed(2)}`);
        const itemPriceEdit = createElement("button", "edit_price button");

        priceContent.append(itemPriceText, itemPrice, itemPriceEdit);

        const inStock = createElement("div", "admin__main-instock ");
        const inStockText = createElement("p", "instock_text", "in stock:");
        const inStockMinus = createElement("button", "instock_minus button");
        const inStockValue = createElement("p", "instock_value", `${element.inStock || "0"}`);
        const inStockPlus = createElement("button", "instock_plus button");

        inStock.append(inStockText, inStockMinus, inStockValue, inStockPlus);


        const inStockDelete = createElement("button", "instock_delete button");


        mainItems.append(nameContent, priceContent, inStock, inStockDelete);
        mainContainer.append(mainItems);

        inStockMinus.addEventListener("click", () => {
            const item = getDataById("pastry/detail", id);
            item.then(data => putData("pastry/update", id, {
                inStock: data.inStock <= 0 ? 0 : --data.inStock,
            }));
            item.then(data => inStockValue.textContent = data.inStock);

        })
        inStockPlus.addEventListener("click", () => {
            const item = getDataById("pastry/detail", id);
            item.then(data => putData("pastry/update", id, {
                inStock: ++data.inStock
            }));
            item.then(data => inStockValue.textContent = data.inStock);

        })
        inStockDelete.addEventListener("click", async() => {
            await deleteData("pastry/delete", id);
            await getData("pastry").then(createPastry);
        })
        editName.addEventListener("click", () => {

            if (editName.style.backgroundImage == `url("../assets/admin_text_edit.svg")`) {
                const itemNameInput = document.querySelector(".item__name_input");

                const data = {
                    name: itemNameInput.value,
                }

                putData("pastry/update", id, data);
                editName.style.backgroundImage = `url(../assets/admin_text.svg)`;
                itemName.innerHTML = itemNameInput.value;

            } else {

                editName.style.backgroundImage = `url(../assets/admin_text_edit.svg)`;
                const item = getDataById("pastry/detail", id);
                item.then(date => itemName.innerHTML = ` <input type="text" class="item__name_input" value="${ date.name }">`);


            }
        })

        itemPriceEdit.addEventListener("click", () => {

            if (itemPriceEdit.style.backgroundImage == `url("../assets/admin_text_edit.svg")`) {
                const itemPriceInput = document.querySelector(".item__price_input");
                if (itemPriceInput.value <= 0) {
                    itemPriceInput.value = 0;
                }
                const data = {
                    cost: Number(itemPriceInput.value),
                }

                putData("pastry/update", id, data);
                itemPriceEdit.style.backgroundImage = `url(../assets/admin_text.svg)`;
                const priceValue = itemPriceInput.value;
                itemPrice.innerHTML = `$ ${Number(priceValue).toFixed(2)}`;

            } else {

                itemPriceEdit.style.backgroundImage = `url(../assets/admin_text_edit.svg)`;
                const item = getDataById("pastry/detail", id);
                item.then(date => itemPrice.innerHTML = ` <span>$</span> <input type="number" class="item__price_input" value="${date.cost.toFixed(2)}">`);


            }
        })

    });

}
getData("pastry").then(createPastry);
getData("pastry").then(data => console.log(data));


const contactModal = document.querySelector(".contact-modal");
const goTo = document.querySelector(".contact-modal__admin-link");
goTo.textContent = "Go to main page";
goTo.setAttribute("href", "./index.html");

contactBtn.addEventListener("click", () => {
    openModal(contactModal);
});

const closeContactModal = document.querySelector(".contact-modal__close");
closeContactModal.addEventListener("click", () => {
    closeModal(contactModal);
});