//console.log(screen.height);
document.querySelector("div[role='main']").style.height = "" + (screen.height - 80) + "px";

function addsor (szoveg) {
  var span = document.createElement("ul");
  span.innerHTML = szoveg;
  document.getElementById("notes").appendChild(span);
  //document.getElementById("notes").value = szoveg;
}

var Factory = window.indexedDB;
var OpenDB = Factory.open ("JegyzetTar", 1);

OpenDB.onupgradeneeded = function (evt) {
    var IDBDatabase_db = evt.currentTarget.result;
    
    var IDBObjectStore_os = IDBDatabase_db.createObjectStore ("Jegyzetek", {keyPath: "Id", autoIncrement: true});
    
    IDBObjectStore_os.createIndex ("Id", "Id", {unique: true});
    
};


OpenDB.onsuccess = function () {
  var Database_db = this.result;
  
  var Transaction_trans = Database_db.transaction ("Jegyzetek", "readonly");
    
  Transaction_trans.oncomplete = function () {
      Database_db.close ();
  };
  
  var ObjectStore_oswt = Transaction_trans.objectStore ("Jegyzetek");
  
  var Request_Curzor = ObjectStore_oswt.openCursor ();
  Request_Curzor.onsuccess = function (evt) {
    var CursorWithValue_cursor = evt.target.result;
    
    if (CursorWithValue_cursor) {
        if (CursorWithValue_cursor.value !== null) {
            addsor (CursorWithValue_cursor.value.Szoveg + "<br/>");
        }
        CursorWithValue_cursor.continue ();
    }
    
    else {
      console.log ("Végetért a kiírás");
    }
    
  };
  
  Request_Curzor.onerror = function () {
   console.log ("Hiba a kurzor megnyitásakor!");
  };
  
};

function addNotes() {
  var Factory_db = window.indexedDB;
  
  var OpenDBRequest = Factory_db.open ("JegyzetTar", 1);
  
  OpenDBRequest.onsuccess = function () {
    var IDBDatabase_db = this.result;
    var Transaction = IDBDatabase_db.transaction ("Jegyzetek", "readwrite");
    
    Transaction.oncomplete = function () {
      addsor(document.getElementById("note").value);
      IDBDatabase_db.close ();
    };
    
    var ObjectStore = Transaction.objectStore ("Jegyzetek");
    
    var note = {Szoveg: document.getElementById("notes").value};
    
    var Request = ObjectStore.add (note);
    Request.onsuccess = function () {
      console.log ("Sikerült a jegyzet hozzáadása: jegyzet szövege: " + note.Szoveg);
    };
    
    Request.onerror = function () {
      console.log ("Hiba történt a jegyzet létrehozásakor!");
    };
    
    
  };
  
  OpenDBRequest.onerror = function () {
    console.log ("Hiba történt az Adatbázis megnyitásakor!");
  };
}

function clearData() {
  var IDBOpenDBRequest = window.indexedDB.deleteDatabase ("JegyzetTar");
                IDBOpenDBRequest.onsuccess = function () {
                  console.log ("Sikerült az adatbázis törlése!");    
                };
              
                IDBOpenDBRequest.onerror = function () {
                  console.log ("Hiba az adatbázis törlésekor!");    
                };
              
                window.location.href = "index.html";
  
  
};

document.getElementById("remove").addEventListener("click", clearData);

document.getElementById("add").addEventListener("click", addNotes);