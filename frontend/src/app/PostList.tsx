"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { not } from "ramda";

const POSTS_PER_PAGE = 10;
const NOTES_URL = 'http://localhost:3001/notes';

export default function App() 
{
  const [ notes, setNotes ] = useState<any[]>([]);
  const [ currPage, setCurrPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(1);
  // const [ totalCount, setTotalCount ] = useState(0);

  const [ flag, setFlag ] = useState(false);
  const [ editMode, setEditMode ] = useState(-1);
  const [ editedContent, setEditedContent ] = useState("");
  const [ addMode, setAddMode ] = useState (false)
  const [ addContent, setAddContent ] = useState("");

  const [theme, setTheme] = useState('light');

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
      if (!response.status)
      {
         console.log("couldnt fech all nodes") ;
      }
      setNotes(response.data.notes);
      setTotalPages(response.data.totalPagesCount);
      setFlag(false)
    }).catch((error: string) => 
      { console.log("Encountered an error:" + error) 

      }
    );
}, [currPage, flag]);

useEffect(() => {
  document.body.className = theme;
}, [theme]);

const handleClick = (page: number) =>
  {
    if (page < 1 || page > totalPages)
      return;
    setCurrPage(page);
    updatePaginationButtons();
  };

  const handleEdit = (noteId:number, currentContent:any) => {
    setEditMode(noteId);
    setEditedContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditMode(-1);
    setEditedContent("");
  };

  const handleSaveEdit = async (noteId:number) => {
    try {
      await axios.put(`${NOTES_URL}/${noteId}`, { content: editedContent });
      setNotes(notes.map((note:any) => note.id === noteId ? { ...note, content: editedContent } : note));
      setEditMode(-1);
      setEditedContent("");
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async (noteId:number) => {
    try {
        await axios.delete(`${NOTES_URL}/${noteId}`);
        setNotes(notes.filter((note) => note.id !== noteId));
        if (currPage !== 1 && notes.length === 1)
          handleClick(currPage - 1)
        setFlag(true)
    } catch (error) {
        console.error('Error deleting note:', error);
    }
};

const handleAdd = () => {
  setAddMode(true);
};

const handleCancelAdd = () => {
  setAddMode(false);
  setAddContent("");
};

const handleSaveAdd = async () => {
  try {
    const response = await axios.post(NOTES_URL, {id: 1003, title:"New Note", author:{name:"New Author", email:"newMail@post.bgu.ac.il"}, content: addContent });
    setFlag(true)
    setAddMode(false);
    setAddContent("");
  } catch (error) {
    console.error('Error Adding note:', error);
  }
};

const handleChangeTheme = async () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

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
        <h1>Notes</h1>
        <br />
        <div className="notes">
          {notes.map((note: any) => (
            <div key={note.id} className="note" id={note.id}>
              <h2>{note.title}</h2>
              <small>By {note.author ? `${note.author.name}, ${note.author.email}` : 'Unknown Author'}</small>
              <br />
              {editMode === note.id ? (
              <div>
                <input
                  type="text"
                  name={`text_input-${note.id}`}
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                />
                <button
                  className="button"
                  name={`text_input_save-${note.id}`}
                  onClick={() => handleSaveEdit(note.id)}
                >
                  Save
                </button>
                <button
                  className="button"
                  name={`text_input_cancel-${note.id}`}
                  onClick={() => handleCancelEdit()}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>{note.content}</p>
                <button
                  className="button"
                  name={`edit-${note.id}`}
                  onClick={() => handleEdit(note.id, note.content)}
                >
                  Edit
                </button>
                <button 
                  className="button"
                  name={`delete-${note.id}`} 
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </button>
              </div>
            )}
            <br />
          </div>
        ))}
      </div>
      {addMode === true ? (
              <div className="pagination">
                <input
                  type="text"
                  name="text_input_new_note"
                  value={addContent}
                  onChange={e => setAddContent(e.target.value)}
                />
                <button
                  className="button"
                  name="text_input_save_new_note"
                  onClick={() => handleSaveAdd()}
                >
                  Save
                </button>
                <button
                  className="button"
                  name="text_input_cancel_new_note"
                  onClick={() => handleCancelAdd()}
                >
                  Cancel
                </button>
              </div>
            ) : (
        <div className="pagination">
        <button
          className="button"
          name="add_new_note"
          onClick={() => handleAdd()}
          >
            Add new note
        </button>
        </div>
        )}

        <div className="pagination">
        <button
          className="button"
          name="change_theme"
          onClick={() => handleChangeTheme()}
          >
            theme
        </button>
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