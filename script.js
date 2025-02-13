window.onload = function () {
    let animals = JSON.parse(localStorage.getItem("animals")) || [];
    const animalCardsContainer = document.getElementById("animal-cards");

    if (animalCardsContainer) {
        renderAnimalCards(animals);
    }

    // Aplica o filtro ao carregar a página
    filterAnimals();
};

// Função que aplica o filtro por nome e tipo
function filterAnimals() {
    const searchTerm = document.getElementById('search-animal').value.toLowerCase();
    const selectedType = document.getElementById('animal-type').value;

    // Obtém os animais armazenados no localStorage
    let animals = JSON.parse(localStorage.getItem("animals")) || [];

    // Filtra os animais com base no tipo e nome
    const filteredAnimals = animals.filter(animal => {
        const matchesName = animal.name.toLowerCase().includes(searchTerm);
        const matchesType = selectedType ? animal.type === selectedType : true;
        return matchesName && matchesType;
    });

    // Renderiza os animais filtrados
    renderAnimalCards(filteredAnimals);
}

// Renderiza os cards dos animais
function renderAnimalCards(animals) {
    const animalCardsContainer = document.getElementById("animal-cards");
    animalCardsContainer.innerHTML = "";

    if (animals.length === 0) {
        animalCardsContainer.innerHTML = "<p>Não há animais registrados ainda.</p>";
        return;
    }

    animals.forEach((animal, index) => {
        const card = document.createElement("div");
        card.classList.add("animal-card");

        // Verifica o status do animal e adiciona a faixa vermelha de adoção
        if (animal.status === "aguardando") {
            const adoptionFlag = document.createElement("div");
            adoptionFlag.classList.add("adoption-flag");
            adoptionFlag.innerText = "Em processo de adoção";
            card.appendChild(adoptionFlag);
        } else if (animal.status === "adotado") {
            card.classList.add("adopted");
        }

        const img = document.createElement("img");
        img.src = animal.image || "placeholder.jpg";
        img.alt = animal.name;

        const name = document.createElement("h4");
        name.innerText = animal.name;

        const location = document.createElement("p");
        location.innerText = `Localização: ${animal.location}`;

        const description = document.createElement("p");
        description.innerText = animal.description;

        const adoptBtn = document.createElement("button");
        adoptBtn.classList.add("adopt-btn");
        adoptBtn.innerText = animal.status === "aguardando" || animal.status === "adotado" ? "Em análise" : "Adotar";
        adoptBtn.disabled = animal.status === "aguardando" || animal.status === "adotado";
        adoptBtn.onclick = function () {
            openAdoptionModal(index);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerText = "Excluir";
        deleteBtn.onclick = function () {
            deleteAnimal(index);
        };

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(location);
        card.appendChild(description);
        if (animal.status !== "adotado") {
            card.appendChild(adoptBtn);
        }
        card.appendChild(deleteBtn);
        animalCardsContainer.appendChild(card);
    });
}

// Abre o modal de adoção
function openAdoptionModal(index) {
    const modal = document.getElementById("adoption-modal");
    modal.style.display = "flex";
    document.getElementById("animal-index").value = index;

    document.getElementById("confirm-adoption").onclick = function () {
        confirmAdoption(index);
    };
}

// Fecha o modal
function closeModal() {
    document.getElementById("adoption-modal").style.display = "none";
}

// Fecha o modal se o usuário clicar fora da caixa de conteúdo
window.onclick = function (event) {
    const modal = document.getElementById("adoption-modal");
    if (event.target === modal) {
        closeModal();
    }
};

// Confirma a adoção e altera o status
function confirmAdoption(index) {
    let animals = JSON.parse(localStorage.getItem("animals")) || [];
    animals[index].status = "aguardando";
    localStorage.setItem("animals", JSON.stringify(animals));
    renderAnimalCards(animals); // Atualiza os cards sem recarregar a página
}

// Exclui um animal
function deleteAnimal(index) {
    let animals = JSON.parse(localStorage.getItem("animals")) || [];
    animals.splice(index, 1);
    localStorage.setItem("animals", JSON.stringify(animals));
    renderAnimalCards(animals); // Atualiza os cards sem recarregar a página
}

// Captura e armazena a imagem da câmera
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture-btn");

if (video && canvas && captureBtn) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.log("Erro ao acessar a câmera: ", error);
        });

    captureBtn.addEventListener("click", function () {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        capturedImage = canvas.toDataURL("image/png");
        alert("Foto capturada com sucesso!");
    });
}

// Registra um novo animal
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("description").value;
        const type = document.getElementById("animal-type").value; // Novo campo de tipo

        const animal = {
            name,
            location,
            description,
            type, // Salva o tipo do animal
            image: capturedImage || "placeholder.jpg",
            status: "disponível",
        };

        let animals = JSON.parse(localStorage.getItem("animals")) || [];
        animals.push(animal);

        localStorage.setItem("animals", JSON.stringify(animals));

        document.getElementById("form-feedback").innerText = "Animal registrado com sucesso!";
        setTimeout(function () {
            window.location.href = "animals-registered.html";
        }, 2000);
    });
}

// Filtros de nome e tipo
document.getElementById('search-animal').addEventListener('input', filterAnimals);
document.getElementById('animal-type').addEventListener('change', filterAnimals);
