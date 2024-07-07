## Introduction
We will implement a simple front-end app that shows user posts. The app uses a JSON server, which uses a JSON file as a post database and displays the posts to the user, split into pages.

1. A JSON server is initialized using a JSON file to hold the posts. The JSON file is initially small, but you will replace it with your own, much larger, JSON file.
2. The client sees the posts split into pages: 10 posts at a page. Initially, only the first page is shown to the user.
3. The UI component used is called pagination. 
4. When a specific page loads, only the messages of that page will be sent from the server for obvious efficiency reasons.

## Submission
1. Submission is in pairs, but starting alone is better for practice.
2. Coding: 70%, Questions: 30%.
3. Your submitted git repo should be *private*, please make barashd@post.bgu.ac.il and nitzanlevy (github username) collaborators.
4. Do not use external libraries that provide the pagination component. If in doubt, contact the course staff.
5. Deadline: 11.6.24, end of day.
6. Additionally, solve the [theoretical questions](https://forms.gle/zGDQF3DcPaA6iqCw6).
7. Fill in repository details in (Moodle's "הגשה מטלה 1").
8. Use Typescript.
9. The ex1 forum is open for questions in Moodle.
10. Git repository content:
    1. Aim for a minimal repository size that can be cloned and installed:  most of the files in github should be code and package dependencies (package.json).
    2. Don't submit node_modules dir, .next project dir, json creation script, or json files.
11. If a certain case is not described here, you're free to code it as you see fit.

## Code
1. We haven't got to server side coding yet, in the meanwhile, you should add
    ```js
      "use client";
    ```
    to your topmost component, to signal react that this component tree is rendered by the client: [link](https://react.dev/reference/rsc/use-client) 
2. Won't be tested: aim for short components, there's no hard rule of how many. See [this discussion](https://stackoverflow.com/questions/75380858/how-to-deal-with-a-huge-number-of-components-in-a-page-in-react#:~:text=After%20a%20few%20years%20working,ll%20be%20hard%20to%20read.).
3. Won't be tested: see Airbnb's [coding style document](https://airbnb.io/javascript/react/).

## AI
Recommendation about using an AI assistant: You can ask questions and read the answers, but never copy them. Understand the details but write the code from memory. If two people copy the same AI code, it will be considered plagiarism.

## Plagiarism
1. We use a plagiarism detector.
2. The person who copies and the person who was copied from are both responsible. Set your repository private, and don't share your code.


### Github 
Hw1 will be submitted via Github. Please open a user with your email address.
To securely update files from your machine by SSH authentication:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys 


## Prerequisites
### Tools
1. Chrome browser (comes with DevTools built-in).
2. Visual Studio Code
3. Optional: Visual Studio Code [debugger](https://code.visualstudio.com/docs/)
3. [Next.js](https://nextjs.org/docs/getting-started/installation)
4. Git (Start here: [Atlassian](https://www.atlassian.com/git/tutorials/))

### Git - useful to know
1. clone
2. add
3. commit
4. push

### Json server - example code
In the following, `active_page` is the currently displayed page, and `POSTS_PER_PAGE` is 10, 'notes_url' is 'http://localhost:3001/notes'.
```js
    useEffect(() => {
        const promise = axios.get(NOTES_URL, {
            params: {
              _page: activePage,
              _per_page: POSTS_PER_PAGE
            }});
        promise.then(response => { 
            // fill
        }).catch(error => { console.log("Encountered an error:" + error)});
    });
```

See:
https://www.npmjs.com/package/json-server

### Github 
Hw1 will be submitted via Github. If you don't have a user, please create one with your BGU email address.

## Starting a new project:
1. Initiate a new repository or clone this one.
2. Start a new react project using create-next-app and use the default settings.
See [here](https://nextjs.org/docs/app/api-reference/create-next-app).
3. Install json-server locally
```bash
npm install json-server@0.17.4
```
4. Create and seed the database
Recommendation: Create a script that creates a JSON file with the number of posts given by an input N in the same format as 'notes.json.'
Use it to initialize a JSON file in, e.g., "./data/notes.json."

### Run the server with an input JSON file:
```bash
npx json-server --port 3001 --watch ./data/notes.json
```

### Run your code:
```bash
npm run dev
```
## Front end Description:
1. The front-end should connect to the server, and get posts (just) for the current page.
2. Each page has 10 posts.
3. add [pagination](https://www.w3schools.com/css/css3_pagination.asp) UI element to the website. 

## Suggested implementation steps:
1. Show a list of posts (tip: start from a local variable holding the post list.)
2. Connect to the server: (tip: start by getting all posts.)
3. Add pagination in the UI (tip: plan the component tree). 
4. Optimize: when rendering a page, send only the data needed now instead of the entire database.

## Pagination
1. The minimum number of page buttons is 1.
2. The maximum number of page buttons is 5.
3. The first page is 1.
4. The Active page button is shown in bold.
5. The 4 buttons with "First, Prev, Next, Last" text on them always appear.
6. Which page numbers should be shown on the buttons? Let `a` be the current page. 
    1. If there are <=5 total pages, show buttons [1, ..., , #Num_pages].
    2. If there are >=6 total pages, assume there are 10 ( but implement for any number of pages):
        1. if `a <3` : show buttons `[1,2,3,4,5]`
        2. if `3 <= a <= 8` : show buttons `[a-2,a-1,a,a+1,a+2]`
        3. if `a > 8`: show buttons `[6,7,8,9,10]`
    


## Checking the coding task:

## Test requirements
1. Each post should be of [class name](https://www.w3schools.com/html/html_classes.asp) **"post"**.
2. A post must get the unique ID from the database and use it as the [html id attribute](https://www.w3schools.com/html/html_id.asp).
3. Pagination buttons:
    1. Navigation buttons should be with [html name attribute](https://www.w3schools.com/tags/att_name.asp) **"first"**, **"previous"**, **"next"**, **"last"**.
    2. Page buttons should be with the [html name attribute](https://www.w3schools.com/tags/att_name.asp) **"page-<target_page_number>"**

### The tester will:
1. Clone and install your submitted GitHub repository.
    1. `git clone <your_submitted_github_repo>`
    2.  `cd <cloned dir>`
    3. `npm install` (package.json should exist)
    4. `npm run dev` (configured to default port 3000)
3. Start the server with a JSON file. It will always contain at least one post.
    1. `npx json-server --port 3001 ./data/notes.json`
4. Run tests.

### Example HTML
```
<div class="post" id="1">
    <h2>Note 1</h2>
    <small>By Author 1</small>
    <br>
    Content for note 1
</div>
```

```
<div>
    <button name="first">First</button>
    <button name="previous">Previous</button>
    <button name="page-1">1</button>
    <button name="page-2">2</button>
    <button name="page-3">3</button>
    <button name="page-4">4</button>
    <button name="page-5">5</button>
    <button name="next">Next</button>
    <button name="last">Last</button>
</div>
```



## Good luck!

