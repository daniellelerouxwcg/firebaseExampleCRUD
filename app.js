/******************************
 * Firebase setup
 ******************************/
const firebaseConfig = {
  apiKey: "AIzaSyDmi-1xhMNBhuOthnnEVNqPWui2HvUN3yk",
  authDomain: "later-log.firebaseapp.com",
  projectId: "later-log",
  storageBucket: "later-log.firebasestorage.app",
  messagingSenderId: "40423113360",
  appId: "1:40423113360:web:d7f7fec21396b36740ce15"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const collectionRef = db.collection("LaterLogs");

/******************************
 * DOM references
 ******************************/
const messageInput = document.getElementById("messageInput");
const addBtn = document.getElementById("addBtn");
const dataList = document.getElementById("dataList");

/******************************
 * Event bindings
 ******************************/
addBtn.addEventListener("click", addDocument);

/******************************
 * CREATE
 ******************************/
function addDocument() {
  const message = messageInput.value.trim();
  if (!message) {
    alert("Message required");
    return;
  }

  collectionRef.add({
    message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
}

/******************************
 * READ (real-time)
 ******************************/
collectionRef
  .orderBy("createdAt", "desc")
  .onSnapshot((snapshot) => {
    dataList.innerHTML = "";

    if (snapshot.empty) {
      dataList.innerHTML = "<li>No data found</li>";
      return;
    }

    snapshot.forEach((doc) => {
      renderItem(doc);
    });
  });

/******************************
 * UPDATE
 ******************************/
function updateDocument(id) {
  const newText = prompt("Enter new message:");
  if (!newText) return;

  collectionRef.doc(id).update({
    message: newText
  });
}

/******************************
 * DELETE
 ******************************/
function deleteDocument(id) {
  if (!confirm("Delete this document?")) return;
  collectionRef.doc(id).delete();
}

/******************************
 * UI rendering
 ******************************/
function renderItem(doc) {
  const data = doc.data();
  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${data.message}</strong><br>
    <small>${data.createdAt?.toDate?.().toLocaleString() || ""}</small>
    <div class="actions">
      <button onclick="updateDocument('${doc.id}')">✏️ Edit</button>
      <button onclick="deleteDocument('${doc.id}')">🗑 Delete</button>
    </div>
  `;

  dataList.appendChild(li);
}

/* expose functions used by HTML */
window.updateDocument = updateDocument;
window.deleteDocument = deleteDocument;
