import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { getBookDetails, borrowBook, getBorrowedBooks } from '../../firebaseService';

function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bookDetails, borrowedBooks] = await Promise.all([
          getBookDetails(bookId),
          getBorrowedBooks()
        ]);
        setBook(bookDetails);
        setBorrowedCount(borrowedBooks.length);
      } catch (err) {
        setError('Failed to load book details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [bookId]);

  const handleBorrow = async () => {
    if (borrowedCount >= 3) {
      Alert.alert('Limit Reached', 'You cannot borrow more than three books at a time.');
      return;
    }
    try {
      await borrowBook(bookId);
      Alert.alert('Success', 'Book borrowed successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to borrow the book. Please try again.');
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!book) return <Text style={styles.errorText}>Book not found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Image source={{ uri: book.Image }} style={styles.cover} />
        <Text style={styles.title}>{book.BookName}</Text>
        <Text style={styles.author}>by {book.Author}</Text>
        <Text style={styles.rating}>Rating: {book.Review}/5</Text>
        <Text style={styles.summary}>{book.Summary}</Text>
        <TouchableOpacity style={styles.borrowButton} onPress={handleBorrow}>
          <Text style={styles.borrowButtonText}>Borrow Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  cover: {
    width: '100%',
    height: Dimensions.get('window').width * 0.7, // Aspect ratio for cover image
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  borrowButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  borrowButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

export default BookDetailScreen;
