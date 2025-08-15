# Bookrates

An interactive website that gives you book recommendations! Input your past reading experiences and your preferences. We use a combination of content and collaborative filtering to score books from the Goodreads Young Adult Books dataset. 

Test it out at **bookrates.vercel.app**!!!


<img width="1000" height="600" alt="Screenshot 2025-08-15 at 1 57 22 PM" src="https://github.com/user-attachments/assets/a5a6cace-d510-4a06-9c5b-309b98c84686" />
<img width="735" height="797" alt="Screenshot 2025-08-15 at 1 58 13 PM" src="https://github.com/user-attachments/assets/c59d712d-985f-45e5-958e-8828f96d8da7" />


# Our Algorithm
We built our system using a combination of two existing recommendation strategies: content-based filtering and collaborative filtering. These methods work together to help you discover books that match both your preferences and your past reading experiences.

**Content Based Filtering**

Each book is evaluated based on attributes such as genre (shelf tags), number of pages, average rating, and ratings volume. We assign a weighted score to every candidate book based on how well it matches the user’s specified preferences. To ensure genre relevance, the requested genre must appear in the book’s top shelves with a minimum frequency threshold.

**Collaborative Filtering**

We constructed a sparse matrix of user-book ratings from the Goodreads dataset. When the user inputs their past reads, we add an extra matrix row for the user representing their likes/dislikes. We then factorize this matrix with Singular Value Decomposition (SVD) into lower-dimensional representations that capture hidden relationships between users and books. The reconstructed matrix tells us the user's predicted ratings, and are considered in a book's hybrid score.

We combine both content scores and collaborative scores (if feedback is provided) to produce a ranked list of books tailored just for you.

**Data Source**
All recommendations are powered by the Goodreads Young Adult Books and Interactions Dataset, consisting of over 93,000 books and 30+ million reader interactions, including detailed review and rating information.
