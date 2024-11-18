const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const id = generateId();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;
   
    const BookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(BookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    
    saveData();
    alert("Buku berhasil ditambahkan.")
    document.getElementById('bookFormTitle').value = "";
    document.getElementById('bookFormAuthor').value = "";
    document.getElementById('bookFormYear').value = "";
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBooks = document.getElementById('incompleteBookList');
    uncompletedBooks.innerHTML = '';

    const completedBooks = document.getElementById('completeBookList');
    completedBooks.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBooks.append(bookElement);
        }
        else{
            completedBooks.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const container = document.createElement('div');
    container.setAttribute('data-bookid', bookObject.id);
    container.setAttribute('data-testid', 'bookItem');

    const judulBuku = document.createElement('h3');
    judulBuku.innerText = bookObject.title;
    judulBuku.setAttribute('data-testid', 'bookItemTitle');
    container.appendChild(judulBuku);

    const penulisBuku = document.createElement('p');
    penulisBuku.innerText = bookObject.author;
    penulisBuku.setAttribute('data-testid', 'bookItemAuthor');
    container.appendChild(penulisBuku);

    const tahunBuku = document.createElement('p');
    tahunBuku.innerText = bookObject.year;
    tahunBuku.setAttribute('data-testid', 'bookItemYear');
    container.appendChild(tahunBuku);

    const buttonContainer = document.createElement('div');

    const completeButton = document.createElement('button');
    if (bookObject.isCompleted) {
        completeButton.innerText = "Belum Selesai";
    } else {
        completeButton.innerText = "Selesai dibaca";
    }
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.addEventListener('click', function() {
        if (bookObject.isCompleted) {
            undoBookFromCompleted(bookObject.id);
        } else {
            addBookToCompleted(bookObject.id);
        }
    });
    buttonContainer.appendChild(completeButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Hapus Buku";
    deleteButton.classList = "hapus";
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.addEventListener('click', function() {
        removeBookFromCompleted(bookObject.id);
    });
    buttonContainer.appendChild(deleteButton);

    container.appendChild(buttonContainer);

    return container;
}


function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dipindahkan.")
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dihapus.")
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dipindahkan.")
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert('Mohon maaf, Browser ini tidak mendukung local storage.');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const bookData of data) {
        books.push(bookData);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}