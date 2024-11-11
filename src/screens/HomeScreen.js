import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getBooks } from '../../firebaseService';

function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedBooks = await getBooks();
      setBooks(fetchedBooks);
    };
    fetchBooks();
  }, []);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
      <View style={styles.bookItem}>
        <Text style={styles.bookTitle}>{item.BookName}</Text>
        <Text style={styles.bookAuthor}>by {item.Author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  bookItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default HomeScreen;
