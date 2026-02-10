/******************************
 * Firebase setup
 ******************************/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTHDOMAIN.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET.firebasestorage.app",
  messagingSenderId: "MESSAGEINGSENDERID",
  appId: "APPID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const collectionRef = db.collection("YOUR COLLECTION NAME");

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

