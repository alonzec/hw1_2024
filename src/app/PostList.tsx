"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const POSTS_PER_PAGE = 10;
const NOTES_URL = 'http://localhost:3001/notes';

export default function App() 
{
  const [ posts, setPosts ] = useState([]);
  const [ currPage, setCurrPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(1);


  useEffect(() =>
  {
    const promise = axios.get(NOTES_URL, 
      {
        params: 
        {
          _page: currPage,
          _per_page: POSTS_PER_PAGE
        }
      }
    );
    promise.then(response => 
    { 
      setPosts(response.data);
      const totalCount = response.headers["x-total-count"];
      const totalPagesCount = Math.ceil(totalCount / POSTS_PER_PAGE);
      setTotalPages(totalPagesCount);
    }).catch(error => 
      { console.log("Encountered an error:" + error) 

      }
    );
}, [currPage]);


const handleClick = (page: number) =>
  {
    if (page < 1 || page > totalPages)
      return;
    setCurrPage(page);
    updatePaginationButtons();
  };

const updatePaginationButtons = () => 
  {
  const buttons = [];
  const maxPages = 5;

  if (totalPages <= maxPages) 
    {
    for (let i = 1; i <= totalPages; i++) 
      {
      buttons.push(
        <button
          key={i}
          name={`page-${i}`}
          className={currPage === i ? "button_selected" : "button"}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>
      );
    }
  } 
  else 
  {
    if (currPage < 3) 
      {
      for (let i = 1; i <= maxPages; i++) 
        {
        buttons.push(
          <button
            key={i}
            name={`page-${i}`}
            className={currPage === i ? "button_selected" : "button"}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>
        );
      }
    } 
    else if (currPage >= 3 && currPage <= totalPages - 2) 
      {
      for (let i = currPage - 2; i <= currPage + 2; i++) 
        {
        buttons.push(
          <button
            key={i}
            name={`page-${i}`}
            className={currPage === i ? "button_selected" : "button"}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>
        );
      }
    }
    else
    {
      for (let i = totalPages - maxPages + 1; i <= totalPages; i++) 
      {
        buttons.push(
          <button
            key={i}
            name={`page-${i}`}
            className={currPage === i ? "button_selected" : "button"}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>
        );
      }
    }
  }

  return buttons;
};


    return (
      <div>
        <h1>Posts</h1>
        <br />
        <div className="posts">
          {posts.map((post: any) => (
            <div key={post.id} className="post" id={post.id}>
              <h2>{post.title}</h2>
              <small>By {post.author.name}, {post.author.email}</small>
              <br />
              <p>{post.content}</p>
              <br />
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
          className="button"
          name="first"
          onClick={() => handleClick(1)}
          >
            First
            </button>
            <button
          className="button"
          name="previous"
          onClick={() => handleClick(currPage - 1)}
          >
            Previous
            </button>
          {updatePaginationButtons()}
          <button
          className="button"
          name="next"
          onClick={() => handleClick(currPage + 1)}
          >
            Next
            </button>
            <button
          className="button"
          name="last"
          onClick={() => handleClick(totalPages)}
          >
            Last
            </button>
        </div>
        </div>
          )
}