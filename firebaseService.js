import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA31zMdxkyg2TERa0djFPQ9Z8VxZ8jZt6o",
  authDomain: "book-1347b.firebaseapp.com",
  databaseURL: "https://book-1347b-default-rtdb.firebaseio.com",
  projectId: "book-1347b",
  storageBucket: "book-1347b.firebasestorage.app",
  messagingSenderId: "692690056847",
  appId: "1:692690056847:web:909a783c5e0298829422fa",
  measurementId: "G-1Y74XSJWXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to initialize user data if it doesn't exist
const initializeUserData = async () => {
  const userDataRef = doc(db, 'UserData', 'borrowedBooks');
  const userDataSnap = await getDoc(userDataRef);
  if (!userDataSnap.exists()) {
    await setDoc(userDataRef, { borrowedBooks: [] });
  }
};

export const getBooks = async () => {
  try {
    const booksCol = collection(db, 'BooksCollection');
    const bookSnapshot = await getDocs(booksCol);
    return bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const bookRef = doc(db, 'BooksCollection', bookId);
    const bookSnap = await getDoc(bookRef);
    if (bookSnap.exists()) {
      return { id: bookSnap.id, ...bookSnap.data() };
    } else {
      console.log(`Book with ID ${bookId} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching book details for ID ${bookId}:`, error);
    throw error;
  }
};

export const borrowBook = async (bookId) => {
  try {
    await initializeUserData();
    const userDataRef = doc(db, 'UserData', 'borrowedBooks');
    const userDataSnap = await getDoc(userDataRef);
    const borrowedBooks = userDataSnap.data().borrowedBooks || [];

    if (borrowedBooks.length >= 3) {
      throw new Error('User has already borrowed the maximum number of books');
    }

    await updateDoc(userDataRef, {
      borrowedBooks: arrayUnion(bookId)
    });

    console.log(`Book ${bookId} borrowed successfully`);
  } catch (error) {
    console.error(`Error borrowing book ${bookId}:`, error);
    throw error;
  }
};

export const returnBook = async (bookId) => {
  try {
    const userDataRef = doc(db, 'UserData', 'borrowedBooks');
    await updateDoc(userDataRef, {
      borrowedBooks: arrayRemove(bookId)
    });
    console.log(`Book ${bookId} returned successfully`);
  } catch (error) {
    console.error(`Error returning book ${bookId}:`, error);
    throw error;
  }
};

export const getBorrowedBooks = async () => {
  try {
    await initializeUserData();
    const userDataRef = doc(db, 'UserData', 'borrowedBooks');
    const userDataSnap = await getDoc(userDataRef);
    const borrowedBookIds = userDataSnap.data().borrowedBooks || [];

    const bookPromises = borrowedBookIds.map(async (bookId) => {
      const bookRef = doc(db, 'BooksCollection', bookId);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        return { id: bookSnap.id, ...bookSnap.data() };
      } else {
        console.log(`Book with ID ${bookId} not found`);
        return null;
      }
    });

    const books = await Promise.all(bookPromises);
    return books.filter(book => book !== null);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    throw error;
  }
};