export const patterns = {
  READING_PROGRESS: {
    CREATE: { cmd: 'create_progress' },
    UPDATE: { cmd: 'update_progress' },
    FIND_ALL: { cmd: 'find_all_books_in_reading_by_user' },
    DELETE: { cmd: 'delete_progress' },
  },
  BOOK: {
    RECOMMEND: { cmd: 'recommend_books' },
  },
};
