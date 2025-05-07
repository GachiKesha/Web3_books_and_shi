export const patterns = {
  USER: {
    CREATE: { cmd: 'create_user' },
    LOGIN: { cmd: 'login' },
    FIND_ALL: { cmd: 'find_all_users' },
    FIND_BY_ID: { cmd: 'find_user_by_id' },
    UPDATE: { cmd: 'update_user' },
    DELETE: { cmd: 'delete_user' },
    FIND_BY_EMAIL: { cmd: 'find_user_by_email' },
    RESET_PASSWORD: { cmd: 'reset_password' },
  },
  BOOK: {
    CREATE: { cmd: 'create_book' },
    UPDATE: { cmd: 'update_book' },
    FIND_ALL: { cmd: 'find_all_books' },
    FIND_BY_ID: { cmd: 'find_book_by_id' },
    DELETE: { cmd: 'delete_book' },
  },
  READING_PROGRESS: {
    CREATE: { cmd: 'create_progress' },
    UPDATE: { cmd: 'update_progress' },
    FIND_ALL: { cmd: 'find_all_books_in_reading_by_user' },
    DELETE: { cmd: 'delete_progress' },
    RECOMMEND: { cmd: 'recommend_books' },
  },
};
