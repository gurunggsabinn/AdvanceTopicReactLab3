import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { returnBook, getBookDetails } from '../../firebaseService';

const db = getFirestore();

function BorrowedScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = fetchBorrowedBooks();
    return () => unsubscribe();
  }, []);

  const fetchBorrowedBooks = () => {
    const userRef = doc(db, 'UserData', 'borrowedBooks');

    return onSnapshot(userRef, async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const bookIds = data.borrowedBooks || [];
        const booksDetails = await Promise.all(bookIds.map(id => getBookDetails(id)));
        
        setBorrowedBooks(booksDetails);
        setIsLoading(false);
      } else {
        setBorrowedBooks([]);
        setIsLoading(false);
      }
    }, (error) => {
      setError('Failed to fetch borrowed books. Please try again.');
      setIsLoading(false);
    });
  };

  const handleReturn = async (bookId) => {
    try {
      await returnBook(bookId);
      Alert.alert('Success', 'Book returned successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to return the book. Please try again.');
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.BookName}</Text>
        <Text style={styles.bookAuthor}>by {item.Author}</Text>
      </View>
      <TouchableOpacity style={styles.returnButton} onPress={() => handleReturn(item.id)}>
        <Text style={styles.returnButtonText}>Return</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Borrowed Books</Text>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooksText}>No borrowed books</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f0f2f5',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#34495e',
    marginBottom: 16,
    textAlign: 'center',
  },
  noBooksText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  bookItem: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  returnButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BorrowedScreen;
