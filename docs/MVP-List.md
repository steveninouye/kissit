# Kiss IT MVP List

Kiss IT is an search application which any user can search for code examples, documentation, video tutorials, and Q&A forum threads. Its main purpose would be to give the public an easy to use tool to learn programming in any area.

1.  Authentication (4 days)

    - User can log in via GitHub OAuth 2.0
      - User can refresh the page and stay logged in
      - User has the option to log out
      - User is unable to visit the log in page
      - User is able to navigate to protected routes
      - Application gives feedback to user upon log in submission
        - log in errors
        - log in confirmation
    - Users can Log Out
      - User has the option to log in and sign up
      - Does not allow user to navigate to protected routes

2.  Homepage (4 day)

    - Homepage is styled with links to sign up, log in, and log out

3.  Search Page (4 days)

    - Search page is built and styled

4.  Search (6 days)

    - User can search for files containing search input
      - By Language
      - By File Extension
    - User can search for files containing multiple search input
    - User gets results back of files that contain strings of code with corresponding language
    - Results are stored in the database

5.  Storing following users in Database (4 days)

    - Upon log in, users that current user is following is saved to database
    - Database stores relation of current user and users current user is following

6.  Following User Search Results (10 days)

    - Search results are displayed for files of users they are following
    - Users can select which users files to view by checkbox input

7.  User file likes

    - User can like a file according to their search
    - Database stores relation of current user, file, and search input

8.  Search Result Sorting
    - Search results are displayed in order (top to bottom):
      - Current user files with most likes
      - Current user files with least likes
      - Current user following users' files with most likes
      - Current user following users' files with least likes
